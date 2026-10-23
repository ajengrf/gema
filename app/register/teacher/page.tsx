"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";

const subjectOptionsByLevel = {
  SMP: ["Matematika", "IPA", "IPS", "Bahasa Inggris"],
  SMA: ["Matematika", "Fisika", "Kimia", "Biologi", "Pemrograman (Online)"],
};
const schoolLevels = ["SMP", "SMA"];
const teacherWeekdays = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const teacherTimes = [
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
  rows,
  type = "text",
}: {
  label: string;
  placeholder: string;
  rows?: number;
  type?: string;
}) {
  const isTextarea = typeof rows === "number";

  return (
    <div>
      <label className="mb-[6px] block text-[15px] font-medium text-[#1B2430]">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] text-base text-[#1B2430] outline-none transition focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] text-base text-[#1B2430] outline-none transition focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
        />
      )}
    </div>
  );
}

export default function TeacherRegisterPage() {
  const router = useRouter();
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<keyof typeof subjectOptionsByLevel>("SMA");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    setSelectedSubjects((prev) =>
      prev.filter((subject) =>
        subjectOptionsByLevel[selectedSchoolLevel].includes(subject),
      ),
    );
  }, [selectedSchoolLevel]);

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
          {siteConfig.teacher.title}
        </span>
      </header>

      <div className="px-[24px] pt-[20px]">
        <div className="mb-[10px] text-[13px] font-bold tracking-[1px] text-[#1E3A5F]">
          LANGKAH {step} DARI 3
        </div>
        <ProgressDots total={3} current={step} />
        <h1 className="mt-[20px] text-[26px] font-extrabold leading-[1.2] text-[#1E3A5F]">
          {step === 1
            ? siteConfig.teacher.step1Title
            : step === 2
              ? siteConfig.teacher.step2Title
              : siteConfig.teacher.step3Title}
        </h1>
        <p className="mt-[6px] text-[15px] leading-[1.5] text-[#4A5568]">
          {step === 1
            ? "Pilih jenjang, mata pelajaran, dan jadwal yang kamu bisa."
            : step === 2
              ? "Supaya kami bisa mencocokkanmu dengan siswa yang tepat."
              : "Supaya tim Gema bisa menghubungimu."}
        </p>
      </div>

      {step === 1 && (
        <div className="flex-1 space-y-[20px] px-[24px] pt-[24px]">
          <fieldset className="border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Jenjang yang diajar
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {schoolLevels.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  checked={selectedSchoolLevel === item}
                  onClick={() =>
                    setSelectedSchoolLevel(item as keyof typeof subjectOptionsByLevel)
                  }
                  type="radio"
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Mata pelajaran
            </legend>
            <div className="mb-[8px] text-[14px] text-[#4A5568]">
              Boleh pilih lebih dari satu
            </div>
            <div className="flex flex-wrap gap-[10px]">
              {subjectOptionsByLevel[selectedSchoolLevel].map((subject) => (
                <ToggleChip
                  key={subject}
                  label={subject}
                  checked={selectedSubjects.includes(subject)}
                  onClick={() =>
                    toggleOption(subject, selectedSubjects, setSelectedSubjects)
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Hari tersedia
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {teacherWeekdays.map((day) => (
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

          <fieldset className="border-0 p-0">
            <legend className="mb-[8px] block text-[15px] font-medium">
              Jam tersedia
            </legend>
            <div className="flex flex-wrap gap-[10px]">
              {teacherTimes.map((time) => (
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
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 space-y-[16px] px-[24px] pt-[24px]">
          <Field label="Universitas" placeholder="Nama universitas" />
          <Field label="Prodi" placeholder="Program studi" />
          <Field
            label="Pengalaman mengajar"
            placeholder="Contoh: les privat, bimbel, asisten dosen, atau mengajar di sekolah. Tulis juga berapa lama."
            rows={5}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 space-y-[16px] px-[24px] pt-[24px]">
          <Field label="Nama lengkap" placeholder="Nama lengkap" />
          <Field label="No. telepon" placeholder="08xx xxxx xxxx" type="tel" />
          <Field
            label="Alamat"
            placeholder="Jalan, nomor, RT/RW, kelurahan, kota"
            rows={3}
          />
        </div>
      )}

      <div className="mt-auto border-t border-[#E3E8EF] bg-[#FAF7F2] px-[24px] pb-[24px] pt-[16px]">
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
            className="w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-[17px] font-extrabold text-[#1E3A5F]"
          >
            Lanjut
          </button>
        ) : (
          <Link
            href="/confirmation"
            className="block w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-center text-[17px] font-extrabold text-[#1E3A5F]"
          >
            Kirim pendaftaran
          </Link>
        )}
      </div>
    </main>
  );
}
