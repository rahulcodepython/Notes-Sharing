export { cn } from "cn"

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso))
}
