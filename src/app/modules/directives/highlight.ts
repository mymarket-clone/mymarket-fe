import { Directive, ElementRef, HostListener, input, Renderer2, signal } from '@angular/core'

@Directive({
  selector: '[highLight]',
})
export class HighlightDirective {
  public hClass = input.required<string>()
  public isActive = signal<boolean>(false)

  public constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    event.stopPropagation()

    this.isActive.set(true)
    this.renderer.addClass(this.el.nativeElement, this.hClass())
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    if (!this.isActive) return

    this.isActive.set(false)
    this.renderer.removeClass(this.el.nativeElement, this.hClass())
  }
}
