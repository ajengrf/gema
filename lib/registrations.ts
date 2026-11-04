export type StudentRegistration = {
  type: "student";
  schoolLevel: string;
  subjects: string[];
  days: string[];
  times: string[];
  genderPreference: string;
  fullName: string;
  schoolName: string;
  phone: string;
  kodeWilayah: string;
  kecamatan: string;
  kelurahan: string;
  address: string;
  website: string;
};

export type TeacherRegistration = {
  type: "teacher";
  schoolLevel: string;
  subjects: string[];
  days: string[];
  times: string[];
  university: string;
  studyProgram: string;
  experience: string;
  fullName: string;
  phone: string;
  kodeWilayah: string;
  kecamatan: string;
  kelurahan: string;
  address: string;
  website: string;
};

export async function submitRegistration(
  payload: StudentRegistration | TeacherRegistration,
): Promise<{ registrationId: string }> {
  const requiredFields =
    payload.type === "student"
      ? [
          payload.fullName,
          payload.schoolName,
          payload.phone,
          payload.kodeWilayah,
          payload.kecamatan,
          payload.kelurahan,
          payload.address,
        ]
      : [
          payload.fullName,
          payload.phone,
          payload.kodeWilayah,
          payload.kecamatan,
          payload.kelurahan,
          payload.address,
          payload.university,
          payload.studyProgram,
        ];

  if (requiredFields.some((value) => !value.trim())) {
    throw new Error("Lengkapi semua data wajib terlebih dahulu.");
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[Gema] Pendaftaran development (tidak disimpan):", payload);
    return {
      registrationId: `DEV-GM-${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`,
    };
  }

  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as {
    error?: string;
    ok?: boolean;
    registrationId?: string;
  };
  if (!response.ok || !result.ok || !result.registrationId) {
    throw new Error(result.error ?? "Pendaftaran gagal dikirim.");
  }

  return { registrationId: result.registrationId };
}
