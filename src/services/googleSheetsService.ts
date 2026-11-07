import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../firebase';

export const DEFAULT_SPREADSHEET_ID = '1ZzB6VkS6DbA9XNobgwcy7NGBhUcuSrWdQSdyqTUyQ3A';
export const DEFAULT_SPREADSHEET_NAME = '7days diwali Bootcamp Registation data';
export const DEFAULT_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Scopes required for Google Sheets integration
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initGoogleSheetsAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSheetsSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token. Please ensure popup was not blocked.');
    }
    cachedAccessToken = credential.accessToken;
    sessionStorage.setItem('aifluence_sheets_active', 'true');
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sheets sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSheetsSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  sessionStorage.removeItem('aifluence_sheets_active');
};

export const HEADERS = [
  'Registration ID',
  'Registration Date',
  'Registration Time',
  'Parent Full Name',
  'Parent Contact Number',
  'Parent Email Address',
  'Student Full Name',
  'Student Contact Number',
  'School Name',
  'Current Standard / Class',
  'Institute Name',
  'Registration Status',
  'Source',
  'Payment Status'
];

/**
 * Inspects the spreadsheet to find the active sheet title and ensures the prominent header row is formatted
 */
export const ensureSheetHeaders = async (
  accessToken: string,
  spreadsheetId: string = DEFAULT_SPREADSHEET_ID
): Promise<string> => {
  try {
    // 1. Get spreadsheet metadata to get the title and sheetId of the first sheet
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!metaRes.ok) {
      const err = await metaRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Unable to access sheet (${metaRes.status})`);
    }

    const metaData = await metaRes.json();
    const sheetProperties = metaData.sheets?.[0]?.properties;
    const sheetTitle = sheetProperties?.title || 'Sheet1';
    const sheetId = sheetProperties?.sheetId ?? 0;

    // 2. Check if row 1 is already populated
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:Z1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const checkData = await checkRes.json();
    const hasValues = checkData.values && checkData.values.length > 0 && checkData.values[0].length > 0;

    if (!hasValues) {
      // Initialize headers with prominent format
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );

      // Enhance with executive styling (Bold headers, blue background, frozen top row)
      try {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: HEADERS.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.08, green: 0.18, blue: 0.36 },
                      textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      horizontalAlignment: 'CENTER',
                    },
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
                },
              },
              {
                updateSheetProperties: {
                  properties: {
                    sheetId,
                    gridProperties: { frozenRowCount: 1 },
                  },
                  fields: 'gridProperties.frozenRowCount',
                },
              },
            ],
          }),
        });
      } catch (styleErr) {
        console.warn('Sheet formatting notice:', styleErr);
      }
    }

    return sheetTitle;
  } catch (error) {
    console.warn('ensureSheetHeaders warning:', error);
    return 'Sheet1';
  }
};

/**
 * Appends an individual registration row directly to the user's Google Sheet
 */
export const appendRowToSheet = async (
  accessToken: string,
  spreadsheetId: string = DEFAULT_SPREADSHEET_ID,
  rowData: any[]
): Promise<void> => {
  const sheetTitle = await ensureSheetHeaders(accessToken, spreadsheetId);
  const range = `${encodeURIComponent(sheetTitle)}!A1`;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to append registration row to Google Sheet.');
  }
};

/**
 * Syncs multiple registration rows to the Google Sheet
 */
export const syncAllRegistrationsToSheet = async (
  accessToken: string,
  spreadsheetId: string = DEFAULT_SPREADSHEET_ID,
  records: any[]
): Promise<{ added: number }> => {
  if (!records || records.length === 0) return { added: 0 };

  const sheetTitle = await ensureSheetHeaders(accessToken, spreadsheetId);
  const range = `${encodeURIComponent(sheetTitle)}!A1`;

  const rows = records.map((r) => [
    r.registrationId,
    r.registrationDate,
    r.registrationTime,
    r.parentName,
    r.parentContact,
    r.parentEmail || 'Not Provided',
    r.studentName,
    r.studentContact || 'Not Provided',
    r.schoolName,
    r.standard,
    r.institute,
    r.registrationStatus || 'Registered',
    r.source || 'AI Fluence Website',
    r.paymentStatus || 'Not Applicable',
  ]);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to sync registrations to Google Sheet.');
  }

  return { added: rows.length };
};
