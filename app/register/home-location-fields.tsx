import {
  getTemporarySubdistricts,
  temporaryDistricts,
} from "@/lib/home-location";

type HomeLocationFieldsProps = {
  district: string;
  subdistrict: string;
  onDistrictChange: (value: string) => void;
  onSubdistrictChange: (value: string) => void;
};

function SelectChevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export default function HomeLocationFields({
  district,
  subdistrict,
  onDistrictChange,
  onSubdistrictChange,
}: HomeLocationFieldsProps) {
  const subdistricts = getTemporarySubdistricts(district);

  return (
    <section aria-labelledby="home-location-title" className="space-y-[16px]">
      <label
        htmlFor={"location"}
        className="mb-[6px] block text-[15px] font-medium text-[#1B2430]"
      >
        Lokasi rumah
      </label>

      <div className="flex min-h-[52px] items-center gap-[12px] rounded-[10px] bg-[#D6E4F0] px-[14px] font-semibold text-[#1E3A5F]">
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
          className="shrink-0"
        >
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span>Kota Bandar Lampung, Lampung</span>
      </div>

      <div>
        <label
          htmlFor="home-district"
          className="mb-[6px] block text-[15px] font-medium text-[#1B2430]"
        >
          Kecamatan
        </label>

        <div className="relative">
          <select
            id="home-district"
            name="homeDistrict"
            required
            value={district}
            onChange={(event) => onDistrictChange(event.target.value)}
            className="h-[52px] w-full appearance-none rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] pr-[48px] text-base text-[#1B2430] outline-none focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
          >
            <option value="">Pilih kecamatan</option>
            {temporaryDistricts.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      </div>

      {district ? (
        <div>
          <label
            htmlFor="home-subdistrict"
            className="mb-[6px] block text-[15px] font-medium text-[#1B2430]"
          >
            Kelurahan
          </label>
          <div className="relative">
            <select
              id="home-subdistrict"
              name="homeSubdistrict"
              required
              value={subdistrict}
              onChange={(event) => onSubdistrictChange(event.target.value)}
              className="h-[52px] w-full appearance-none rounded-[10px] border border-[#B9C4D2] bg-white px-[14px] py-[12px] pr-[48px] text-base text-[#1B2430] outline-none focus:border-[#1E3A5F] focus:outline-[3px] focus:outline-[#F2B632]"
            >
              <option value="">Pilih kelurahan</option>
              {subdistricts.map((option) => (
                <option key={option.code} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
      ) : null}
    </section>
  );
}
