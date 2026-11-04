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

    const registrationId = `GM-${Utilities.getUuid()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase()}`;
    try {
      const sheet = getRegistrationSheet(spreadsheetId, payload.type);
      const headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];
      const valuesByHeader = {
        "Waktu daftar": new Date(),
        "ID Pendaftaran": registrationId,
        "Nama lengkap": payload.fullName || "",
        "Nomor telepon": payload.phone || "",
        Alamat: payload.address || "",
        Jenjang:
          payload.type === "student" ? payload.schoolLevel || "" : undefined,
        "Jenjang yang diajar":
          payload.type === "teacher" ? payload.schoolLevel || "" : undefined,
        "Nama sekolah": payload.schoolName || "",
        Universitas: payload.university || "",
        "Program studi": payload.studyProgram || "",
        "Pengalaman mengajar": payload.experience || "",
        "Mata pelajaran": (payload.subjects || []).join(", "),
        "Hari tersedia": (payload.days || []).join(", "),
        "Jam tersedia": (payload.times || []).join(", "),
        "Preferensi gender guru": payload.genderPreference || "",
      };

      sheet.appendRow(headers.map((header) => valuesByHeader[header] ?? ""));
    } finally {
      lock.releaseLock();
    }

    sendRegistrationNotification(payload, spreadsheetId, registrationId);
    return jsonResponse({ ok: true, registrationId });
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
        "ID Pendaftaran",
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
        "ID Pendaftaran",
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
  } else {
    const existingHeaders = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    if (!existingHeaders.includes("ID Pendaftaran")) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue("ID Pendaftaran");
    }
  }

  return sheet;
}

function sendRegistrationNotification(payload, spreadsheetId, registrationId) {
  try {
    const recipient =
      PropertiesService.getScriptProperties().getProperty("NOTIFICATION_EMAIL");
    if (!recipient) return;

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheetName =
      payload.type === "student" ? "Pendaftaran Siswa" : "Pendaftaran Guru";
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Sheet tidak ditemukan: ${sheetName}`);

    const spreadsheetUrl = `${spreadsheet.getUrl()}#gid=${sheet.getSheetId()}`;
    const registrationType = payload.type === "student" ? "Siswa" : "Guru";
    const body = [
      `Ada pendaftaran ${registrationType} baru.`,
      `ID pendaftaran: ${registrationId}`,
      `Nama: ${payload.fullName || "-"}`,
      `Telepon: ${payload.phone || "-"}`,
      `Jenjang: ${payload.schoolLevel || "-"}`,
      `Mata pelajaran: ${(payload.subjects || []).join(", ") || "-"}`,
      `Hari: ${(payload.days || []).join(", ") || "-"}`,
      `Jam: ${(payload.times || []).join(", ") || "-"}`,
      "",
      `Buka tab ${sheetName}: ${spreadsheetUrl}`,
    ].join("\n");

    MailApp.sendEmail({
      to: recipient,
      subject: `[Gema] Pendaftaran ${registrationType} baru`,
      body,
    });
  } catch (error) {
    console.error("Notifikasi email gagal dikirim:", error);
  }
}

function authorizeEmailNotifications() {
  MailApp.getRemainingDailyQuota();
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
