import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, platform, username, category, followers, scores } = body;

        // 1. Prepare Auth
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 2. Append data to the sheet
        // Ensure you have a sheet named 'Sheet1' or change the range below
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leeds!A1', // Start looking from the top-left
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS', // This forces a new row to be created
            requestBody: {
                values: [[
                    new Date().toISOString(),
                    name,
                    email,
                    platform,
                    username,
                    category,
                    followers,
                    scores.consistency,
                    scores.engagement,
                    scores.strategy
                ]],
            },
        });

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error('Google Sheets Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}