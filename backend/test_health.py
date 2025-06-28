#!/usr/bin/env python3
"""
Simple health check test script for Railway deployment debugging
"""
import requests
import sys
import os
import time

def test_health_endpoint(base_url="http://localhost:8001"):
    """Test the health endpoint"""
    try:
        print(f"🔍 Testing health endpoint at {base_url}/api/health")
        response = requests.get(f"{base_url}/api/health", timeout=10)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check Response: {data}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - server may not be running")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 RecalibratePain API Health Check Test")
    print("=" * 50)
    
    # Test local server
    if test_health_endpoint():
        print("✅ Local server health check passed!")
    else:
        print("❌ Local server health check failed!")
        sys.exit(1)
    
    # Test with environment PORT if available
    port = os.environ.get("PORT")
    if port:
        print(f"\n🔍 Testing with environment PORT: {port}")
        if test_health_endpoint(f"http://localhost:{port}"):
            print("✅ Environment PORT health check passed!")
        else:
            print("❌ Environment PORT health check failed!")

if __name__ == "__main__":
    main()