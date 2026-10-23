import Link from "next/link";

function GemaMark() {
  return (
    <svg width="96" height="96" viewBox="0 0 120 120" aria-hidden="true">
      <rect x="80" y="20" width="10" height="22" fill="#F2B632" />
      <polygon points="80,20 85,6 90,20" fill="#FAF7F2" />
      <polyline
        points="16,60 60,24 104,60"
        fill="none"
        stroke="#FAF7F2"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78 69.4 A22 22 0 1 0 82 82 L62 82"
        fill="none"
        stroke="#FAF7F2"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#1E3A5F] px-[28px] pb-[32px] pt-[56px] text-[#FAF7F2]">
      <div className="flex flex-col items-center text-center">
        <GemaMark />
        <div className="mt-[12px] text-[44px] font-extrabold leading-none">gema</div>
        <div className="mt-[8px] text-[12px] font-medium tracking-[2px] text-[#F2B632]">
          GURU KE RUMAH
        </div>
      </div>

      <div className="mt-auto">
        <h1 className="mb-[8px] text-[28px] font-extrabold leading-[1.2]">
          Kamu mau daftar sebagai apa?
        </h1>
        <p className="mb-[28px] text-[15px] leading-[1.5] text-[#D6E4F0]">
          Pilih salah satu untuk melanjutkan.
        </p>

        <Link
          href="/register/student"
          className="flex w-full items-center gap-[16px] rounded-[20px] bg-[#F2B632] px-[22px] text-left text-[#1E3A5F] shadow-sm"
          style={{ minHeight: "88px" }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1E3A5F"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M12 3l9 5-9 5-9-5 9-5z" />
            <path d="M7 11v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" />
          </svg>
          <span>
            <span className="block text-[20px] font-extrabold">Saya Siswa</span>
            <span className="mt-[2px] block text-[14px] font-medium">
              Cari guru les ke rumah
            </span>
          </span>
        </Link>

        <Link
          href="/register/teacher"
          className="mt-[14px] flex w-full items-center gap-[16px] rounded-[20px] border-2 border-[#FAF7F2] bg-transparent px-[22px] text-left text-[#FAF7F2]"
          style={{ minHeight: "88px" }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F2B632"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M12 16v4M8 20h8" />
          </svg>
          <span>
            <span className="block text-[20px] font-extrabold">Saya Guru</span>
            <span className="mt-[2px] block text-[14px] font-medium text-[#D6E4F0]">
              Gabung dan mengajar bersama Gema
            </span>
          </span>
        </Link>
      </div>

      <div className="mt-[32px] text-center text-[13px] text-[#D6E4F0]">@gema.lpg</div>
    </main>
  );
}
