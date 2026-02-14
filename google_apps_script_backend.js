
/**
 * GOOGLE APPS SCRIPT BACKEND FOR ERALDATZEN
 * Ikastetxeen datu-base zentralizatua eta Streamlit integrazioa.
 */

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Datu-base nagusia (ERALDATZEN_DB)
  if (action === 'getAll') {
    var sheet = getDatabaseSheet();
    var data = sheet.getDataRange().getValues();
    var records = {};
    for (var i = 1; i < data.length; i++) {
      var code = data[i][0].toString();
      var jsonStr = data[i][1];
      try { records[code] = JSON.parse(jsonStr); } catch(err) {}
    }
    
    // 2. Streamlit bidezko sarrerak (Sheet1)
    var streamlitSheet = ss.getSheetByName("Sheet1");
    var streamlitEntries = [];
    if (streamlitSheet) {
      var sData = streamlitSheet.getDataRange().getValues();
      for (var j = 1; j < sData.length; j++) {
        streamlitEntries.push({
          data: sData[j][0],
          ikastetxea: sData[j][1],
          erronka: sData[j][2],
          deskribapena: sData[j][3]
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      records: records,
      streamlitEntries: streamlitEntries
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'No action'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); 
  
  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var sheet = getDatabaseSheet();
    
    if (action === 'save') {
      var code = request.code.toString();
      var dataStr = JSON.stringify(request.data);
      var values = sheet.getDataRange().getValues();
      var foundRow = -1;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0].toString() == code) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow > -1) {
        sheet.getRange(foundRow, 2).setValue(dataStr);
        sheet.getRange(foundRow, 3).setValue(new Date());
      } else {
        sheet.appendRow([code, dataStr, new Date()]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getDatabaseSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "ERALDATZEN_DB";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["KODEA", "DATA_JSON", "AZKEN_EGUNERAKETA"]);
    sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  }
  return sheet;
}
