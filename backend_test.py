#!/usr/bin/env python3
import requests
import json
import time
import os
from datetime import datetime

# Use production backend URL from frontend .env
BACKEND_URL = 'https://recalipain-1.preview.emergentagent.com'
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

def test_dual_storage_functionality():
    """Test that the dual storage system is working correctly"""
    # This test will add a new entry and verify it's stored in both MongoDB and JSON
    
    # Generate unique email to avoid duplicates
    timestamp = int(time.time())
    test_name = f"Dual Storage Test {timestamp}"
    test_email = f"dual.storage.test.{timestamp}@example.com"
    
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    # Add the entry
    join_response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    print(f"Add entry response: {join_response.status_code} - {join_response.text}")
    
    if join_response.status_code != 200:
        print("Failed to add test entry")
        return False
    
    # Check storage_info for dual storage confirmation
    storage_info = join_response.json().get("storage_info", "")
    dual_storage_confirmed = "MongoDB + JSON" in storage_info
    print(f"Dual storage confirmed in response: {dual_storage_confirmed}")
    print(f"Storage info: {storage_info}")
    
    # Check if entry exists in exported data
    export_response = requests.get(f"{BACKEND_URL}/api/waitlist/export")
    if export_response.status_code != 200:
        print("Failed to export waitlist data")
        return False
    
    export_data = export_response.json()
    waitlist = export_data.get("waitlist", [])
    storage_info = export_data.get("storage_info", {})
    
    # Check if our entry exists in the waitlist
    entry_found = False
    for entry in waitlist:
        if entry.get("email") == test_email and entry.get("name") == test_name:
            entry_found = True
            print(f"Found entry in exported data: {entry}")
            break
    
    # Check if the entry was stored in MongoDB
    mongodb_active = storage_info.get("primary_source") == "mongodb"
    mongodb_has_entries = storage_info.get("mongodb_entries", 0) > 0
    
    # Check if the entry was stored in JSON backup
    json_has_entries = storage_info.get("json_backup_entries", 0) > 0
    
    # Check if dual storage is active
    dual_storage_active = storage_info.get("dual_storage_active", False)
    
    print(f"MongoDB active: {mongodb_active}")
    print(f"MongoDB has entries: {mongodb_has_entries}")
    print(f"JSON has entries: {json_has_entries}")
    print(f"Dual storage active: {dual_storage_active}")
    
    # For this test to pass, we need:
    # 1. Entry to be found in the exported data
    # 2. Storage info to indicate dual storage is active
    # 3. Both MongoDB and JSON to have entries
    return (
        entry_found and
        dual_storage_active and
        mongodb_has_entries and
        json_has_entries
    )

def test_mongodb_primary_source():
    """Test that MongoDB is used as the primary data source when available"""
    # Get the export data which includes storage info
    export_response = requests.get(f"{BACKEND_URL}/api/waitlist/export")
    if export_response.status_code != 200:
        print("Failed to export waitlist data")
        return False
    
    export_data = export_response.json()
    storage_info = export_data.get("storage_info", {})
    
    # Check if MongoDB is the primary source
    primary_source = storage_info.get("primary_source", "")
    print(f"Primary data source: {primary_source}")
    
    # Get the count endpoint data which also includes source info
    count_response = requests.get(f"{BACKEND_URL}/api/waitlist/count")
    if count_response.status_code != 200:
        print("Failed to get count data")
        return False
    
    count_data = count_response.json()
    count_source = count_data.get("source", "")
    print(f"Count data source: {count_source}")
    
    # Get the stats endpoint data which also includes source info
    stats_response = requests.get(f"{BACKEND_URL}/api/waitlist/stats")
    if stats_response.status_code != 200:
        print("Failed to get stats data")
        return False
    
    stats_data = stats_response.json()
    stats_source = stats_data.get("storage_source", "")
    print(f"Stats data source: {stats_source}")
    
    # For this test to pass, MongoDB should be the primary source for all endpoints
    # if dual storage is active
    dual_storage_active = storage_info.get("dual_storage_active", False)
    
    if dual_storage_active:
        return (
            primary_source == "mongodb" and
            count_source == "mongodb" and
            stats_source == "mongodb"
        )
    else:
        # If dual storage is not active, we should be using JSON backup
        print("Dual storage not active, checking for JSON backup usage")
        return (
            primary_source == "json_backup" and
            count_source == "json_backup" and
            stats_source == "json_backup"
        )

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
    """Test the waitlist stats endpoint with storage source information"""
    response = requests.get(f"{BACKEND_URL}/api/waitlist/stats")
    print(f"Response: {response.status_code} - {response.text}")
    
    data = response.json()
    
    # Check for storage source information
    has_storage_source = "storage_source" in data
    if has_storage_source:
        print(f"Storage source: {data['storage_source']}")
    
    return (
        response.status_code == 200 and
        "total_subscribers" in data and
        "recent_signups" in data and
        "today_signups" in data and
        "timestamp" in data and
        has_storage_source and
        data.get("storage_source") in ["mongodb", "json_backup", "empty"]
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

def test_partner_contact_form():
    """Test the Partner Contact Form endpoint (/api/partner/contact)"""
    # Test data for partner contact form
    timestamp = int(time.time())
    test_data = {
        "type": "clinic",
        "name": f"Dr. Test Partner {timestamp}",
        "email": f"partner.test.{timestamp}@testclinic.com",
        "organization": f"Test Medical Clinic {timestamp}",
        "message": "We are interested in partnering with RecalibratePain for our chronic pain management program."
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/partner/contact", 
        json=test_data
    )
    print(f"Response: {response.status_code} - {response.text}")
    
    if response.status_code != 200:
        print(f"❌ Partner contact form failed with status {response.status_code}")
        return False
    
    data = response.json()
    
    # Verify that it returns success=True even if email fails (graceful handling)
    success = data.get("success", False)
    message = data.get("message", "")
    contact_type = data.get("type", "")
    email_sent = data.get("email_sent", False)
    
    print(f"Success: {success}")
    print(f"Message: {message}")
    print(f"Type: {contact_type}")
    print(f"Email sent: {email_sent}")
    
    # The endpoint should return success=True regardless of email status
    # This tests graceful email failure handling
    return (
        success == True and
        contact_type == "clinic" and
        "thank you" in message.lower()
    )

def test_health_endpoint_waitlist_count():
    """Test Health endpoint to verify Waitlist Count is 194 (191 base + 3 test)"""
    response = requests.get(f"{BACKEND_URL}/api/health")
    print(f"Response: {response.status_code} - {response.text}")
    
    if response.status_code != 200:
        print(f"❌ Health endpoint failed with status {response.status_code}")
        return False
    
    data = response.json()
    
    # Check the subscriber count
    subscribers = data.get("subscribers", 0)
    actual_subscribers = data.get("actual_subscribers", 0)
    
    print(f"Total subscribers (display): {subscribers}")
    print(f"Actual subscribers: {actual_subscribers}")
    print(f"Expected total: 194 (191 base + 3 test)")
    
    # Verify the count is 194 as expected (191 base + 3 test)
    expected_count = 194
    
    return subscribers == expected_count

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
        "/api/waitlist/stats",
        "/api/partner/contact"  # Added partner contact endpoint
    ]
    
    all_endpoints_working = True
    for endpoint in endpoints:
        try:
            if endpoint == "/api/partner/contact":
                # POST endpoint - test with minimal data
                test_data = {
                    "type": "test",
                    "name": "Test",
                    "email": "test@test.com",
                    "organization": "Test Org",
                    "message": "Test message"
                }
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=test_data)
            else:
                response = requests.get(f"{BACKEND_URL}{endpoint}")
            print(f"Endpoint {endpoint}: {response.status_code}")
            if response.status_code not in [200, 422]:  # 422 is acceptable for validation errors
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
    print("\n🔍 TESTING SPECIFIC REVIEW REQUIREMENTS 🔍\n")
    
    # Priority tests from review request
    run_test("Partner Contact Form Endpoint", test_partner_contact_form)
    run_test("Health Endpoint - Waitlist Count Verification (194)", test_health_endpoint_waitlist_count)
    
    print("\n🔍 TESTING DUAL STORAGE SYSTEM (MongoDB + JSON) 🔍\n")
    
    # Basic endpoint tests
    run_test("Health Endpoint with Dual Storage Status", test_health_endpoint)
    run_test("Root Endpoint", test_root_endpoint)
    run_test("Waitlist Count Endpoint with Source Info", test_waitlist_count_endpoint)
    run_test("Waitlist Export Endpoint with Storage Info", test_waitlist_export_endpoint)
    run_test("Waitlist Stats Endpoint with Storage Source", test_waitlist_stats_endpoint)
    
    # Waitlist join tests
    run_test("Join Waitlist - Valid Data with Dual Storage", test_join_waitlist_valid_data)
    run_test("Join Waitlist - Duplicate Email", test_join_waitlist_duplicate_email)
    run_test("Join Waitlist - Invalid Email", test_join_waitlist_invalid_email)
    run_test("Join Waitlist - Missing Fields", test_join_waitlist_missing_fields)
    
    # Data persistence and accuracy tests
    run_test("Data Persistence in JSON", test_data_persistence)
    run_test("Dual Storage Functionality", test_dual_storage_functionality)
    run_test("MongoDB Primary Source", test_mongodb_primary_source)
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