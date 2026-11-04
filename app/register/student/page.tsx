"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/site.config";
import { submitRegistration } from "@/lib/registrations";

const subjectOptionsByLevel = {
  SMP: ["Matematika", "IPA", "IPS", "Bahasa Inggris", "Lainnya"],
  SMA: [
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Pemrograman (Online)",
    "Lainnya",
  ],
};
const schoolLevels = ["SMP", "SMA"];
const weekdays = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const times = [
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
  "18.00",
  "19.00",
];

const chipBase =
  "relative inline-flex items-center justify-center rounded-full border text-base font-medium transition-all";

function BackIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-[6px] flex-1 rounded-full ${
            index < current ? "bg-[#1E3A5F]" : "bg-[#D6E4F0]"
          }`}
        />
      ))}
    </div>
  );
}

function ToggleChip({
  label,
  checked,
  onClick,
  type = "checkbox",
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  type?: "checkbox" | "radio";
}) {
  return (
    <label className={chipBase + " cursor-pointer"}>
      <input
        type={type}
        checked={checked}
        onChange={onClick}
        className="sr-only"
      />
      <span
        className={`inline-flex min-h-[44px] items-center rounded-full border px-[18px] text-[15px] font-medium transition-all ${
          checked
            ? "border-[#1E3A5F] bg-[#1E3A5F] text-[#FAF7F2]"
            : "border-[#B9C4D2] bg-white text-[#1B2430]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function Field({
  label,
  placeholder,
  name,
  value,
  onChange,
  rows,
  helper,
  type = "text",
}: {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  helper?: string;
  type?: string;
}) {
  const isTextarea = typeof rows === "number";

  return (
    <div>
      <label htmlFor={name} className="mb-[6px] block text-[15px] font-medium text-[#1B2430]">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] text-base text-[#1B2430] outline-none transition focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] text-base text-[#1B2430] outline-none transition focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
        />
      )}
      {helper ? (
        <div className="mt-[6px] text-[13px] text-[#4A5568]">{helper}</div>
      ) : null}
    </div>
  );
}

export default function StudentRegisterPage() {
  const router = useRouter();
  const [selectedSchoolLevel, setSelectedSchoolLevel] =
    useState<keyof typeof subjectOptionsByLevel>("SMA");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [genderPreference, setGenderPreference] = useState<string>(
    "Tidak ada preferensi",
  );
  const [details, setDetails] = useState({
    fullName: "",
    schoolName: "",
    phone: "",
    address: "",
  });
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/register");
  };

  const toggleOption = (
    value: string,
    selected: string[],
    setSelected: (next: string[]) => void,
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
      return;
    }
    setSelected([...selected, value]);
  };

  const updateDetail = (field: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const selectSchoolLevel = (level: keyof typeof subjectOptionsByLevel) => {
    setSelectedSchoolLevel(level);
    setSelectedSubjects((current) =>
      current.filter((subject) => subjectOptionsByLevel[level].includes(subject)),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitRegistration({
        type: "student",
        schoolLevel: selectedSchoolLevel,
        subjects: selectedSubjects,
        days: selectedDays,
        times: selectedTimes,
        genderPreference,
        ...details,
        website,
      });
      router.push("/confirmation");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Pendaftaran gagal dikirim.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitle =
    step === 1
      ? "Kamu mau belajar apa?"
      : step === 2
        ? "Kapan kamu bisa belajar?"
        : "Terakhir, data dirimu";

  const stepSubtitle =
    step === 1
      ? "Pilih jenjang dan mata pelajaran."
      : step === 2
        ? "Pilih semua hari dan jam yang cocok. Kami cocokkan dengan jadwal guru."
        : "Supaya tim Gema bisa menghubungi dan guru tahu ke mana harus datang.";

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B2430]">
      <header className="sticky top-0 z-10 flex h-[64px] items-center gap-[6px] bg-[#1E3A5F] px-[12px] text-[#FAF7F2] shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Kembali"
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-transparent text-[#FAF7F2]"
        >
          <BackIcon />
        </button>
        <span className="text-[18px] font-extrabold">
          {siteConfig.student.title}
        </span>
      </header>

      <div className="px-[24px] pt-[20px]">
        <div className="mb-[10px] text-[13px] font-bold tracking-[1px] text-[#1E3A5F]">
          LANGKAH {step} DARI 3
        </div>
        <ProgressDots total={3} current={step} />
        <h1 className="mt-[20px] text-[26px] font-extrabold leading-[1.2] text-[#1E3A5F]">
          {stepTitle}
        </h1>
        <p className="mt-[6px] text-[15px] leading-[1.5] text-[#4A5568]">
          {stepSubtitle}
        </p>
      </div>

      {step === 1 && (
        <div className="px-[24px] pt-[20px]">
          <div className="rounded-[12px] bg-[#D6E4F0] px-[16px] py-[12px]">
            <div className="flex items-baseline gap-[6px]">
              <span className="text-[14px] text-[#1B2430]">
                Biaya mulai dari
              </span>
              <span className="text-[18px] font-extrabold text-[#1E3A5F]">
                {siteConfig.priceLabel}
              </span>
            </div>
            <div className="mt-[2px] text-[14px] text-[#1B2430]">
              per pertemuan
            </div>
          </div>

          <fieldset className="mt-[24px] border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Jenjang sekolah
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {schoolLevels.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  checked={selectedSchoolLevel === item}
                  onClick={() => selectSchoolLevel(item as keyof typeof subjectOptionsByLevel)}
                  type="radio"
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-[24px] border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Mata pelajaran
            </legend>
            <div className="mb-[8px] text-[14px] text-[#4A5568]">
              Boleh pilih lebih dari satu
            </div>
            <div className="flex flex-wrap gap-[10px]">
              {subjectOptionsByLevel[selectedSchoolLevel].map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  checked={selectedSubjects.includes(item)}
                  onClick={() =>
                    toggleOption(item, selectedSubjects, setSelectedSubjects)
                  }
                />
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="px-[24px] pt-[24px]">
          <fieldset className="mb-[20px] border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Hari yang kamu bisa
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {weekdays.map((day) => (
                <ToggleChip
                  key={day}
                  label={day}
                  checked={selectedDays.includes(day)}
                  onClick={() =>
                    toggleOption(day, selectedDays, setSelectedDays)
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-[24px] border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Jam yang kamu bisa
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {times.map((time) => (
                <ToggleChip
                  key={time}
                  label={time}
                  checked={selectedTimes.includes(time)}
                  onClick={() =>
                    toggleOption(time, selectedTimes, setSelectedTimes)
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Preferensi gender guru{" "}
              <span className="font-normal text-[#4A5568]">(opsional)</span>
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {["Laki-laki", "Perempuan", "Tidak ada preferensi"].map(
                (option) => (
                  <ToggleChip
                    key={option}
                    label={option}
                    checked={genderPreference === option}
                    onClick={() => setGenderPreference(option)}
                    type="radio"
                  />
                ),
              )}
            </div>
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 px-[24px] pt-[24px]">
          <div className="space-y-[16px]">
            <Field
              label="Nama lengkap"
              name="fullName"
              value={details.fullName}
              onChange={(value) => updateDetail("fullName", value)}
              placeholder="Nama siswa"
            />
            <Field
              label="Nama sekolah"
              name="schoolName"
              value={details.schoolName}
              onChange={(value) => updateDetail("schoolName", value)}
              placeholder="Nama sekolah saat ini"
            />
            <Field
              label="No. telepon (siswa atau orang tua)"
              name="phone"
              value={details.phone}
              onChange={(value) => updateDetail("phone", value)}
              placeholder="08xx xxxx xxxx"
              type="tel"
            />
            <Field
              label="Alamat rumah"
              name="address"
              value={details.address}
              onChange={(value) => updateDetail("address", value)}
              placeholder="Jalan, nomor, RT/RW, kelurahan, kota"
              rows={3}
              helper="Alamat hanya dibagikan ke guru yang ditugaskan."
            />
          </div>

          <div className="mt-[24px] rounded-[14px] border border-[#E3E8EF] bg-white p-[18px]">
            <div className="h-[20px] text-[40px] font-extrabold leading-none text-[#F2B632]">
              “
            </div>
            <div className="mt-[10px] text-[15px] font-medium leading-[1.55] text-[#1B2430]">
              {siteConfig.review.quote}
            </div>
            <div className="mt-[12px] text-[14px] font-bold text-[#1E3A5F]">
              {siteConfig.review.author}
            </div>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="student-website">Website</label>
        <input
          id="student-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="sticky bottom-0 z-20 mt-[24px] border-t border-[#E3E8EF] bg-[#FAF7F2]/95 px-[24px] pb-[24px] pt-[16px] backdrop-blur-sm">
        {submitError ? (
          <p role="alert" className="mb-[12px] text-[14px] font-medium text-red-700">
            {submitError}
          </p>
        ) : null}
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
            className="w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-[17px] font-extrabold text-[#1E3A5F] shadow-[0_8px_18px_rgba(242,182,50,0.28)]"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="block w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-center text-[17px] font-extrabold text-[#1E3A5F] shadow-[0_8px_18px_rgba(242,182,50,0.28)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Mengirim..." : "Daftar les sekarang"}
          </button>
        )}
      </div>
    </main>
  );
}
