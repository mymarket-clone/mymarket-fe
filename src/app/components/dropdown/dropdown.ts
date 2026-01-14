import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'
import { ApiService } from '../../services/http/api.service'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [ReactiveFormsModule, SvgIconComponent],
})
export class Dropdown extends BaseInput implements AfterViewInit {
  public selecting = signal<boolean>(false)
  public dataEndpoint = input.required<keyof ApiService>()
  public options = signal<unknown | null>(null)
  public currentOptions = signal<unknown | null>(null)

  private dropRootEl = viewChild<ElementRef<HTMLElement>>('dropRootEl')
  private dropMenuEl = viewChild<ElementRef<HTMLElement>>('dropMenuEl')

  public constructor(
    private readonly apiService: ApiService,
    private readonly renderer: Renderer2
  ) {
    super()
    this.controlOptionsSet()
    this.controlCurrentOptionsSet()
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

  public controlOptionsSet(): void {
    let loaded = false

    effect(() => {
      if (!this.selecting()) return
      if (loaded) return

      const state = this.apiService[this.dataEndpoint()]()
      this.options.set(state.data())

      loaded = true
    })
  }

  public controlCurrentOptionsSet(): void {
    effect(() => {})
  }
}
