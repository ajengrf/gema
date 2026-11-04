"use client";

import { siteConfig } from "@/site.config";

export default function WhatsAppRegistrationLink() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const query = new URLSearchParams(window.location.search);
    const registrationType = query.get("type");
    const registrationId = query.get("id");

    if (
      !registrationId ||
      (registrationType !== "student" && registrationType !== "teacher")
    ) {
      window.open(siteConfig.whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const roleLabel = registrationType === "student" ? "siswa" : "guru";
    const message = [
      `Halo Gema, saya baru saja mengirim pendaftaran sebagai ${roleLabel}.`,
      `ID pendaftaran: ${registrationId}`,
      "Mohon info langkah selanjutnya.",
    ].join("\n");
    const whatsappUrl = new URL(siteConfig.whatsappUrl);
    whatsappUrl.searchParams.set("text", message);

    window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="mt-[24px] block w-full rounded-full bg-[#F2B632] px-[20px] py-[16px] text-center text-[17px] font-extrabold text-[#1E3A5F]"
    >
      Chat WhatsApp
    </a>
  );
}
