import { Injectable, TemplateRef } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Position } from '../directives/appTooltip'

export interface TooltipData {
  content: string | TemplateRef<unknown>
  x: number
  y: number
  visible: boolean
  isTemplate?: boolean
  position?: Position
}

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private tooltipSubject = new BehaviorSubject<TooltipData>({
    content: '',
    x: 0,
    y: 0,
    visible: false,
    isTemplate: false,
  })

  public tooltip$ = this.tooltipSubject.asObservable()

  public showText(text: string, x: number, y: number, position: Position): void {
    this.tooltipSubject.next({
      content: text,
      x,
      y,
      visible: true,
      isTemplate: false,
      position,
    })
  }

  public showTemplate(
    template: TemplateRef<unknown>,
    x: number,
    y: number,
    position: Position
  ): void {
    this.tooltipSubject.next({
      content: template,
      x,
      y,
      visible: true,
      isTemplate: true,
      position,
    })
  }

  public hide(): void {
    const current = this.tooltipSubject.value
    this.tooltipSubject.next({ ...current, visible: false })
  }
}
