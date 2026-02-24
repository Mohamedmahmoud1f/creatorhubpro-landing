/**
 * CreatorHubPro — Google Apps Script v3
 * Sheet ID: 19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc
 */

var SHEET_ID   = '19O2b1diIOLC2dy-ZWam1f6jThFE1YLS6ja7Yb3j6zRc';
var SHEET_NAME = 'Leads';

function getOrCreateSheet() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // كتابة العناوين مباشرة بالترتيب الصحيح
    sheet.getRange('A1').setValue('التاريخ والوقت');
    sheet.getRange('B1').setValue('الاسم');
    sheet.getRange('C1').setValue('واتساب');
    sheet.getRange('D1').setValue('النشاط');
    sheet.getRange('E1').setValue('المنصة');
    sheet.getRange('F1').setValue('الهدف');
    sheet.getRange('G1').setValue('الاستمرارية');
    sheet.getRange('H1').setValue('المصدر');
    sheet.getRange('I1').setValue('اللغة');

    // تنسيق العناوين
    var hr = sheet.getRange('A1:I1');
    hr.setBackground('#4F46E5');
    hr.setFontColor('#FFFFFF');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    // عرض الأعمدة
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

  return sheet;
}

function writeRow(sheet, data) {
  var nextRow = sheet.getLastRow() + 1;
  var ts = data.timestamp || new Date().toLocaleString('ar-EG', {timeZone: 'Africa/Cairo'});

  // كتابة كل خلية بشكل مستقل لضمان الترتيب الصحيح
  sheet.getRange(nextRow, 1).setValue(ts);
  sheet.getRange(nextRow, 2).setValue(data.name       || '');
  sheet.getRange(nextRow, 3).setValue(data.whatsapp   || '');
  sheet.getRange(nextRow, 4).setValue(data.business   || '');
  sheet.getRange(nextRow, 5).setValue(data.platform   || '');
  sheet.getRange(nextRow, 6).setValue(data.goal       || '');
  sheet.getRange(nextRow, 7).setValue(data.experience || '');
  sheet.getRange(nextRow, 8).setValue(data.source     || 'CreatorHubPro Landing Page');
  sheet.getRange(nextRow, 9).setValue(data.lang       || 'عربي');

  // تلوين الصفوف بالتناوب
  var bg = (nextRow % 2 === 0) ? '#F3F4F6' : '#FFFFFF';
  sheet.getRange(nextRow, 1, 1, 9).setBackground(bg);

  return nextRow;
}

// ─── doGet — يستقبل البيانات كـ query params ─────────────────────────────────
function doGet(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // طلب اختبار بدون بيانات
    if (!p.name && !p.whatsapp) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status:  'alive',
          message: 'CreatorHubPro Sheets v3 OK',
          time:    new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet  = getOrCreateSheet();
    var rowNum = writeRow(sheet, p);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: rowNum }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── doPost ───────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var raw  = (e && e.postData) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var sheet  = getOrCreateSheet();
    var rowNum = writeRow(sheet, data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: rowNum }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── testInsert — شغّلها للاختبار ─────────────────────────────────────────────
function testInsert() {
  var sheet = getOrCreateSheet();
  var rowNum = writeRow(sheet, {
    timestamp:  new Date().toLocaleString('ar-EG', {timeZone: 'Africa/Cairo'}),
    name:       'أحمد محمود - اختبار',
    whatsapp:   '+201105449828',
    business:   'كريتور - محتوى شخصي',
    platform:   'Instagram',
    goal:       'جذب عملاء',
    experience: 'لا، بعاني أصلاً في الاستمرارية',
    source:     'Test v3',
    lang:       'عربي'
  });
  Logger.log('✅ تم الكتابة في الصف رقم: ' + rowNum);
  Logger.log('افتح الـ Sheet وتحقق من الصف ' + rowNum);
}
