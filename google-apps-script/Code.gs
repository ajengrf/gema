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
      const sheet = getRegistrationSheet(spreadsheetId, payload.type);
      const commonValues = [
        new Date(),
        payload.fullName || "",
        payload.phone || "",
        payload.address || "",
        payload.schoolLevel || "",
      ];
      const scheduleValues = [
        (payload.subjects || []).join(", "),
        (payload.days || []).join(", "),
        (payload.times || []).join(", "),
      ];

      if (payload.type === "student") {
        sheet.appendRow([
          ...commonValues,
          payload.schoolName || "",
          ...scheduleValues,
          payload.genderPreference || "",
        ]);
      } else {
        sheet.appendRow([
          ...commonValues,
          payload.university || "",
          payload.studyProgram || "",
          payload.experience || "",
          ...scheduleValues,
        ]);
      }
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false });
  }
}

function getRegistrationSheet(spreadsheetId, type) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const isStudent = type === "student";
  const sheetName = isStudent ? "Pendaftaran Siswa" : "Pendaftaran Guru";
  const headers = isStudent
    ? [
        "Waktu daftar",
        "Nama lengkap",
        "Nomor telepon",
        "Alamat",
        "Jenjang",
        "Nama sekolah",
        "Mata pelajaran",
        "Hari tersedia",
        "Jam tersedia",
        "Preferensi gender guru",
      ]
    : [
        "Waktu daftar",
        "Nama lengkap",
        "Nomor telepon",
        "Alamat",
        "Jenjang yang diajar",
        "Universitas",
        "Program studi",
        "Pengalaman mengajar",
        "Mata pelajaran",
        "Hari tersedia",
        "Jam tersedia",
      ];
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}