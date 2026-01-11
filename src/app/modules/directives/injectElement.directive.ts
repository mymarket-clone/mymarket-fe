import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  input,
} from '@angular/core'

@Directive({
  selector: '[inject]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class InjectElementDirective {
  public content = input.required<TemplateRef<unknown>>()
  public context = input<{ text?: string }>()
  public hoverable = input<boolean>(false)
  private embeddedViewRef?: EmbeddedViewRef<unknown>
  private tooltipEl?: HTMLElement
  private hovering: boolean = false
  private hasView: boolean = false
  private hideTimeout?: ReturnType<typeof setTimeout>

  public constructor(
    private readonly vcr: ViewContainerRef,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  public onMouseEnter(): void {
    this.hovering = true

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = undefined
      if (this.tooltipEl) {
        this.renderer.removeClass(this.tooltipEl, 'opacity-0')
        this.renderer.addClass(this.tooltipEl, 'opacity-100')
      }
    }

    if (!this.hasView && this.content) {
      this.vcr.clear()

      this.embeddedViewRef = this.vcr.createEmbeddedView(this.content(), this.context())

      this.embeddedViewRef.rootNodes.forEach((node) => {
        this.tooltipEl = node as HTMLElement

        if (!this.hoverable()) {
          this.renderer.setStyle(this.tooltipEl, 'pointer-events', 'none')
        }

        this.renderer.addClass(this.tooltipEl, 'opacity-0')
        this.renderer.addClass(this.tooltipEl, 'transition-opacity')
        this.renderer.addClass(this.tooltipEl, 'duration-300')

        this.renderer.appendChild(this.el.nativeElement, this.tooltipEl)

        setTimeout(() => {
          this.renderer.removeClass(this.tooltipEl!, 'opacity-0')
          this.renderer.addClass(this.tooltipEl!, 'opacity-100')
        }, 10)
      })

      this.hasView = true
    }
  }

  public onMouseLeave(): void {
    this.hovering = false

    if (this.hasView && this.tooltipEl) {
      this.renderer.removeClass(this.tooltipEl, 'opacity-100')
      this.renderer.addClass(this.tooltipEl, 'opacity-0')

      this.hideTimeout = setTimeout(() => {
        if (!this.hovering) {
          this.vcr.clear()
          this.hasView = false
          this.tooltipEl = undefined
        }
        this.hideTimeout = undefined
      }, 300)
    }
  }
}
