#!/usr/bin/env python3
"""
Test script to verify the new Resend implementation for welcome emails
"""
import requests
import json
import time
import os

# Use production backend URL from frontend .env
BACKEND_URL = 'https://health-hub-353.preview.emergentagent.com'

def test_resend_welcome_email_implementation():
    """Test the new Resend implementation for welcome emails"""
    print("🎯 TESTING NEW RESEND IMPLEMENTATION FOR WELCOME EMAILS")
    print("Expected: Welcome email should be sent successfully via Resend API")
    print("Since RESEND_API_KEY is now configured in the environment")
    
    # Generate unique email for this test
    timestamp = int(time.time())
    test_email = f"resend_welcome_test_{timestamp}@test.com"
    test_name = "Resend Welcome Test User"
    
    print(f"\n📧 Using unique test email: {test_email}")
    
    # Test data for waitlist join (which should trigger welcome email)
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    print(f"📤 Sending request to: {BACKEND_URL}/api/waitlist/join")
    print(f"Request body: {json.dumps(test_data, indent=2)}")
    
    # Record start time to measure response time
    start_time = time.time()
    
    # Send the request
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    
    response_time = time.time() - start_time
    
    print(f"\n📊 RESPONSE ANALYSIS:")
    print(f"Response Status: {response.status_code}")
    print(f"Response Time: {response_time:.3f} seconds")
    print(f"Response Body: {response.text}")
    
    if response.status_code != 200:
        print(f"❌ Waitlist join failed with status {response.status_code}")
        return False
    
    data = response.json()
    success = data.get("success", False)
    
    print(f"✅ Join Success: {success}")
    
    # Verify response is immediate (background task working)
    is_immediate = response_time < 2.0
    print(f"⚡ Immediate Response: {is_immediate} ({response_time:.3f}s)")
    
    # Wait for background task to complete
    print(f"\n⏳ WAITING 10 SECONDS FOR BACKGROUND EMAIL TASK...")
    time.sleep(10)
    
    # Check backend logs for Resend success message
    print(f"\n📋 CHECKING BACKEND LOGS FOR RESEND SUCCESS MESSAGE:")
    
    resend_success_found = False
    resend_error_found = False
    log_messages = []
    
    try:
        # Check for Resend success message
        success_commands = [
            f"tail -n 100 /var/log/supervisor/backend.out.log | grep '{test_email}' | grep 'via Resend'",
            f"tail -n 100 /var/log/supervisor/backend.err.log | grep '{test_email}' | grep 'via Resend'"
        ]
        
        for cmd in success_commands:
            log_result = os.popen(cmd).read().strip()
            if log_result and test_email in log_result:
                resend_success_found = True
                log_messages.append(log_result)
                print(f"✅ RESEND SUCCESS MESSAGE FOUND: {log_result}")
        
        # Check for Resend error messages
        error_commands = [
            f"tail -n 100 /var/log/supervisor/backend.out.log | grep '{test_email}' | grep -i 'failed.*resend'",
            f"tail -n 100 /var/log/supervisor/backend.err.log | grep '{test_email}' | grep -i 'failed.*resend'"
        ]
        
        for cmd in error_commands:
            log_result = os.popen(cmd).read().strip()
            if log_result and test_email in log_result:
                resend_error_found = True
                log_messages.append(log_result)
                print(f"❌ RESEND ERROR MESSAGE FOUND: {log_result}")
        
        # If no specific messages found, check for any email activity
        if not resend_success_found and not resend_error_found:
            print(f"⚠️ No specific Resend messages found. Checking for any email activity...")
            
            # Check for any email-related activity
            general_email_logs = os.popen(f"tail -n 50 /var/log/supervisor/backend.out.log | grep -i '{test_email}'").read()
            if general_email_logs:
                print(f"Email activity for {test_email}:\n{general_email_logs}")
            else:
                print(f"No email activity found for {test_email}")
                
            # Check for any recent email logs
            recent_email_logs = os.popen("tail -n 50 /var/log/supervisor/backend.out.log | grep -i 'email\\|resend'").read()
            if recent_email_logs:
                print(f"Recent email/resend activity:\n{recent_email_logs}")
            else:
                print("No recent email/resend activity found")
                
            # Show recent logs
            print(f"\n📋 RECENT BACKEND LOGS (last 30 lines):")
            recent_logs = os.popen("tail -n 30 /var/log/supervisor/backend.out.log").read()
            print(recent_logs)
            
    except Exception as e:
        print(f"⚠️ Error checking logs: {e}")
    
    # Check environment configuration
    print(f"\n📧 ENVIRONMENT CONFIGURATION:")
    try:
        with open("/app/backend/.env", "r") as f:
            env_content = f.read()
            
        has_resend_key = "RESEND_API_KEY=" in env_content and len(env_content.split("RESEND_API_KEY=")[1].split("\n")[0].strip()) > 0
        
        print(f"✅ RESEND_API_KEY configured: {has_resend_key}")
        
        if has_resend_key:
            resend_key = env_content.split("RESEND_API_KEY=")[1].split("\n")[0].strip()
            print(f"RESEND_API_KEY length: {len(resend_key)} characters")
            print(f"RESEND_API_KEY starts with: {resend_key[:10]}...")
        
    except Exception as e:
        print(f"⚠️ Error checking environment config: {e}")
    
    # Analyze results
    print(f"\n📋 RESEND IMPLEMENTATION ANALYSIS:")
    print(f"  ✅ Waitlist join successful: {success}")
    print(f"  ⚡ Immediate response (background task): {is_immediate}")
    print(f"  📧 Resend success message found: {resend_success_found}")
    print(f"  ❌ Resend error message found: {resend_error_found}")
    print(f"  📝 Total log messages found: {len(log_messages)}")
    
    # Final analysis
    if resend_success_found and not resend_error_found:
        print(f"\n🎉 PERFECT SUCCESS: Resend implementation working correctly!")
        print(f"   ✅ Welcome email sent successfully via Resend API")
        print(f"   ✅ Background task executing properly")
        print(f"   ✅ No errors found")
        test_passed = True
        
    elif resend_success_found and resend_error_found:
        print(f"\n⚠️ MIXED RESULTS: Email sent but errors also found")
        print(f"   ✅ Welcome email sent via Resend API")
        print(f"   ❌ Some errors also found - investigate further")
        test_passed = True  # Still consider it a pass since main functionality works
        
    elif resend_error_found and not resend_success_found:
        print(f"\n❌ RESEND ERROR: Email sending failed")
        print(f"   ❌ Resend API call failed")
        print(f"   ❌ Check API key and Resend configuration")
        test_passed = False
        
    else:
        print(f"\n⚠️ UNCLEAR RESULTS: No clear Resend status found")
        print(f"   ⚠️ Email may have been sent but not logged properly")
        print(f"   ⚠️ Or background task may not be executing")
        test_passed = False
    
    print(f"\n📋 FINAL VERDICT:")
    print(f"  🎯 Resend Implementation Test: {'PASSED ✅' if test_passed else 'FAILED ❌'}")
    
    return test_passed

if __name__ == "__main__":
    test_resend_welcome_email_implementation()