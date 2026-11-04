"use client";

import { siteConfig } from "@/site.config";
import { useRegistrationConfirmation } from "@/lib/registration-confirmation";

export default function WhatsAppRegistrationLink() {
  const registration = useRegistrationConfirmation();
  const whatsappUrl = new URL(siteConfig.whatsappUrl);

  if (registration) {
    const roleLabel = registration.type === "student" ? "siswa" : "guru";
    const message = [
      `Halo Gema, saya baru saja mengirim pendaftaran sebagai ${roleLabel}.`,
      `ID pendaftaran: ${registration.registrationId}`,
      "Mohon info langkah selanjutnya.",
    ].join("\n");
    whatsappUrl.searchParams.set("text", message);
  }

  return (
    <a
      href={whatsappUrl.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-[24px] block w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-center text-[17px] font-extrabold text-[#1E3A5F]"
    >
      Chat WhatsApp
    </a>
  );
}
