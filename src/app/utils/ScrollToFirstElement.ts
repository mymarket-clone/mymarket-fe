export function scrollToFirstElement(className: string): void {
  const elements = document.querySelectorAll(className)
  if (elements.length > 0) {
    elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
