# 🚀 Google Sheets Integration Setup Guide

## Step 1: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Check if this is the first entry (add headers)
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'IP Address']]);
    }
    
    // Add the new entry
    const timestamp = new Date();
    const email = data.email;
    const source = data.source || 'waitlist';
    const ipAddress = e.parameter.userip || 'unknown';
    
    sheet.appendRow([timestamp, email, source, ipAddress]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Email added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 2: Create Google Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "RecalibratePain Waitlist"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 3: Configure Apps Script

1. In your Apps Script project, replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID
2. Save the project (Ctrl+S)
3. Name your project "RecalibratePain Waitlist Handler"

## Step 4: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL that's generated

## Step 5: Update Your App

1. In your `.env` file, replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the web app URL
2. The format should look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

## Step 6: Test the Integration

1. Submit a test email through your waitlist
2. Check your Google Spreadsheet to see if the entry appears
3. Emails will be automatically logged with timestamp, source, and IP address

## Security Notes

- The Apps Script runs under your Google account
- Only you can see the spreadsheet data
- The web app accepts POST requests from anywhere (needed for CORS)
- Consider adding email validation in the script for extra security

## Troubleshooting

- If submissions aren't appearing, check the Apps Script execution logs
- Make sure the spreadsheet ID is correct
- Verify the web app is deployed and accessible
- Check browser console for any CORS errors

Your enterprise-level waitlist is now connected to Google Sheets for automatic data collection!