import { Component, OnInit, TemplateRef } from '@angular/core'
import { TooltipData, TooltipService } from '../../services/tooltip.service'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'app-tooltip',
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss'],
})
export class Tooltip implements OnInit {
  public tooltip: TooltipData = { content: '', x: 0, y: 0, visible: false }

  public constructor(private tooltipService: TooltipService) {}

  public ngOnInit(): void {
    this.tooltipService.tooltip$.subscribe((data) => {
      this.tooltip = data
    })
  }

  public get templateContent(): TemplateRef<unknown> | null {
    return this.tooltip.isTemplate ? (this.tooltip.content as TemplateRef<unknown>) : null
  }
}
