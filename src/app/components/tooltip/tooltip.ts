import { Component, OnInit, TemplateRef } from '@angular/core'
import { TooltipService } from '../../services/tooltip.service'
import { NgTemplateOutlet } from '@angular/common'
import { TooltipData } from '../../types/TooltipData'
import { Position } from '../../types/Position'

@Component({
  selector: 'app-tooltip',
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss'],
})
export class Tooltip implements OnInit {
  public tooltip: TooltipData<string | TemplateRef<unknown>> = {
    content: '',
    x: 0,
    y: 0,
    visible: false,
  }

  public constructor(private tooltipService: TooltipService) {}

  public ngOnInit(): void {
    this.tooltipService.tooltip$.subscribe((data) => {
      this.tooltip = data
    })
  }

  public get templateContent(): TemplateRef<unknown> | null {
    return this.tooltip.isTemplate ? (this.tooltip.content as TemplateRef<unknown>) : null
  }

  public getTransform(position: Position | undefined): string {
    switch (position) {
      case 'top':
        return 'translate(-50%, -100%)'
      case 'topLeft':
        return 'translate(-100%, -100%)'
      case 'topRight':
        return 'translate(0, -100%)'

      case 'bottom':
        return 'translate(-50%, 0)'
      case 'bottomLeft':
        return 'translate(-100%, 0)'
      case 'bottomRight':
        return 'translate(0, 0)'

      case 'left':
        return 'translate(-100%, -50%)'
      case 'right':
        return 'translate(0, -50%)'

      default:
        return 'translate(-50%, 0)'
    }
  }
}
