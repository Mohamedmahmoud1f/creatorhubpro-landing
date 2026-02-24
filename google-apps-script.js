/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║        CreatorHubPro — Google Apps Script  v2               ║
 * ║  يُنسخ هذا الكود في: Extensions > Apps Script > Code.gs    ║
 * ║  Sheet ID: 19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ⚠️ مهم — خطوات إعادة النشر بعد تحديث الكود:
 *  1. احذف الكود القديم في Code.gs والصق هذا الكود
 *  2. احفظ (Ctrl+S)
 *  3. Deploy > Manage Deployments > Edit (✏️) > New Version > Deploy
 *  4. استخدم نفس الـ URL السابق (لا تحتاج تغيير app.js)
 */

const SHEET_NAME = 'Leads';
const SHEET_ID   = '19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc';

const HEADERS = [
  'التاريخ والوقت',
  'الاسم',
  'واتساب',
  'النشاط',
  'المنصة',
  'الهدف',
  'الاستمرارية',
  'المصدر',
  'اللغة'
];

// ─── دالة مشتركة لحفظ الصف في الـ Sheet ─────────────────────────────────────
function saveRow(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // إنشاء الـ Sheet وتنسيقها إذا لم تكن موجودة
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const hr = sheet.getRange(1, 1, 1, HEADERS.length);
    hr.setValues([HEADERS]);
    hr.setBackground('#4F46E5');
    hr.setFontColor('#FFFFFF');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 180);
    sheet.setColumnWidth(5, 120);
    sheet.setColumnWidth(6, 160);
    sheet.setColumnWidth(7, 260);
    sheet.setColumnWidth(8, 200);
    sheet.setColumnWidth(9, 80);
  }

  const row = [
    data.timestamp  || new Date().toLocaleString('ar-EG', {timeZone:'Africa/Cairo'}),
    data.name       || '',
    data.whatsapp   || '',
    data.business   || '',
    data.platform   || '',
    data.goal       || '',
    data.experience || '',
    data.source     || 'CreatorHubPro Landing Page',
    data.lang       || 'عربي'
  ];

  sheet.appendRow(row);

  // تلوين الصفوف بالتناوب
  const lastRow  = sheet.getLastRow();
  const rowRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);
  rowRange.setBackground(lastRow % 2 === 0 ? '#F3F4F6' : '#FFFFFF');
  rowRange.setHorizontalAlignment('right');

  return lastRow;
}

// ─── doGet — يستقبل البيانات كـ query params (الطريقة الوحيدة مع no-cors) ────
function doGet(e) {
  try {
    const p = e.parameter || {};

    // لو طلب اختبار بدون بيانات
    if (!p.name && !p.whatsapp) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status:  'alive',
          message: 'CreatorHubPro Sheets Endpoint v2 ✅',
          time:    new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const lastRow = saveRow(p);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── doPost — للتوافق مع أي إرسال POST مستقبلي ──────────────────────────────
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const lastRow = saveRow(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── testInsert — شغّلها من Apps Script للتأكد قبل النشر ────────────────────
function testInsert() {
  const mockData = {
    timestamp:  '24/2/2026، 4:00 م',
    name:       'اختبار v2',
    whatsapp:   '+201105449828',
    business:   'كريتور - محتوى شخصي',
    platform:   'Instagram',
    goal:       'جذب عملاء',
    experience: 'لا، بعاني أصلاً في الاستمرارية',
    source:     'Test Run v2',
    lang:       'عربي'
  };
  const row = saveRow(mockData);
  Logger.log('✅ تم إضافة الصف رقم: ' + row);
}
