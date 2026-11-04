interface Env {
  APPS_SCRIPT_URL: string;
  APPS_SCRIPT_SECRET: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface RegistrationPayload {
  type: "student" | "teacher";
  website?: string;
  [key: string]: unknown;
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const onRequest: (context: PagesContext) => Promise<Response> = async ({
  request,
  env,
}) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Metode tidak diizinkan." }, 405);
  }

  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_SECRET) {
    return jsonResponse({ error: "Pendaftaran belum dikonfigurasi." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return jsonResponse({ error: "Data pendaftaran terlalu besar." }, 413);
  }

  let payload: RegistrationPayload;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 16_384) {
      return jsonResponse({ error: "Data pendaftaran terlalu besar." }, 413);
    }
    payload = JSON.parse(body) as RegistrationPayload;
  } catch {
    return jsonResponse({ error: "Format data tidak valid." }, 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonResponse({ error: "Format data tidak valid." }, 400);
  }

  if (payload.website) {
    return jsonResponse({ ok: true }, 200);
  }

  if (payload.type !== "student" && payload.type !== "teacher") {
    return jsonResponse({ error: "Jenis pendaftaran tidak valid." }, 400);
  }

  const requiredFields =
    payload.type === "student"
      ? ["fullName", "schoolName", "phone", "address"]
      : ["fullName", "phone", "address", "university", "studyProgram"];

  if (
    requiredFields.some(
      (field) =>
        typeof payload[field] !== "string" ||
        !(payload[field] as string).trim() ||
        (payload[field] as string).length > 2_000,
    )
  ) {
    return jsonResponse({ error: "Lengkapi semua data wajib terlebih dahulu." }, 400);
  }

  if (
    !Array.isArray(payload.subjects) ||
    !Array.isArray(payload.days) ||
    !Array.isArray(payload.times)
  ) {
    return jsonResponse({ error: "Pilihan pendaftaran tidak valid." }, 400);
  }

  try {
    const response = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, token: env.APPS_SCRIPT_SECRET }),
      redirect: "follow",
    });

    if (!response.ok) {
      return jsonResponse({ error: "Pendaftaran belum berhasil disimpan." }, 502);
    }

    const result = (await response.json()) as { ok?: boolean };
    if (!result.ok) {
      return jsonResponse({ error: "Pendaftaran belum berhasil disimpan." }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch {
    return jsonResponse({ error: "Tidak dapat menghubungi layanan pendaftaran." }, 502);
  }
};