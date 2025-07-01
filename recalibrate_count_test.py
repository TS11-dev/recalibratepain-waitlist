#!/usr/bin/env python3
import requests
import json
import time
import os
import random
from datetime import datetime

# Get backend URL from environment variable
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')

print(f"Using backend URL: {BACKEND_URL}")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "total": 0
}

def run_test(test_name, test_func):
    """Run a test and track results"""
    print(f"\n{'='*80}\nTEST: {test_name}\n{'='*80}")
    test_results["total"] += 1
    
    try:
        result = test_func()
        if result:
            test_results["passed"] += 1
            print(f"✅ PASS: {test_name}")
        else:
            test_results["failed"] += 1
            print(f"❌ FAIL: {test_name}")
        return result
    except Exception as e:
        test_results["failed"] += 1
        print(f"❌ ERROR: {test_name} - {str(e)}")
        return False

def test_health_check():
    """Test the health check endpoint to ensure backend is running properly"""
    start_time = time.time()
    response = requests.get(f"{BACKEND_URL}/api/health")
    response_time = time.time() - start_time
    
    print(f"Response time: {response_time:.4f} seconds")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for required fields
    required_fields = ["status", "service", "version", "subscribers", "actual_subscribers", "storage"]
    all_fields_present = all(field in data for field in required_fields)
    
    # Check for storage information
    storage_fields = ["mongodb", "json_backup", "dual_storage"]
    storage_info_present = all(field in data["storage"] for field in storage_fields)
    
    return (
        response.status_code == 200 and
        data.get("status") == "healthy" and
        all_fields_present and
        storage_info_present and
        response_time < 2.0  # Response should be quick
    )

def test_current_count():
    """Test the waitlist count endpoint to verify it returns the real-time count"""
    start_time = time.time()
    response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    response_time = time.time() - start_time
    
    print(f"Response time: {response_time:.4f} seconds")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for required fields
    required_fields = ["count", "timestamp", "source"]
    all_fields_present = all(field in data for field in required_fields)
    
    return (
        response.status_code == 200 and
        all_fields_present and
        isinstance(data.get("count"), int) and
        data.get("source") in ["mongodb", "json_backup", "fallback"] and
        response_time < 1.0  # Count response should be very quick
    )

def test_add_subscriber():
    """Test adding a new subscriber and verify the count increases immediately"""
    # Get current count
    initial_count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    initial_count = initial_count_response.json().get("count", 0)
    print(f"Initial count: {initial_count}")
    
    # Add a new subscriber with random data to avoid duplicates
    timestamp = int(time.time())
    random_suffix = random.randint(1000, 9999)
    test_data = {
        "name": f"Test User {timestamp}-{random_suffix}",
        "email": f"test.user.{timestamp}.{random_suffix}@example.com"
    }
    
    print(f"Adding new subscriber: {test_data}")
    start_time = time.time()
    join_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    join_response_time = time.time() - start_time
    
    print(f"Join response time: {join_response_time:.4f} seconds")
    print(f"Join response: {join_response.status_code} - {join_response.text}")
    
    join_data = join_response.json()
    
    # Verify the join was successful
    join_success = (
        join_response.status_code == 200 and
        join_data.get("success") == True and
        "total_subscribers" in join_data
    )
    
    if not join_success:
        print("Failed to add subscriber")
        return False
    
    # Get the updated count immediately
    start_time = time.time()
    updated_count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    count_response_time = time.time() - start_time
    
    print(f"Count response time: {count_response_time:.4f} seconds")
    print(f"Updated count response: {updated_count_response.status_code} - {updated_count_response.text}")
    
    updated_count = updated_count_response.json().get("count", 0)
    print(f"Updated count: {updated_count}")
    
    # The count should have increased by exactly 1
    count_increased = updated_count == initial_count + 1
    
    if not count_increased:
        print(f"Count did not increase correctly. Expected {initial_count + 1}, got {updated_count}")
    
    return join_success and count_increased

def test_real_time_updates():
    """Test that the count endpoint shows real-time updates after adding subscribers"""
    # Get initial count
    initial_count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    initial_count = initial_count_response.json().get("count", 0)
    print(f"Initial count: {initial_count}")
    
    # Add multiple subscribers in sequence and verify count updates each time
    num_subscribers = 3
    current_count = initial_count
    
    for i in range(num_subscribers):
        # Add a new subscriber
        timestamp = int(time.time())
        random_suffix = random.randint(1000, 9999)
        test_data = {
            "name": f"Real-time Test User {i+1}-{timestamp}-{random_suffix}",
            "email": f"realtime.test.{i+1}.{timestamp}.{random_suffix}@example.com"
        }
        
        print(f"Adding subscriber {i+1}: {test_data}")
        join_response = requests.post(
            f"{BACKEND_URL}/api/waitlist/join", 
            json=test_data
        )
        
        if join_response.status_code != 200:
            print(f"Failed to add subscriber {i+1}")
            return False
        
        # Get the updated count immediately
        count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
        new_count = count_response.json().get("count", 0)
        print(f"Count after adding subscriber {i+1}: {new_count}")
        
        # Verify count increased by exactly 1
        expected_count = current_count + 1
        if new_count != expected_count:
            print(f"Count did not update correctly. Expected {expected_count}, got {new_count}")
            return False
        
        current_count = new_count
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    # Final verification: the count should have increased by exactly the number of subscribers added
    final_count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    final_count = final_count_response.json().get("count", 0)
    print(f"Final count: {final_count}")
    
    expected_final_count = initial_count + num_subscribers
    count_correct = final_count == expected_final_count
    
    if not count_correct:
        print(f"Final count incorrect. Expected {expected_final_count}, got {final_count}")
    
    return count_correct

def test_consistent_data():
    """Test that the API returns consistent data across multiple calls"""
    # Make multiple calls to the count endpoint and verify consistency
    num_calls = 5
    counts = []
    
    print(f"Making {num_calls} consecutive calls to count endpoint...")
    
    for i in range(num_calls):
        response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
        count = response.json().get("count", 0)
        source = response.json().get("source", "unknown")
        counts.append((count, source))
        print(f"Call {i+1}: Count = {count}, Source = {source}")
        
        # Small delay between calls
        time.sleep(0.5)
    
    # All counts should be the same (unless a new subscriber was added during testing)
    consistent = all(count == counts[0][0] for count, _ in counts)
    
    # All sources should be the same
    same_source = all(source == counts[0][1] for _, source in counts)
    
    if not consistent:
        print("WARNING: Counts were not consistent across calls. This could indicate a caching issue.")
        print(f"Counts received: {[count for count, _ in counts]}")
    
    if not same_source:
        print("WARNING: Data sources changed between calls. This could indicate a failover or configuration issue.")
        print(f"Sources received: {[source for _, source in counts]}")
    
    return consistent and same_source

def test_no_caching_issues():
    """Test that there are no caching issues with the count endpoint"""
    # Get initial count
    initial_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    initial_count = initial_response.json().get("count", 0)
    print(f"Initial count: {initial_count}")
    
    # Add a new subscriber
    timestamp = int(time.time())
    random_suffix = random.randint(1000, 9999)
    test_data = {
        "name": f"Cache Test User {timestamp}-{random_suffix}",
        "email": f"cache.test.{timestamp}.{random_suffix}@example.com"
    }
    
    print(f"Adding new subscriber: {test_data}")
    join_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    
    if join_response.status_code != 200:
        print("Failed to add subscriber")
        return False
    
    # Immediately check the count multiple times to verify no caching
    num_checks = 3
    all_counts_updated = True
    
    for i in range(num_checks):
        count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
        current_count = count_response.json().get("count", 0)
        print(f"Check {i+1}: Count = {current_count}")
        
        if current_count != initial_count + 1:
            print(f"Count not updated correctly on check {i+1}. Expected {initial_count + 1}, got {current_count}")
            all_counts_updated = False
        
        # Add cache-busting parameter to force fresh request
        cache_buster = f"?nocache={time.time()}"
        cache_bust_response = requests.get(f"{BACKEND_URL}/api/waitlist/count{cache_buster}")
        cache_bust_count = cache_bust_response.json().get("count", 0)
        print(f"Check {i+1} with cache-buster: Count = {cache_bust_count}")
        
        if cache_bust_count != initial_count + 1:
            print(f"Count with cache-buster not updated correctly. Expected {initial_count + 1}, got {cache_bust_count}")
            all_counts_updated = False
        
        # Small delay between checks
        time.sleep(0.5)
    
    return all_counts_updated

def run_focused_tests():
    """Run the focused tests for the RecalibratePain waitlist API"""
    print("\n🧪 STARTING RECALIBRATEPAIN WAITLIST API TESTS 🧪\n")
    
    # Run the tests in sequence
    run_test("Health Check", test_health_check)
    run_test("Current Count", test_current_count)
    run_test("Add Subscriber", test_add_subscriber)
    run_test("Real-Time Updates", test_real_time_updates)
    run_test("Consistent Data", test_consistent_data)
    run_test("No Caching Issues", test_no_caching_issues)
    
    # Print summary
    print(f"\n{'='*80}")
    print(f"TEST SUMMARY: {test_results['passed']}/{test_results['total']} tests passed")
    print(f"  ✅ Passed: {test_results['passed']}")
    print(f"  ❌ Failed: {test_results['failed']}")
    print(f"{'='*80}\n")
    
    return test_results['failed'] == 0

if __name__ == "__main__":
    run_focused_tests()