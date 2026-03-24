import { Directive, ElementRef, signal, viewChild } from '@angular/core'

@Directive()
export abstract class Swiper {
  protected readonly slideIndex = signal(0)
  protected readonly swiper = viewChild<ElementRef<HTMLElement>>('swiper')

  protected abstract get maxIndex(): number

  protected get minIndex(): number {
    return 0
  }

  protected canGoTo(index: number): boolean {
    return index >= this.minIndex && index <= this.maxIndex
  }

  protected canGoPrev(): boolean {
    return this.slideIndex() > this.minIndex
  }

  protected canGoNext(): boolean {
    return this.slideIndex() < this.maxIndex
  }

  protected prev($event?: PointerEvent): void {
    $event?.preventDefault()
    $event?.stopPropagation()
    if (!this.canGoPrev()) return
    this.goTo(this.slideIndex() - 1)
  }

  protected next($event?: PointerEvent): void {
    $event?.preventDefault()
    $event?.stopPropagation()
    if (!this.canGoNext()) return
    this.goTo(this.slideIndex() + 1)
  }

  protected goTo(index: number): void {
    if (!this.canGoTo(index)) return

    this.slideIndex.set(index)
    this.scrollToSlide(index)
  }

  protected isActiveSlide(index: number): boolean {
    return this.slideIndex() === index
  }

  protected isFirstSlide(): boolean {
    return this.slideIndex() === this.minIndex
  }

  protected isLastSlide(): boolean {
    return this.slideIndex() === this.maxIndex
  }

  protected getSlideSelector(index: number): string {
    return `[data-slide-index="${index}"]`
  }

  protected getSlideElement(index: number): HTMLElement | null {
    const container = this.swiper()?.nativeElement
    if (!container) return null

    return container.querySelector<HTMLElement>(this.getSlideSelector(index))
  }

  protected scrollToSlide(index: number): void {
    const slide = this.getSlideElement(index)
    if (!slide) return

    slide.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }
}
