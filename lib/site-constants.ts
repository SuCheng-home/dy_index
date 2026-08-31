export const SCHOOL_ADDRESS = "江苏省镇江市丹阳市曲阿街道（练湖度假区，北三环以南、新区大道以东）"

const LEGACY_SCHOOL_ADDRESSES = [
  "江苏省镇江市丹阳市新民西路138号",
  "江苏省丹阳市新民西路138号",
]

export function normalizeSchoolAddress(value: string | null | undefined) {
  let address = String(value ?? "").replace(/\s+/g, " ").trim()

  for (const legacyAddress of LEGACY_SCHOOL_ADDRESSES) {
    address = address.split(legacyAddress).join(SCHOOL_ADDRESS)
  }

  return address || SCHOOL_ADDRESS
}
