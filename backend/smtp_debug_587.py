import smtplib
import sys

port = 587
smtp_server = "mail.spacemail.com"
sender_email = "info@recalibratepain.com"
password = "Dragonfuego22"

try:
    server = smtplib.SMTP(smtp_server, port)
    server.set_debuglevel(1)
    server.ehlo()
    print("Starting TLS...")
    server.starttls()
    server.ehlo()
    print("Logging in...")
    server.login(sender_email, password)
    print("LOGIN SUCCESSFUL!")
    server.quit()
except Exception as e:
    print(f"LOGIN FAILED: {e}")
