/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CreatorHubPro — Google Apps Script  v5 FINAL                      ║
 * ║  يكتب في أول Sheet موجود (Sheet1 / الـ Sheet الافتراضي)            ║
 * ║  SHEET_ID: 19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * خطوات الـ Deploy:
 *  1. افتح الـ Spreadsheet → Extensions → Apps Script
 *  2. احذف كل الكود القديم والصق هذا الكود
 *  3. Ctrl+S للحفظ
 *  4. شغّل testInsert() وتحقق من ظهور صف في الـ Sheet
 *  5. Deploy → New Deployment → Type: Web App
 *     Execute as: Me | Who has access: Anyone
 *  6. انسخ الـ URL الجديد وضعه في app.js → CONFIG.sheetsEndpoint
 */

// ─── إعدادات الشيت ────────────────────────────────────────────────────────────
var SPREADSHEET_ID = '19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc';

// اسم الـ Sheet اللي هيُكتب فيه — غيّره لو عندك اسم مختلف
// لو مش عارف الاسم: اتركه 'Leads' وهيُنشأ تلقائياً
var SHEET_NAME = 'Leads';

var HEADERS = [
  'التاريخ والوقت',  // A
  'الاسم',           // B
  'واتساب',          // C
  'النشاط',          // D
  'المنصة',          // E
  'الهدف',           // F
  'الاستمرارية',     // G
  'المصدر',          // H
  'اللغة'            // I
];

// ─── الدالة الرئيسية: تحضير / إنشاء الشيت ────────────────────────────────────
function getOrCreateSheet() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" not found — creating it');
    sheet = ss.insertSheet(SHEET_NAME);

    // كتابة الأعمدة خلية خلية (يتجنب مشكلة RTL)
    for (var i = 0; i < HEADERS.length; i++) {
      sheet.getRange(1, i + 1).setValue(HEADERS[i]);
    }

    // تنسيق رأس الجدول
    var hr = sheet.getRange(1, 1, 1, HEADERS.length);
    hr.setBackground('#4F46E5');
    hr.setFontColor('#FFFFFF');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    // عرض الأعمدة
    var widths = [160, 150, 140, 180, 120, 160, 260, 200, 80];
    for (var w = 0; w < widths.length; w++) {
      sheet.setColumnWidth(w + 1, widths[w]);
    }

    Logger.log('Sheet created successfully');
  }

  return sheet;
}

// ─── كتابة صف جديد ────────────────────────────────────────────────────────────
function insertRow(data) {
  var sheet   = getOrCreateSheet();
  var nextRow = sheet.getLastRow() + 1;

  Logger.log('Writing row ' + nextRow + ' with data: ' + JSON.stringify(data));

  // كتابة كل خلية بشكل منفصل — يضمن الترتيب الصحيح
  sheet.getRange(nextRow, 1).setValue(data.timestamp  || new Date().toLocaleString('ar-EG', {timeZone:'Africa/Cairo'}));
  sheet.getRange(nextRow, 2).setValue(data.name       || '');
  sheet.getRange(nextRow, 3).setValue(data.whatsapp   || '');
  sheet.getRange(nextRow, 4).setValue(data.business   || '');
  sheet.getRange(nextRow, 5).setValue(data.platform   || '');
  sheet.getRange(nextRow, 6).setValue(data.goal       || '');
  sheet.getRange(nextRow, 7).setValue(data.experience || '');
  sheet.getRange(nextRow, 8).setValue(data.source     || 'CreatorHubPro Landing Page');
  sheet.getRange(nextRow, 9).setValue(data.lang       || 'عربي');

  // ألوان متناوبة
  var bg = (nextRow % 2 === 0) ? '#F3F4F6' : '#FFFFFF';
  sheet.getRange(nextRow, 1, 1, HEADERS.length).setBackground(bg);

  Logger.log('✅ Row ' + nextRow + ' written successfully');
  return nextRow;
}

// ─── doPost: يستقبل POST من المتصفح ──────────────────────────────────────────
// يدعم: application/x-www-form-urlencoded (الأسلوب الجديد)
//        + application/json (للتوافق)
//        + e.parameter (تلقائي من Apps Script)
function doPost(e) {
  Logger.log('=== doPost called ===');

  try {
    var data = {};

    // الأولوية 1: e.parameter (يُملأ تلقائياً عند form-urlencoded)
    if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
      Logger.log('Source: e.parameter | ' + JSON.stringify(data));
    }
    // الأولوية 2: POST body
    else if (e && e.postData && e.postData.contents) {
      Logger.log('Content-Type: ' + (e.postData.type || 'unknown'));
      Logger.log('Raw body: ' + e.postData.contents);
      try {
        data = JSON.parse(e.postData.contents);
        Logger.log('Source: JSON body | ' + JSON.stringify(data));
      } catch (parseErr) {
        // محاولة urlencoded يدوية
        var pairs = e.postData.contents.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var idx = pairs[i].indexOf('=');
          if (idx > 0) {
            var k = decodeURIComponent(pairs[i].substring(0, idx));
            var v = decodeURIComponent(pairs[i].substring(idx + 1).replace(/\+/g, ' '));
            data[k] = v;
          }
        }
        Logger.log('Source: manual urlencoded parse | ' + JSON.stringify(data));
      }
    }

    if (!data.name && !data.whatsapp) {
      Logger.log('⚠️ Empty payload received');
      return buildResponse({status: 'error', message: 'empty payload'});
    }

    var rowNum = insertRow(data);
    Logger.log('✅ doPost success, row: ' + rowNum);
    return buildResponse({status: 'ok', row: rowNum});

  } catch (err) {
    Logger.log('❌ doPost error: ' + err.message + '\n' + err.stack);
    return buildResponse({status: 'error', message: err.message});
  }
}

// ─── doGet: health check + بديل عند الحاجة ───────────────────────────────────
function doGet(e) {
  Logger.log('=== doGet called ===');

  try {
    var p = (e && e.parameter) ? e.parameter : {};
    Logger.log('GET params: ' + JSON.stringify(p));

    // Health check
    if (!p.name && !p.whatsapp) {
      return buildResponse({status: 'alive', version: 'v5', time: new Date().toISOString()});
    }

    var rowNum = insertRow(p);
    return buildResponse({status: 'ok', row: rowNum});

  } catch (err) {
    Logger.log('❌ doGet error: ' + err.message);
    return buildResponse({status: 'error', message: err.message});
  }
}

// ─── مساعد: بناء JSON response ────────────────────────────────────────────────
function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── testInsert: اختبار قبل النشر ────────────────────────────────────────────
// شغّل هذه الدالة من المحرر وتحقق من ظهور صف في الشيت
function testInsert() {
  var mockData = {
    timestamp:  new Date().toLocaleString('ar-EG', {timeZone: 'Africa/Cairo'}),
    name:       'اختبار v5 — ' + new Date().toLocaleTimeString(),
    whatsapp:   '+201105449828',
    business:   'كريتور - محتوى شخصي',
    platform:   'Instagram',
    goal:       'جذب عملاء',
    experience: 'لا، بعاني أصلاً في الاستمرارية',
    source:     'testInsert() v5',
    lang:       'عربي'
  };

  Logger.log('testInsert: starting with data: ' + JSON.stringify(mockData));
  var row = insertRow(mockData);
  Logger.log('✅ testInsert SUCCESS — row written: ' + row);
  Logger.log('Open the Sheet and check row ' + row);
}
