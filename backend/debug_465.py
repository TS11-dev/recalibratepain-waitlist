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
except Exception as e:
    print(f"FAILED on 465: {e}")
