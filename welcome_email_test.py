#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime

# Use production backend URL from frontend .env
BACKEND_URL = 'https://recalipain-1.preview.emergentagent.com'

def test_welcome_email_functionality():
    """Test the Waitlist Join endpoint with welcome email verification"""
    print("🎯 TESTING WELCOME EMAIL FUNCTIONALITY")
    print("=" * 80)
    
    # Create unique test email as requested
    date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_email = f"welcome_test_{date_str}@test.com"
    test_name = f"Welcome Test User {date_str}"
    
    print(f"Test email: {test_email}")
    print(f"Test name: {test_name}")
    
    # Test data for waitlist join
    test_data = {
        "name": test_name,
        "email": test_email
    }
    
    print(f"\nSending request to: {BACKEND_URL}/api/waitlist/join")
    print(f"Request body: {json.dumps(test_data, indent=2)}")
    
    # Send the request
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/waitlist/join", 
            json=test_data,
            timeout=30
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            success = data.get("success", False)
            message = data.get("message", "")
            total_subscribers = data.get("total_subscribers", 0)
            storage_info = data.get("storage_info", "")
            
            print(f"\n✅ Join Request Results:")
            print(f"  Success: {success}")
            print(f"  Message: {message}")
            print(f"  Total Subscribers: {total_subscribers}")
            print(f"  Storage Info: {storage_info}")
            
            if success:
                print(f"\n✅ Successfully joined waitlist with email: {test_email}")
                return True, test_email
            else:
                print(f"\n❌ Failed to join waitlist")
                return False, test_email
        else:
            print(f"\n❌ Request failed with status {response.status_code}")
            return False, test_email
            
    except Exception as e:
        print(f"\n❌ Error during request: {str(e)}")
        return False, test_email

def check_backend_logs_for_email():
    """Check backend logs for email sending attempts"""
    print("\n🔍 CHECKING BACKEND LOGS FOR EMAIL ACTIVITY")
    print("=" * 80)
    
    try:
        # Check supervisor backend logs
        import subprocess
        
        # Get the latest backend logs
        log_files = [
            "/var/log/supervisor/backend.out.log",
            "/var/log/supervisor/backend.err.log"
        ]
        
        email_logs_found = []
        
        for log_file in log_files:
            try:
                print(f"\nChecking {log_file}...")
                result = subprocess.run(
                    ["tail", "-n", "50", log_file], 
                    capture_output=True, 
                    text=True, 
                    timeout=10
                )
                
                if result.returncode == 0:
                    log_content = result.stdout
                    
                    # Look for email-related log entries
                    email_keywords = [
                        "Welcome email sent",
                        "Failed to send welcome email",
                        "📧 Welcome email sent to",
                        "❌ Failed to send welcome email:",
                        "SMTP",
                        "email"
                    ]
                    
                    for line in log_content.split('\n'):
                        for keyword in email_keywords:
                            if keyword.lower() in line.lower():
                                email_logs_found.append(f"{log_file}: {line.strip()}")
                                print(f"  📧 Found: {line.strip()}")
                
            except Exception as e:
                print(f"  ⚠️ Could not read {log_file}: {str(e)}")
        
        return email_logs_found
        
    except Exception as e:
        print(f"❌ Error checking logs: {str(e)}")
        return []

if __name__ == "__main__":
    print("🚀 WELCOME EMAIL TEST - REVIEW REQUEST")
    print("Testing /api/waitlist/join endpoint with welcome email verification")
    print("=" * 80)
    
    # Run the test
    success, test_email = test_welcome_email_functionality()
    
    # Check logs for email activity
    email_logs = check_backend_logs_for_email()
    
    # Summary
    print("\n📋 TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Waitlist Join Success: {success}")
    print(f"📧 Test Email Used: {test_email}")
    print(f"📝 Email Logs Found: {len(email_logs)} entries")
    
    if email_logs:
        print("\n📧 EMAIL LOG ENTRIES:")
        for log_entry in email_logs:
            print(f"  {log_entry}")
    else:
        print("\n⚠️ No email-related log entries found in recent logs")
    
    print("\n🎯 REVIEW REQUEST COMPLETED")
    print("The backend has been tested for welcome email functionality.")
    print("Check the logs above to verify email sending attempts.")