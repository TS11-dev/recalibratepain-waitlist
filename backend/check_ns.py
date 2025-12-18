import dns.resolver

domain = "recalibratepain.com"
print(f"Checking NS records for {domain}...")
try:
    answers = dns.resolver.resolve(domain, "NS")
    for rdata in answers:
        print(f"✅ NS: {rdata}")
except Exception as e:
    print(f"❌ Error: {e}")
