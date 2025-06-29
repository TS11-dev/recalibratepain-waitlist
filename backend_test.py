#!/usr/bin/env python3
import requests
import json
import time
import os
from datetime import datetime

# Get backend URL from environment variable
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
WAITLIST_FILE = "/app/backend/waitlist.json"

print(f"Using backend URL: {BACKEND_URL}")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "total": 0,
    "dual_storage_tests": {
        "passed": 0,
        "failed": 0,
        "total": 0
    }
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

def test_health_endpoint():
    """Test the health check endpoint with dual storage status"""
    response = requests.get(f"{BACKEND_URL}/api/health")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for dual storage information
    has_dual_storage_info = (
        "storage" in data and
        "mongodb" in data["storage"] and
        "json_backup" in data["storage"] and
        "dual_storage" in data["storage"]
    )
    
    print(f"Dual storage info present: {has_dual_storage_info}")
    if has_dual_storage_info:
        print(f"MongoDB status: {data['storage']['mongodb']}")
        print(f"JSON backup status: {data['storage']['json_backup']}")
        print(f"Dual storage active: {data['storage']['dual_storage']}")
    
    return (
        response.status_code == 200 and
        data.get("status") == "healthy" and
        data.get("service") == "RecalibratePain Waitlist API" and
        data.get("version") == "3.0.0" and
        has_dual_storage_info
    )

def test_waitlist_count_endpoint():
    """Test the waitlist count endpoint with source information"""
    response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for source information
    has_source_info = "source" in data
    if has_source_info:
        print(f"Data source: {data['source']}")
    
    return (
        response.status_code == 200 and
        "count" in data and
        has_source_info and
        data.get("source") in ["mongodb", "json_backup", "fallback"]
    )

def test_waitlist_export_endpoint():
    """Test the waitlist export endpoint with storage information"""
    response = requests.get(f"{BACKEND_URL}/api/waitlist/export")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for storage information
    has_storage_info = (
        "storage_info" in data and
        "primary_source" in data["storage_info"] and
        "mongodb_entries" in data["storage_info"] and
        "json_backup_entries" in data["storage_info"] and
        "dual_storage_active" in data["storage_info"]
    )
    
    if has_storage_info:
        print(f"Primary source: {data['storage_info']['primary_source']}")
        print(f"MongoDB entries: {data['storage_info']['mongodb_entries']}")
        print(f"JSON backup entries: {data['storage_info']['json_backup_entries']}")
        print(f"Dual storage active: {data['storage_info']['dual_storage_active']}")
    
    return (
        response.status_code == 200 and
        "waitlist" in data and
        "total_count" in data and
        has_storage_info
    )

def test_join_waitlist_valid_data():
    """Test joining waitlist with valid data and verify dual storage"""
    # Generate unique email to avoid duplicates
    timestamp = int(time.time())
    test_data = {
        "name": "Test User",
        "email": f"test.user.{timestamp}@example.com"
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for dual storage information
    has_storage_info = "storage_info" in data
    if has_storage_info:
        print(f"Storage info: {data['storage_info']}")
    
    return (
        response.status_code == 200 and
        data.get("success") == True and
        "total_subscribers" in data and
        has_storage_info and
        ("MongoDB" in data.get("storage_info", "") or "JSON" in data.get("storage_info", ""))
    )

def test_join_waitlist_duplicate_email():
    """Test joining waitlist with duplicate email"""
    # First, add an email
    timestamp = int(time.time())
    test_email = f"duplicate.test.{timestamp}@example.com"
    test_data = {
        "name": "Duplicate Test",
        "email": test_email
    }
    
    # First submission
    first_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"First submission: {first_response.status_code} - {first_response.text}")
    
    # Second submission with same email
    second_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Second submission: {second_response.status_code} - {second_response.text}")
    
    return (
        second_response.status_code == 200 and
        second_response.json().get("success") == True and
        "already on our waitlist" in second_response.json().get("message", "")
    )

def test_join_waitlist_invalid_email():
    """Test joining waitlist with invalid email"""
    test_data = {
        "name": "Invalid Email Test",
        "email": "not-an-email"
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Response: {response.status_code} - {response.text}")
    
    # Should return a validation error
    return response.status_code == 422

def test_join_waitlist_missing_fields():
    """Test joining waitlist with missing required fields"""
    # Missing name
    test_data_missing_name = {
        "email": "test@example.com"
    }
    
    response_missing_name = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data_missing_name
    )
    print(f"Missing name response: {response_missing_name.status_code} - {response_missing_name.text}")
    
    # Missing email
    test_data_missing_email = {
        "name": "Missing Email Test"
    }
    
    response_missing_email = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data_missing_email
    )
    print(f"Missing email response: {response_missing_email.status_code} - {response_missing_email.text}")
    
    # Both should return validation errors
    return (
        response_missing_name.status_code == 422 and
        response_missing_email.status_code == 422
    )

def test_data_persistence():
    """Test that data is correctly persisted to the JSON file"""
    # Add a unique entry
    timestamp = int(time.time())
    test_name = f"Persistence Test {timestamp}"
    test_email = f"persistence.test.{timestamp}@example.com"
    
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Add entry response: {response.status_code} - {response.text}")
    
    # Check if the file exists and contains our entry
    if not os.path.exists(WAITLIST_FILE):
        print(f"Waitlist file not found at {WAITLIST_FILE}")
        return False
    
    try:
        with open(WAITLIST_FILE, 'r') as f:
            waitlist_data = json.load(f)
            
        # Find our test entry
        found = False
        for entry in waitlist_data:
            if entry.get("email") == test_email and entry.get("name") == test_name:
                found = True
                print(f"Found entry in waitlist.json: {entry}")
                break
                
        return found
    except Exception as e:
        print(f"Error reading waitlist file: {str(e)}")
        return False

def test_cors_headers():
    """Test that CORS headers are properly set"""
    # Send an OPTIONS request to check CORS headers
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
    
    response = requests.options(
        f"{BACKEND_URL}/api/waitlist/join",
        headers=headers
    )
    
    print(f"CORS headers: {dict(response.headers)}")
    
    return (
        response.status_code == 200 and
        "Access-Control-Allow-Origin" in response.headers and
        "Access-Control-Allow-Methods" in response.headers and
        "Access-Control-Allow-Headers" in response.headers
    )

def test_waitlist_stats_endpoint():
    """Test the waitlist stats endpoint"""
    response = requests.get(f"{BACKEND_URL}/api/waitlist/stats")
    print(f"Response: {response.status_code} - {response.text}")
    
    return (
        response.status_code == 200 and
        "total_subscribers" in response.json() and
        "recent_signups" in response.json() and
        "today_signups" in response.json() and
        "timestamp" in response.json()
    )

def test_root_endpoint():
    """Test the root endpoint"""
    response = requests.get(f"{BACKEND_URL}/")
    print(f"Response: {response.status_code} - {response.text}")
    
    return (
        response.status_code == 200 and
        "message" in response.json() and
        "version" in response.json() and
        "status" in response.json()
    )

def test_production_readiness():
    """Test that the backend is ready for production deployment"""
    # Check that the backend is using the correct port
    print(f"Backend URL: {BACKEND_URL}")
    
    # Test that the backend is accessible
    health_response = requests.get(f"{BACKEND_URL}/api/health")
    print(f"Health response: {health_response.status_code}")
    
    # Test that the backend can handle environment variables
    # This is implicitly tested by using BACKEND_URL from environment
    
    # Check that all required endpoints are available
    endpoints = [
        "/",
        "/api/health",
        "/api/waitlist/count",
        "/api/waitlist/export",
        "/api/waitlist/stats"
    ]
    
    all_endpoints_working = True
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            print(f"Endpoint {endpoint}: {response.status_code}")
            if response.status_code != 200:
                all_endpoints_working = False
        except Exception as e:
            print(f"Error accessing {endpoint}: {str(e)}")
            all_endpoints_working = False
    
    return all_endpoints_working

def test_subscriber_count_accuracy():
    """Test that subscriber count is accurate"""
    # Get current count
    count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    initial_count = count_response.json().get("count", 0)
    print(f"Initial count: {initial_count}")
    
    # Add a new subscriber
    timestamp = int(time.time())
    test_data = {
        "name": f"Count Test {timestamp}",
        "email": f"count.test.{timestamp}@example.com"
    }
    
    join_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Add entry response: {join_response.status_code} - {join_response.text}")
    
    # Get updated count
    updated_count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    updated_count = updated_count_response.json().get("count", 0)
    print(f"Updated count: {updated_count}")
    
    # Count should have increased by 1
    return updated_count == initial_count + 1

def run_all_tests():
    """Run all tests and print summary"""
    print("\n🧪 STARTING BACKEND API TESTS 🧪\n")
    
    # Basic endpoint tests
    run_test("Health Endpoint", test_health_endpoint)
    run_test("Root Endpoint", test_root_endpoint)
    run_test("Waitlist Count Endpoint", test_waitlist_count_endpoint)
    run_test("Waitlist Export Endpoint", test_waitlist_export_endpoint)
    run_test("Waitlist Stats Endpoint", test_waitlist_stats_endpoint)
    
    # Waitlist join tests
    run_test("Join Waitlist - Valid Data", test_join_waitlist_valid_data)
    run_test("Join Waitlist - Duplicate Email", test_join_waitlist_duplicate_email)
    run_test("Join Waitlist - Invalid Email", test_join_waitlist_invalid_email)
    run_test("Join Waitlist - Missing Fields", test_join_waitlist_missing_fields)
    
    # Data persistence and accuracy tests
    run_test("Data Persistence", test_data_persistence)
    run_test("Subscriber Count Accuracy", test_subscriber_count_accuracy)
    
    # CORS test
    run_test("CORS Headers", test_cors_headers)
    
    # Production readiness test
    run_test("Production Readiness", test_production_readiness)
    
    # Print summary
    print(f"\n{'='*80}")
    print(f"TEST SUMMARY: {test_results['passed']}/{test_results['total']} tests passed")
    print(f"  ✅ Passed: {test_results['passed']}")
    print(f"  ❌ Failed: {test_results['failed']}")
    print(f"{'='*80}\n")
    
    return test_results['failed'] == 0

if __name__ == "__main__":
    run_all_tests()