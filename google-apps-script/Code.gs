function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const expectedToken = properties.getProperty("REGISTRATION_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");

    if (!expectedToken || payload.token !== expectedToken || !spreadsheetId) {
      return jsonResponse({ ok: false });
    }

    if (payload.type !== "student" && payload.type !== "teacher") {
      return jsonResponse({ ok: false });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getRegistrationSheet(spreadsheetId);
      sheet.appendRow([
        new Date(),
        payload.type,
        payload.fullName || "",
        payload.phone || "",
        payload.address || "",
        payload.schoolLevel || "",
        payload.schoolName || "",
        payload.university || "",
        payload.studyProgram || "",
        payload.experience || "",
        (payload.subjects || []).join(", "),
        (payload.days || []).join(", "),
        (payload.times || []).join(", "),
        payload.genderPreference || "",
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false });
  }
}

function getRegistrationSheet(spreadsheetId) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName("Pendaftaran");

  if (!sheet) {
    sheet = spreadsheet.insertSheet("Pendaftaran");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Waktu daftar",
      "Jenis pendaftar",
      "Nama lengkap",
      "Nomor telepon",
      "Alamat",
      "Jenjang",
      "Nama sekolah",
      "Universitas",
      "Program studi",
      "Pengalaman mengajar",
      "Mata pelajaran",
      "Hari tersedia",
      "Jam tersedia",
      "Preferensi gender guru",
    ]);
  }

  return sheet;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}