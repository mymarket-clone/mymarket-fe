import { Injectable, TemplateRef } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { TooltipData } from '../types/TooltipData'

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private tooltipSubject = new BehaviorSubject<TooltipData<string | TemplateRef<unknown>>>({
    content: '',
    x: 0,
    y: 0,
    visible: false,
    isTemplate: false,
  })

  public tooltip$ = this.tooltipSubject.asObservable()

  public showText({ content, x, y, position }: TooltipData<string>): void {
    this.tooltipSubject.next({
      content,
      x,
      y,
      visible: true,
      isTemplate: false,
      position,
    })
  }

  public showTemplate({ content, x, y, position }: TooltipData<TemplateRef<unknown>>): void {
    this.tooltipSubject.next({
      content,
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
