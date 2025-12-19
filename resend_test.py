#!/usr/bin/env python3
"""
Test script to verify Resend logic for welcome emails
"""
import requests
import json
import time
import os

# Use production backend URL from frontend .env
BACKEND_URL = 'https://painredesign.preview.emergentagent.com'

def test_resend_welcome_email_logic():
    """Test the Resend logic for welcome emails as requested in review"""
    print("🎯 TESTING RESEND LOGIC FOR WELCOME EMAILS")
    print("Review Request: Verify logs show 'ℹ️ Skipped welcome email (RESEND_API_KEY missing)'")
    print("Since no RESEND_API_KEY is configured in this environment")
    
    # Generate unique email for this test
    timestamp = int(time.time())
    test_email = f"resend_test_{timestamp}@test.com"
    test_name = "Resend Test User"
    
    print(f"\n📧 Using unique test email: {test_email}")
    
    # Test data for waitlist join (which should trigger welcome email)
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    print(f"📤 Sending request to: {BACKEND_URL}/api/waitlist/join")
    print(f"Request body: {json.dumps(test_data, indent=2)}")
    
    # Send the request
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    
    print(f"\n📊 RESPONSE ANALYSIS:")
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code != 200:
        print(f"❌ Waitlist join failed with status {response.status_code}")
        return False
    
    data = response.json()
    success = data.get("success", False)
    
    print(f"✅ Join Success: {success}")
    
    # Wait for background task to complete
    print(f"\n⏳ WAITING 8 SECONDS FOR BACKGROUND EMAIL TASK...")
    time.sleep(8)
    
    # Check backend logs for Resend skip message
    print(f"\n📋 CHECKING BACKEND LOGS FOR RESEND SKIP MESSAGE:")
    
    resend_skip_found = False
    mail_password_skip_found = False
    log_messages = []
    
    try:
        # Check for the specific Resend skip message
        resend_commands = [
            f"tail -n 100 /var/log/supervisor/backend.out.log | grep -i 'skipped welcome email.*resend_api_key'",
            f"tail -n 100 /var/log/supervisor/backend.err.log | grep -i 'skipped welcome email.*resend_api_key'"
        ]
        
        for cmd in resend_commands:
            log_result = os.popen(cmd).read().strip()
            if log_result:
                resend_skip_found = True
                log_messages.append(log_result)
                print(f"✅ RESEND SKIP MESSAGE FOUND: {log_result}")
        
        # Check for the current MAIL_PASSWORD skip message (current implementation)
        mail_commands = [
            f"tail -n 100 /var/log/supervisor/backend.out.log | grep -i 'skipped welcome email.*mail_password'",
            f"tail -n 100 /var/log/supervisor/backend.err.log | grep -i 'skipped welcome email.*mail_password'"
        ]
        
        for cmd in mail_commands:
            log_result = os.popen(cmd).read().strip()
            if log_result:
                mail_password_skip_found = True
                log_messages.append(log_result)
                print(f"📧 MAIL_PASSWORD SKIP MESSAGE FOUND: {log_result}")
        
        # Check for any welcome email related logs
        if not resend_skip_found and not mail_password_skip_found:
            print(f"⚠️ No skip messages found. Checking for any welcome email activity...")
            
            # Check for any email-related activity
            general_email_logs = os.popen("tail -n 50 /var/log/supervisor/backend.out.log | grep -i 'welcome email\\|email sent\\|email skip'").read()
            if general_email_logs:
                print(f"Recent email activity:\n{general_email_logs}")
            else:
                print("No recent email activity found in logs")
                
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
            
        has_resend_key = "RESEND_API_KEY=" in env_content
        has_mail_password = "MAIL_PASSWORD=" in env_content and len(env_content.split("MAIL_PASSWORD=")[1].split("\n")[0].strip()) > 0
        
        print(f"✅ RESEND_API_KEY configured: {has_resend_key}")
        print(f"✅ MAIL_PASSWORD configured: {has_mail_password}")
        
    except Exception as e:
        print(f"⚠️ Error checking environment config: {e}")
    
    # Analyze results
    print(f"\n📋 RESEND LOGIC ANALYSIS:")
    print(f"  📧 Resend skip message found: {resend_skip_found}")
    print(f"  📧 Mail password skip message found: {mail_password_skip_found}")
    print(f"  📝 Total log messages found: {len(log_messages)}")
    
    # Check startup logs for Resend warning
    print(f"\n📋 CHECKING STARTUP LOGS FOR RESEND WARNING:")
    startup_warning_found = False
    try:
        startup_logs = os.popen("tail -n 100 /var/log/supervisor/backend.err.log | grep -i 'resend_api_key not found'").read()
        if startup_logs:
            startup_warning_found = True
            print(f"✅ STARTUP WARNING FOUND: {startup_logs.strip()}")
        else:
            print("⚠️ No startup warning found")
    except Exception as e:
        print(f"⚠️ Error checking startup logs: {e}")
    
    # Final analysis
    if resend_skip_found:
        print(f"\n✅ PERFECT: Resend logic is implemented and working!")
        print(f"   The logs show the expected 'ℹ️ Skipped welcome email (RESEND_API_KEY missing)' message")
        test_passed = True
        
    elif mail_password_skip_found:
        print(f"\n⚠️ PARTIAL: Welcome email skip logic exists but uses MAIL_PASSWORD check")
        print(f"   Current implementation checks MAIL_PASSWORD instead of RESEND_API_KEY")
        print(f"   The Resend logic needs to be implemented in send_welcome_email function")
        test_passed = False
        
    elif startup_warning_found:
        print(f"\n⚠️ PARTIAL: Resend configuration warning found at startup")
        print(f"   But welcome email function may not be using Resend yet")
        print(f"   Need to verify if send_welcome_email function uses RESEND_API_KEY")
        test_passed = False
        
    else:
        print(f"\n❌ ISSUE: No Resend logic found")
        print(f"   Neither Resend skip message nor startup warning found")
        print(f"   Resend integration may not be implemented yet")
        test_passed = False
    
    print(f"\n📋 FINAL VERDICT:")
    print(f"  🎯 Resend Logic Test: {'PASSED ✅' if test_passed else 'NEEDS WORK ❌'}")
    
    return test_passed

if __name__ == "__main__":
    test_resend_welcome_email_logic()