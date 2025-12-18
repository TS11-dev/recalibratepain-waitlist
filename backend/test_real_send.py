import asyncio
import os
import sys
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

load_dotenv("/app/backend/.env")

# SMTP Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.environ.get("MAIL_USERNAME"),
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
    MAIL_FROM=os.environ.get("MAIL_FROM"),
    MAIL_PORT=int(os.environ.get("MAIL_PORT", 465)),
    MAIL_SERVER=os.environ.get("MAIL_SERVER"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def test_send():
    print(f"Sending to info@recalibratepain.com...")
    print(f"Server: {os.environ.get('MAIL_SERVER')}")
    print(f"User: {os.environ.get('MAIL_USERNAME')}")
    
    welcome_html = "<h1>Test Email from Preview Environment</h1><p>If you see this, the code works and the credentials are correct.</p>"
    course_path = "/app/backend/data/Recalibrate_Self_Management_101.pdf"
    
    message = MessageSchema(
        subject="🧪 Test Email from Recalibrate Preview",
        recipients=["info@recalibratepain.com"],
        body=welcome_html,
        subtype=MessageType.html,
        attachments=[course_path]
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)
    print("✅ Email Sent Successfully!")

if __name__ == "__main__":
    asyncio.run(test_send())