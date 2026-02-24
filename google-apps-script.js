/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║        CreatorHubPro — Google Apps Script                   ║
 * ║  يُنسخ هذا الكود في: Extensions > Apps Script > Code.gs    ║
 * ║  Sheet ID: 19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * خطوات النشر:
 *  1. افتح الـ Spreadsheet
 *  2. Extensions > Apps Script
 *  3. احذف الكود الموجود والصق هذا الكود كاملاً
 *  4. احفظ (Ctrl+S)
 *  5. Deploy > New Deployment
 *     - Type: Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. انسخ الـ URL الناتج والصقه في app.js داخل CONFIG.sheetsEndpoint
 */

// ── اسم الـ Sheet الذي ستُحفظ فيه البيانات ──
const SHEET_NAME = 'Leads';

// ── عناوين الأعمدة (سيتم إنشاؤها تلقائياً في أول تشغيل) ──
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

/**
 * doPost — يُستدعى عند إرسال الفورم من الموقع (POST request)
 */
function doPost(e) {
  try {
    // تحليل البيانات الواردة
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // الوصول إلى الـ Spreadsheet
    const ss    = SpreadsheetApp.openById('19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc');
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // إنشاء الـ Sheet إذا لم تكن موجودة
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);

      // تنسيق صف العناوين
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#4F46E5');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);

      // ضبط عرض الأعمدة
      sheet.setColumnWidth(1, 160); // التاريخ
      sheet.setColumnWidth(2, 150); // الاسم
      sheet.setColumnWidth(3, 140); // واتساب
      sheet.setColumnWidth(4, 180); // النشاط
      sheet.setColumnWidth(5, 120); // المنصة
      sheet.setColumnWidth(6, 160); // الهدف
      sheet.setColumnWidth(7, 260); // الاستمرارية
      sheet.setColumnWidth(8, 160); // المصدر
      sheet.setColumnWidth(9, 80);  // اللغة
    }

    // بناء صف البيانات
    const row = [
      data.timestamp  || new Date().toLocaleString('ar-EG'),
      data.name       || '',
      data.whatsapp   || '',
      data.business   || '',
      data.platform   || '',
      data.goal       || '',
      data.experience || '',
      data.source     || 'CreatorHubPro Landing Page',
      data.lang       || 'عربي'
    ];

    // إضافة الصف
    sheet.appendRow(row);

    // تلوين صفوف بالتناوب لسهولة القراءة
    const lastRow    = sheet.getLastRow();
    const rowRange   = sheet.getRange(lastRow, 1, 1, HEADERS.length);
    const rowColor   = (lastRow % 2 === 0) ? '#F3F4F6' : '#FFFFFF';
    rowRange.setBackground(rowColor);

    // محاذاة RTL للبيانات العربية
    rowRange.setHorizontalAlignment('right');

    // رد ناجح
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // رد بالخطأ (لأغراض التشخيص)
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet — للاختبار السريع عبر المتصفح
 * افتح رابط الـ Web App في المتصفح للتحقق من أنه يعمل
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  'alive',
      message: 'CreatorHubPro Sheets Endpoint is running ✅',
      sheet:   SHEET_NAME,
      time:    new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * testInsert — دالة اختبار، شغّلها من Apps Script مباشرة (▶ Run)
 * للتحقق من أن الكتابة إلى الـ Sheet تعمل قبل النشر
 */
function testInsert() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp:  '24/2/2026، 12:00:00 م',
        name:       'تجربة - أحمد',
        whatsapp:   '+201111111111',
        business:   'كريتور - محتوى شخصي',
        platform:   'Instagram',
        goal:       'جذب عملاء',
        experience: 'لا، بعاني أصلاً في الاستمرارية',
        source:     'Test Run',
        lang:       'عربي'
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
