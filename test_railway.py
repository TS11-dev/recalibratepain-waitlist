#!/usr/bin/env python3
"""
Railway Deployment Test Script
"""
import requests
import time
import sys

RAILWAY_URL = "https://recalibratepain-waitlist-production.up.railway.app"

def test_endpoints():
    """Test all Railway endpoints"""
    endpoints = [
        ("/", "Root endpoint"),
        ("/api/health", "Health check"),
        ("/api/waitlist/count", "Subscriber count"),
    ]
    
    print(f"🚀 Testing Railway deployment: {RAILWAY_URL}")
    print("=" * 60)
    
    all_passed = True
    
    for endpoint, description in endpoints:
        url = f"{RAILWAY_URL}{endpoint}"
        print(f"🔍 Testing {description}: {endpoint}")
        
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ PASSED - Status: {response.status_code}")
                print(f"📄 Response: {data}")
            else:
                print(f"❌ FAILED - Status: {response.status_code}")
                print(f"📄 Response: {response.text}")
                all_passed = False
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED - Error: {e}")
            all_passed = False
        
        print("-" * 40)
        time.sleep(1)
    
    if all_passed:
        print("🎉 ALL TESTS PASSED! Railway deployment is working!")
        return True
    else:
        print("⚠️  Some tests failed. Check Railway logs for details.")
        return False

if __name__ == "__main__":
    success = test_endpoints()
    sys.exit(0 if success else 1)