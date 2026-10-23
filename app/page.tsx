import Link from "next/link";
import { siteConfig } from "@/site.config";

function GemaMark() {
  return (
    <svg width="42" height="42" viewBox="0 0 120 120" aria-hidden="true">
      <rect x="80" y="20" width="10" height="22" fill="#F2B632" />
      <polygon points="80,20 85,6 90,20" fill="#1E3A5F" />
      <polyline
        points="16,60 60,24 104,60"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78 69.4 A22 22 0 1 0 82 82 L62 82"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1E3A5F]">
      <div className="mx-auto max-w-md px-[24px] pb-[32px] pt-[22px]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#E8F1F8]">
              <GemaMark />
            </div>
            <div>
              <div className="text-[28px] font-extrabold leading-none">gema</div>
              <div className="mt-[2px] text-[9px] font-bold tracking-[2px] text-[#F2B632]">
                GURU KE RUMAH
              </div>
            </div>
          </div>

          <Link
            href="/register"
            className="rounded-full border border-[#D6E4F0] bg-white px-[16px] py-[10px] text-[13px] font-bold text-[#1E3A5F]"
          >
            Daftar
          </Link>
        </header>

        <section className="mt-[28px] overflow-hidden rounded-[28px] bg-[#1E3A5F] p-[22px] text-[#FAF7F2] shadow-[0_18px_42px_rgba(30,58,95,0.18)]">
          <div className="inline-flex rounded-full bg-[#F4D77B] px-[10px] py-[6px] text-[11px] font-bold text-[#1E3A5F]">
            Pilihan paling cocok untuk belajar di rumah
          </div>

          <h1 className="mt-[18px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em]">
            Cari guru les pribadi yang tepat untukmu.
          </h1>

          <p className="mt-[12px] text-[15px] leading-[1.6] text-[#D6E4F0]">
            Belajar dengan guru berpengalaman, jadwal yang fleksibel, dan proses
            pendaftaran yang cepat.
          </p>

          <div className="mt-[22px] flex gap-[12px]">
            <Link
              href="/register"
              className="flex-1 rounded-full bg-[#F2B632] px-[18px] py-[15px] text-center text-[15px] font-extrabold text-[#1E3A5F]"
            >
              Daftar sekarang
            </Link>
          </div>

          <div className="mt-[22px] rounded-[18px] bg-[#FAF7F2] p-[16px] text-[#1E3A5F]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="text-[14px] font-medium">Biaya mulai dari</span>
              <span className="text-[24px] font-extrabold leading-none">
                {siteConfig.priceLabel}
              </span>
            </div>
            <div className="mt-[4px] text-[13px] font-medium text-[#4A5568]">
              per pertemuan
            </div>
          </div>
        </section>

        <section className="mt-[24px] grid gap-[12px]">
          {[
            { title: "Guru berkualitas", body: "Dipilih sesuai kebutuhan dan jenjang belajar." },
            { title: "Jadwal fleksibel", body: "Pilih hari dan jam yang paling cocok untuk kamu." },
            { title: "Proses mudah", body: "Daftar cepat, hubungi guru, dan mulai belajar." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] border border-[#D6E4F0] bg-white p-[16px]"
            >
              <div className="text-[18px] font-extrabold text-[#1E3A5F]">
                {item.title}
              </div>
              <div className="mt-[6px] text-[14px] leading-[1.5] text-[#4A5568]">
                {item.body}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-[24px] rounded-[18px] border border-[#E8EEF4] bg-white p-[18px]">
          <div className="text-[14px] font-bold uppercase tracking-[1px] text-[#4A5568]">
            Review siswa
          </div>
          <div className="mt-[12px] text-[16px] font-medium leading-[1.6] text-[#1E3A5F]">
            “{siteConfig.review.quote}”
          </div>
          <div className="mt-[14px] text-[13px] font-bold text-[#1E3A5F]">
            {siteConfig.review.author}
          </div>
        </section>

        <footer className="mt-[28px] text-center text-[12px] font-medium text-[#4A5568]">
          Gema hadir di {siteConfig.city}
        </footer>
      </div>
    </main>
  );
}
