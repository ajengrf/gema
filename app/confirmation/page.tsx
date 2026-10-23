import Link from "next/link";
import { siteConfig } from "@/site.config";

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FAF7F2] px-[24px] pb-[28px] pt-[24px] text-[#1B2430]">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-[20px] flex items-center justify-between">
          <Link href="/" className="text-[14px] font-medium text-[#1E3A5F]">
            ← Kembali
          </Link>
        </div>

        <div className="rounded-[24px] bg-white p-[20px] shadow-sm ring-1 ring-[#E3E8EF]">
          <div className="mb-[14px] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#D6E4F0] text-[28px]">
            ✓
          </div>

          <div className="text-[26px] font-extrabold leading-[1.2] text-[#1E3A5F]">
            Pendaftaran dikirim
          </div>

          <p className="mt-[12px] text-[15px] leading-[1.6] text-[#4A5568]">
            Terima kasih. Tim Gema akan meninjau data kamu dan menghubungi lewat
            WhatsApp untuk langkah berikutnya.
          </p>

          <div className="mt-[18px] rounded-[16px] bg-[#F8F5EF] p-[14px] text-[14px] leading-[1.6] text-[#1B2430]">
            <div className="font-bold text-[#1E3A5F]">Kota kami</div>
            <div>{siteConfig.city}</div>
            <div className="mt-[10px] font-bold text-[#1E3A5F]">WhatsApp</div>
            <a
              href={siteConfig.whatsappUrl}
              className="text-[#1E3A5F] underline"
            >
              {siteConfig.whatsappNumber}
            </a>
          </div>

          <Link
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[24px] block w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-center text-[17px] font-extrabold text-[#1E3A5F]"
          >
            Chat WhatsApp
          </Link>
        </div>
      </div>
    </main>
  );
}
