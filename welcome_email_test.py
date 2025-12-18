#!/usr/bin/env python3
"""
Specific test for the review request: Welcome Email Functionality
Tests waitlist join with unique email and verifies welcome email sending with PDF attachment
"""
import requests
import json
import time
import os
from datetime import datetime

# Use production backend URL from frontend .env
BACKEND_URL = 'https://recalipain-1.preview.emergentagent.com'

def test_welcome_email_final_verification():
    """Test welcome email functionality as requested in review"""
    print("🎯 TESTING REVIEW REQUEST: Welcome Email with PDF Attachment")
    print("=" * 80)
    
    # Generate unique email with requested format: test_user_final_verification_{timestamp}@example.com
    timestamp = int(time.time())
    test_email = f"test_user_final_verification_{timestamp}@example.com"
    test_name = "Final Verification User"
    
    print(f"📧 Using unique test email: {test_email}")
    print(f"👤 Using test name: {test_name}")
    
    # 1. Verify PDF attachment file exists
    pdf_path = "/app/backend/data/Recalibrate_Self_Management_101.pdf"
    pdf_exists = os.path.exists(pdf_path)
    print(f"📄 PDF attachment file exists: {pdf_exists} ({pdf_path})")
    
    if not pdf_exists:
        print("❌ CRITICAL: PDF attachment file not found!")
        return False
    
    # 2. Test waitlist join (which triggers welcome email)
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    print(f"\n📤 Sending waitlist join request to: {BACKEND_URL}/api/waitlist/join")
    print(f"📋 Request body: {json.dumps(test_data, indent=2)}")
    
    # Clear logs before test to better track our specific test
    print("\n📋 Clearing recent logs to track our test...")
    
    response = requests.post(
        f"{BACKEND_URL}/api/waitlist/join", 
        json=test_data
    )
    
    print(f"\n📥 Response Status: {response.status_code}")
    print(f"📥 Response Body: {response.text}")
    
    if response.status_code != 200:
        print(f"❌ Waitlist join failed with status {response.status_code}")
        return False
    
    data = response.json()
    
    # 3. Verify response details
    success = data.get("success", False)
    message = data.get("message", "")
    total_subscribers = data.get("total_subscribers", 0)
    storage_info = data.get("storage_info", "")
    
    print(f"\n✅ Waitlist Join Success: {success}")
    print(f"💬 Response Message: {message}")
    print(f"👥 Total Subscribers: {total_subscribers}")
    print(f"💾 Storage Info: {storage_info}")
    
    # 4. Wait for email processing
    print(f"\n⏳ Waiting 3 seconds for email processing...")
    time.sleep(3)
    
    # 5. Check backend logs for welcome email success message
    print(f"\n📋 CHECKING BACKEND LOGS FOR WELCOME EMAIL SUCCESS:")
    print(f"🔍 Looking for: '📧 Welcome email sent to {test_email}'")
    
    email_success_logged = False
    try:
        # Check supervisor backend logs for email success message
        log_command = f"tail -n 50 /var/log/supervisor/backend.err.log | grep -i 'welcome email sent to {test_email}'"
        log_result = os.popen(log_command).read().strip()
        
        email_success_logged = len(log_result) > 0
        
        if email_success_logged:
            print(f"✅ FOUND EMAIL SUCCESS LOG: {log_result}")
        else:
            print(f"⚠️ Email success message not found for {test_email}")
            # Show recent logs for debugging
            print(f"\n📋 Recent backend logs (last 20 lines):")
            recent_logs = os.popen("tail -n 20 /var/log/supervisor/backend.err.log").read()
            print(recent_logs)
            
            # Also check for any welcome email logs
            print(f"\n📋 All recent welcome email logs:")
            welcome_logs = os.popen("tail -n 50 /var/log/supervisor/backend.err.log | grep -i 'welcome email'").read()
            print(welcome_logs if welcome_logs else "No welcome email logs found")
            
    except Exception as e:
        print(f"⚠️ Error checking logs: {e}")
        email_success_logged = False
    
    # 6. Verify send_welcome_email function was called
    print(f"\n📋 VERIFICATION SUMMARY:")
    print(f"  ✅ Unique email used: {test_email}")
    print(f"  ✅ PDF attachment exists: {pdf_exists}")
    print(f"  ✅ Waitlist join successful: {success}")
    print(f"  ✅ Welcome message in response: {'future of pain management' in message.lower()}")
    print(f"  ✅ Email success logged: {email_success_logged}")
    print(f"  ✅ User added to waitlist: {total_subscribers > 0}")
    
    # 7. Final result
    all_requirements_met = (
        pdf_exists and
        success and
        email_success_logged and
        total_subscribers > 0
    )
    
    print(f"\n🎯 FINAL RESULT: {'✅ PASS' if all_requirements_met else '❌ FAIL'}")
    print(f"📧 Welcome email function called and logged: {email_success_logged}")
    print(f"📄 PDF attachment verified: {pdf_exists}")
    
    return all_requirements_met

if __name__ == "__main__":
    success = test_welcome_email_final_verification()
    exit(0 if success else 1)