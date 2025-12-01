import { Directive, HostListener, ElementRef, input, TemplateRef } from '@angular/core'
import { TooltipService } from '../services/tooltip.service'

export type Position = 'top' | 'bottom' | 'left' | 'right'

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  public tooltipText = input<string>()
  public tooltipComponent = input<TemplateRef<unknown>>()
  public position = input<Position>('top')

  public constructor(
    private el: ElementRef,
    private tooltipService: TooltipService
  ) {}

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    const yOffest = 10
    const rect = this.el.nativeElement.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const y = this.position() === 'top' ? rect.top : rect.bottom

    const template = this.tooltipComponent()
    const text = this.tooltipText()

    if (template) {
      this.tooltipService.showTemplate(template, centerX, y - yOffest, this.position())
    } else if (text) {
      this.tooltipService.showText(text, centerX, y - yOffest, this.position())
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.tooltipService.hide()
  }
}
