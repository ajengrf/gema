export const temporaryDistricts = [
  {
    name: "Kedaton",
    subdistricts: [
      { name: "Penengahan", code: "DUMMY-KED-001" },
      { name: "Kedaton", code: "DUMMY-KED-002" },
      { name: "Sidodadi", code: "DUMMY-KED-003" },
    ],
  },
  {
    name: "Rajabasa",
    subdistricts: [
      { name: "Rajabasa", code: "DUMMY-RAJ-001" },
      { name: "Rajabasa Raya", code: "DUMMY-RAJ-002" },
      { name: "Gedong Meneng", code: "DUMMY-RAJ-003" },
    ],
  },
  {
    name: "Sukarame",
    subdistricts: [
      { name: "Sukarame", code: "DUMMY-SUK-001" },
      { name: "Way Dadi", code: "DUMMY-SUK-002" },
      { name: "Korpri Jaya", code: "DUMMY-SUK-003" },
    ],
  },
] as const;

export function getTemporarySubdistricts(district: string) {
  return (
    temporaryDistricts.find((option) => option.name === district)
      ?.subdistricts ?? []
  );
}

export function getTemporaryLocation(
  district: string,
  subdistrict: string,
): { code: string; district: string; subdistrict: string } | null {
  const districtOption = temporaryDistricts.find(
    (option) => option.name === district,
  );
  const subdistrictOption = districtOption?.subdistricts.find(
    (option) => option.name === subdistrict,
  );

  if (!districtOption || !subdistrictOption) return null;

  return {
    code: subdistrictOption.code,
    district: districtOption.name,
    subdistrict: subdistrictOption.name,
  };
}
