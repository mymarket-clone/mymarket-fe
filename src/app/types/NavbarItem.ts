export type NavbarItem = {
  label: string
  key: string
  iconPath: string | null
  queryParams?: Record<string, string | boolean | number>
}
