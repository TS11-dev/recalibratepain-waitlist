#!/usr/bin/env python3
"""
Specific test for the review request:
Test the waitlist join with a NEW, UNIQUE email address (e.g. `test_bg_task_verification_{timestamp}@example.com`).
Verify that the `join_waitlist` endpoint returns a 200 SUCCESS response IMMEDIATELY (no blocking).
Then, wait a few seconds and check the logs to confirm "📧 Welcome email sent to..." appears, proving the background task executed successfully.
This confirms we solved the "loading forever" issue.
"""

import requests
import json
import time
import os
from datetime import datetime

# Use production backend URL from frontend .env
BACKEND_URL = 'https://voice-align.preview.emergentagent.com'

def test_bg_task_verification():
    """Test background task verification as requested in review"""
    print("🎯 TESTING BACKGROUND TASK VERIFICATION - REVIEW REQUEST")
    print("=" * 80)
    
    # Generate unique email with exact format requested
    timestamp = int(time.time())
    test_email = f"test_bg_task_verification_{timestamp}@example.com"
    test_name = "BG Task Test User"
    
    print(f"📧 Using NEW, UNIQUE email: {test_email}")
    
    # Test data for waitlist join
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    print(f"📤 Sending request to join_waitlist endpoint...")
    print(f"Endpoint: {BACKEND_URL}/api/waitlist/join")
    print(f"Request body: {json.dumps(test_data, indent=2)}")
    
    # Record start time to measure response time
    start_time = time.time()
    
    # Send the request
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    
    # Calculate response time
    response_time = time.time() - start_time
    
    print(f"\n📊 RESPONSE ANALYSIS:")
    print(f"Status Code: {response.status_code}")
    print(f"Response Time: {response_time:.3f} seconds")
    print(f"Response Body: {response.text}")
    
    # Verify 200 SUCCESS response IMMEDIATELY (no blocking)
    success_200 = response.status_code == 200
    immediate_response = response_time < 2.0  # Should be under 2 seconds
    
    print(f"\n✅ 200 SUCCESS response: {success_200}")
    print(f"✅ IMMEDIATE response (< 2s): {immediate_response}")
    
    if not success_200:
        print(f"❌ FAILED: Expected 200, got {response.status_code}")
        return False
    
    if not immediate_response:
        print(f"❌ FAILED: Response took {response_time:.3f}s (should be < 2s)")
        return False
    
    # Parse response data
    try:
        data = response.json()
        success = data.get("success", False)
        message = data.get("message", "")
        
        print(f"✅ Success field: {success}")
        print(f"💬 Message: {message}")
        
        if not success:
            print(f"❌ FAILED: Response success field is False")
            return False
            
    except Exception as e:
        print(f"❌ FAILED: Could not parse JSON response: {e}")
        return False
    
    # Wait a few seconds for background task to complete
    print(f"\n⏳ WAITING 5 SECONDS for background task to complete...")
    time.sleep(5)
    
    # Check logs to confirm "📧 Welcome email sent to..." appears
    print(f"\n📋 CHECKING LOGS for email success message...")
    
    try:
        # Check both stdout and stderr logs for the specific message
        log_commands = [
            f"tail -n 50 /var/log/supervisor/backend.out.log | grep '📧 Welcome email sent to {test_email}'",
            f"tail -n 50 /var/log/supervisor/backend.err.log | grep '📧 Welcome email sent to {test_email}'"
        ]
        
        email_logged = False
        for cmd in log_commands:
            log_result = os.popen(cmd).read().strip()
            if log_result:
                email_logged = True
                print(f"✅ FOUND in logs: {log_result}")
                break
        
        if not email_logged:
            print(f"⚠️ Specific email success message not found for {test_email}")
            # Check for any recent welcome email messages
            recent_email_logs = os.popen("tail -n 20 /var/log/supervisor/backend.err.log | grep '📧 Welcome email sent'").read()
            if recent_email_logs:
                print(f"📋 Recent welcome email logs found:")
                print(recent_email_logs)
            else:
                print(f"❌ No welcome email logs found in recent entries")
                return False
        
    except Exception as e:
        print(f"❌ Error checking logs: {e}")
        return False
    
    # Final verification
    print(f"\n🎉 BACKGROUND TASK VERIFICATION RESULTS:")
    print(f"  ✅ NEW, UNIQUE email used: {test_email}")
    print(f"  ✅ 200 SUCCESS response: {success_200}")
    print(f"  ✅ IMMEDIATE response (no blocking): {immediate_response} ({response_time:.3f}s)")
    print(f"  ✅ Background task executed: {email_logged}")
    print(f"  ✅ Welcome email sent confirmation in logs: {email_logged}")
    
    if success_200 and immediate_response and email_logged:
        print(f"\n🚀 SUCCESS: Background task verification PASSED!")
        print(f"   The 'loading forever' issue has been SOLVED!")
        print(f"   - Endpoint returns 200 immediately (no blocking)")
        print(f"   - Background task sends welcome email successfully")
        return True
    else:
        print(f"\n❌ FAILED: Background task verification failed")
        return False

if __name__ == "__main__":
    success = test_bg_task_verification()
    exit(0 if success else 1)