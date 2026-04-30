import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  input,
  output,
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

  public trigger = input<'hover' | 'click'>('hover')
  public closeOnOutsideClick = input<boolean>(true)
  public stateChange = output<boolean>()

  private embeddedViewRef?: EmbeddedViewRef<unknown>
  private tooltipEl?: HTMLElement
  private hovering = false
  private hasView = false
  private hideTimeout?: ReturnType<typeof setTimeout>

  public constructor(
    private readonly vcr: ViewContainerRef,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  public onMouseEnter(): void {
    if (this.trigger() !== 'hover') return
    this.hovering = true
    this.show()
  }

  public onMouseLeave(): void {
    if (this.trigger() !== 'hover') return
    this.hovering = false
    this.hide()
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    if (this.trigger() !== 'click') return

    event.stopPropagation()

    if (this.hasView) {
      this.hide(true)
    } else {
      this.show()
    }
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    if (this.trigger() !== 'click' || !this.closeOnOutsideClick()) return

    if (this.hasView) {
      this.hide(true)
    }
  }

  private show(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = undefined
    }

    if (!this.hasView) {
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
      this.stateChange.emit(true)
    } else if (this.tooltipEl) {
      this.renderer.removeClass(this.tooltipEl, 'opacity-0')
      this.renderer.addClass(this.tooltipEl, 'opacity-100')
    }
  }

  private hide(force = false): void {
    if (!this.tooltipEl) return

    this.renderer.removeClass(this.tooltipEl, 'opacity-100')
    this.renderer.addClass(this.tooltipEl, 'opacity-0')

    this.hideTimeout = setTimeout(() => {
      if (force || !this.hovering) {
        this.vcr.clear()
        this.hasView = false
        this.tooltipEl = undefined

        this.stateChange.emit(false)
      }
      this.hideTimeout = undefined
    }, 300)
  }
}
