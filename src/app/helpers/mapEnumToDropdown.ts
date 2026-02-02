import { DropdownEl } from '../types/DropdownEl'

export function mapEnumToDropdown<T extends Record<string, string | number>>(
  enumObj: T,
  useKeysAsValue = false
): DropdownEl[] {
  return (Object.keys(enumObj) as Array<keyof T>)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: useKeysAsValue ? String(key) : (enumObj[key] as string | number),
      name: String(key),
    }))
}
