import dns.resolver
import sys

def check_record(name, rtype):
    print(f"Checking {rtype} for {name}...")
    try:
        answers = dns.resolver.resolve(name, rtype)
        for rdata in answers:
            print(f"✅ FOUND: {rdata}")
        return True
    except dns.resolver.NXDOMAIN:
        print(f"❌ NXDOMAIN (Does not exist)")
    except dns.resolver.NoAnswer:
        print(f"❌ NoAnswer (Exists but no {rtype} record)")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    return False

domain = "recalibratepain.com"

print("--- 1. DKIM CHECK ---")
# Check correct version
check_record(f"resend._domainkey.{domain}", "TXT")
# Check double-domain error version
check_record(f"resend._domainkey.{domain}.{domain}", "TXT")

print("\n--- 2. SPF (TXT) CHECK ---")
check_record(f"send.{domain}", "TXT")
check_record(f"send.{domain}.{domain}", "TXT")

print("\n--- 3. SPF (MX) CHECK ---")
check_record(f"send.{domain}", "MX")
check_record(f"send.{domain}.{domain}", "MX")

print("\n--- 4. DMARC CHECK ---")
check_record(f"_dmarc.{domain}", "TXT")
check_record(f"_dmarc.{domain}.{domain}", "TXT")
