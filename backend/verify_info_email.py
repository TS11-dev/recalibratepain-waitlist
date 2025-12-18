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

async def send_test_to_info():
    print(f"Attempting to send Welcome Email to {os.environ.get('MAIL_USERNAME')}...")
    
    welcome_html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://recalibratepain.com/recalibrate-logo.png" alt="Recalibrate Logo" style="height: 48px; width: auto; margin-bottom: 16px;">
            <h1 style="color: #4f46e5; font-size: 24px; font-weight: bold; margin-top: 0;">Welcome to the Revolution! 🚀</h1>
        </div>
        <p>Hi Founder,</p>
        <p>This is a <strong>Direct Test</strong> of the Welcome Email system.</p>
        <p>If you are reading this, the system is working perfectly.</p>
        
        <div style="background-color: #f3e8ff; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #d8b4fe;">
            <h3 style="margin-top: 0; color: #6b21a8;">🎁 Your Free Gift is Inside</h3>
            <p style="margin-bottom: 0;">We've attached your copy of <strong>"Course - Self-Management 101"</strong> to this email.</p>
        </div>
    </div>
    """
    
    course_path = "/app/backend/data/Recalibrate_Self_Management_101.pdf"
    
    message = MessageSchema(
        subject="🎁 TEST: Welcome to Recalibrate (System Verification)",
        recipients=[os.environ.get("MAIL_USERNAME")], # Sending TO info@recalibratepain.com
        body=welcome_html,
        subtype=MessageType.html,
        attachments=[course_path]
    )
    
    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        print("✅ SUCCESS: Email sent to info@recalibratepain.com")
    except Exception as e:
        print(f"❌ FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(send_test_to_info())