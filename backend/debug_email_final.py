import smtplib
import ssl
import sys

sender_email = "info@recalibratepain.com"
password = "Dragonfuego22"
smtp_server = "mail.spacemail.com"

print("--- TESTING PORT 465 (SSL) ---")
try:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, 465, context=context) as server:
        print("Connected to 465...")
        server.login(sender_email, password)
        print("LOGIN SUCCESSFUL on 465!")
        server.sendmail(sender_email, sender_email, "Subject: Test\n\nWorks on 465")
        print("Email sent on 465!")
except Exception as e:
    print(f"FAILED on 465: {e}")

print("\n--- TESTING PORT 587 (STARTTLS) ---")
try:
    server = smtplib.SMTP(smtp_server, 587)
    server.set_debuglevel(1)
    server.ehlo()
    print("Connected to 587...")
    server.starttls()
    print("STARTTLS successful...")
    server.ehlo()
    server.login(sender_email, password)
    print("LOGIN SUCCESSFUL on 587!")
    server.sendmail(sender_email, sender_email, "Subject: Test\n\nWorks on 587")
    server.quit()
except Exception as e:
    print(f"FAILED on 587: {e}")
