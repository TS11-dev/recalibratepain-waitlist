import requests
import sys
from datetime import datetime
import json

class RecalibrateAPITester:
    def __init__(self, base_url="https://fibro-lab.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)
            else:
                print(f"❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.content else {}
                except json.JSONDecodeError:
                    return success, {"raw_response": response.text}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "name": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {"error": response.text}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout}s")
            self.failed_tests.append({"name": name, "error": "Timeout"})
            return False, {"error": "Timeout"}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            self.failed_tests.append({"name": name, "error": "Connection error"})
            return False, {"error": "Connection error"}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({"name": name, "error": str(e)})
            return False, {"error": str(e)}

    def test_health_check(self):
        """Test basic health endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "api/health",
            200
        )
        if success:
            print(f"   Service: {response.get('service', 'Unknown')}")
            print(f"   Version: {response.get('version', 'Unknown')}")
            print(f"   Subscribers: {response.get('subscribers', 0)}")
            print(f"   Storage: {response.get('storage', {})}")
        return success

    def test_root_endpoint(self):
        """Test root endpoint"""
        success, response = self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )
        if success:
            print(f"   Message: {response.get('message', 'None')}")
            print(f"   Storage: {response.get('storage', 'Unknown')}")
        return success

    def test_subscriber_count(self):
        """Test subscriber count endpoint"""
        success, response = self.run_test(
            "Subscriber Count",
            "GET",
            "api/waitlist/count",
            200
        )
        if success:
            count = response.get('count', 0)
            source = response.get('source', 'unknown')
            print(f"   Count: {count}")
            print(f"   Source: {source}")
        return success

    def test_waitlist_stats(self):
        """Test waitlist statistics endpoint"""
        success, response = self.run_test(
            "Waitlist Statistics",
            "GET",
            "api/waitlist/stats",
            200
        )
        if success:
            print(f"   Total: {response.get('total_subscribers', 0)}")
            print(f"   Recent: {response.get('recent_signups', 0)}")
            print(f"   Today: {response.get('today_signups', 0)}")
        return success

    def test_waitlist_join(self):
        """Test joining waitlist"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@testrecalibrate.com"
        success, response = self.run_test(
            "Join Waitlist",
            "POST",
            "api/waitlist/join",
            200,
            data={
                "name": "Test User",
                "email": test_email
            }
        )
        if success:
            print(f"   Message: {response.get('message', 'No message')}")
            print(f"   Success: {response.get('success', False)}")
            print(f"   Total Subscribers: {response.get('total_subscribers', 0)}")
        return success

    def test_waitlist_join_duplicate(self):
        """Test joining waitlist with duplicate email"""
        duplicate_email = "duplicate@testrecalibrate.com"
        
        # First submission
        print(f"\n🔄 First submission with {duplicate_email}")
        success1, response1 = self.run_test(
            "Join Waitlist (First Time)",
            "POST", 
            "api/waitlist/join",
            200,
            data={
                "name": "First User",
                "email": duplicate_email
            }
        )
        
        # Second submission (should handle duplicate)
        print(f"\n🔄 Second submission with same email")
        success2, response2 = self.run_test(
            "Join Waitlist (Duplicate)",
            "POST",
            "api/waitlist/join", 
            200,
            data={
                "name": "Duplicate User",
                "email": duplicate_email
            }
        )
        
        if success2:
            print(f"   Duplicate Message: {response2.get('message', 'No message')}")
            
        return success1 and success2

    def test_waitlist_join_invalid_data(self):
        """Test joining waitlist with invalid data"""
        test_cases = [
            {"name": "", "email": "test@example.com", "case": "Empty name"},
            {"name": "Test", "email": "", "case": "Empty email"}, 
            {"name": "Test", "email": "invalid-email", "case": "Invalid email format"}
        ]
        
        all_passed = True
        for case in test_cases:
            print(f"\n🔍 Testing {case['case']}")
            success, response = self.run_test(
                f"Invalid Data - {case['case']}",
                "POST",
                "api/waitlist/join",
                400,  # Expecting validation error
                data={"name": case["name"], "email": case["email"]}
            )
            if not success:
                all_passed = False
                
        return all_passed

    def test_partner_contact(self):
        """Test partner contact form"""
        test_data = {
            "type": "clinic",
            "name": "Dr. Test Smith",
            "email": f"clinic_test_{datetime.now().strftime('%H%M%S')}@testclinic.com",
            "organization": "Test Clinic",
            "message": "This is a test inquiry for clinic partnership."
        }
        
        success, response = self.run_test(
            "Partner Contact Form",
            "POST",
            "api/partner/contact",
            200,
            data=test_data
        )
        
        if success:
            print(f"   Success: {response.get('success', False)}")
            print(f"   Message: {response.get('message', 'No message')}")
            print(f"   Email Sent: {response.get('email_sent', False)}")
        
        return success

    def test_partner_contact_types(self):
        """Test all partner contact types"""
        partner_types = ["clinic", "research", "investor"]
        all_passed = True
        
        for partner_type in partner_types:
            test_data = {
                "type": partner_type,
                "name": f"Test {partner_type.title()} Contact",
                "email": f"{partner_type}_test_{datetime.now().strftime('%H%M%S')}@test{partner_type}.com",
                "organization": f"Test {partner_type.title()} Organization",
                "message": f"This is a test inquiry for {partner_type} partnership."
            }
            
            success, response = self.run_test(
                f"Partner Contact - {partner_type.title()}",
                "POST",
                "api/partner/contact",
                200,
                data=test_data
            )
            
            if not success:
                all_passed = False
                
        return all_passed

    def test_course_download(self):
        """Test course PDF download"""
        success, response = self.run_test(
            "Course PDF Download", 
            "GET",
            "api/resources/course",
            200
        )
        return success

    def test_waitlist_export(self):
        """Test waitlist data export"""
        success, response = self.run_test(
            "Waitlist Export",
            "GET", 
            "api/waitlist/export",
            200
        )
        
        if success:
            print(f"   Total Count: {response.get('total_count', 0)}")
            print(f"   Storage Info: {response.get('storage_info', {})}")
            
        return success

def main():
    """Run all backend API tests"""
    print("=" * 60)
    print("🧪 RECALIBRATE BACKEND API TESTING")
    print("=" * 60)
    
    tester = RecalibrateAPITester()
    
    # Test order: Basic -> Core functionality -> Edge cases
    test_sequence = [
        ("Basic Connectivity", [
            tester.test_health_check,
            tester.test_root_endpoint,
        ]),
        ("Waitlist Core Functions", [
            tester.test_subscriber_count,
            tester.test_waitlist_stats,
            tester.test_waitlist_join,
            tester.test_waitlist_join_duplicate,
        ]),
        ("Partner Contact", [
            tester.test_partner_contact,
            tester.test_partner_contact_types,
        ]),
        ("Resource Access", [
            tester.test_course_download,
        ]),
        ("Data Export", [
            tester.test_waitlist_export,
        ]),
        ("Validation & Error Handling", [
            tester.test_waitlist_join_invalid_data,
        ])
    ]
    
    # Run tests by category
    for category, tests in test_sequence:
        print(f"\n📋 {category}")
        print("-" * 40)
        
        for test_func in tests:
            try:
                test_func()
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
                tester.tests_run += 1
                tester.failed_tests.append({
                    "name": test_func.__name__,
                    "error": str(e)
                })
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"❌ Tests failed: {len(tester.failed_tests)}")
    
    if tester.failed_tests:
        print("\n🚨 FAILED TESTS:")
        for i, failure in enumerate(tester.failed_tests, 1):
            print(f"   {i}. {failure.get('name', 'Unknown')} - {failure.get('error', 'Unknown error')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend API is functioning well!")
        return 0
    elif success_rate >= 60:
        print("⚠️ Backend API has some issues but core functionality works")
        return 1  
    else:
        print("❌ Backend API has critical issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())