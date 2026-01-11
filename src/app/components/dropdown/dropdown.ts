import { Component, ElementRef, Renderer2, signal, viewChild } from '@angular/core'
import { HighlightDirective } from '../../modules/directives/highlight'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [HighlightDirective, ReactiveFormsModule, SvgIconComponent],
})
export class Dropdown extends BaseInput {
  public selecting = signal<boolean>(false)
  private dropRootEl = viewChild<ElementRef<HTMLElement>>('dropRootEl')
  private dropMenuEl = viewChild<ElementRef<HTMLElement>>('dropMenuEl')

  public constructor(private readonly renderer: Renderer2) {
    super()
  }

  public ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const rootEl = this.dropRootEl()?.nativeElement
      const menuEl = this.dropMenuEl()?.nativeElement

      const target = event.target as Node

      if (rootEl?.contains(target) || menuEl?.contains(target)) return

      this.selecting.set(false)
    })
  }
}
