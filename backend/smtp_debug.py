import smtplib
import ssl
import sys

port = 465
smtp_server = "mail.spacemail.com"
sender_email = "info@recalibratepain.com"
password = "Dragonfuego22"

try:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        print("Connected to server...")
        server.login(sender_email, password)
        print("LOGIN SUCCESSFUL!")
except Exception as e:
    print(f"LOGIN FAILED: {e}")
