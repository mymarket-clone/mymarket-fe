import { Directive, HostListener, ElementRef, input, TemplateRef } from '@angular/core'
import { TooltipService } from '../services/tooltip.service'
import { Position } from '../types/Position'

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

  private computeAnchor(rect: DOMRect, pos: Position): { x: number; y: number } {
    const offset = 10

    switch (pos) {
      case 'top':
        return { x: rect.left + rect.width / 2, y: rect.top - offset }
      case 'topLeft':
        return { x: rect.right, y: rect.top - offset }
      case 'topRight':
        return { x: rect.left, y: rect.top - offset }

      case 'bottom':
        return { x: rect.left + rect.width / 2, y: rect.bottom + offset }
      case 'bottomLeft':
        return { x: rect.right, y: rect.bottom + offset }
      case 'bottomRight':
        return { x: rect.left, y: rect.bottom + offset }

      case 'left':
        return { x: rect.left - offset, y: rect.top + rect.height / 2 }
      case 'right':
        return { x: rect.right + offset, y: rect.top + rect.height / 2 }

      default:
        return { x: rect.left + rect.width / 2, y: rect.bottom + offset }
    }
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const pos = this.position()
    const anchor = this.computeAnchor(rect, pos)

    const template = this.tooltipComponent()
    const text = this.tooltipText()

    if (template) {
      this.tooltipService.showTemplate({
        content: template,
        x: anchor.x,
        y: anchor.y,
        position: pos,
        visible: true,
      })
    } else if (text) {
      this.tooltipService.showText({
        content: text,
        x: anchor.x,
        y: anchor.y,
        position: pos,
        visible: true,
      })
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.tooltipService.hide()
  }
}
