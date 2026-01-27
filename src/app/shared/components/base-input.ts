import { Component, ElementRef, HostListener, input, signal, viewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { InputType } from '../../types/Input'

@Component({
  selector: 'app-base-input',
  template: '',
})
export class BaseInput<T = unknown> {
  public label = input<string>()
  public control = input.required<FormControl<T>>()
  public required = input<boolean>(false)
  public submitted = input.required<boolean>()
  public disabled = input<boolean>(false)
  public type = input<InputType>('text')
  public placeholder = input<string | undefined>(undefined)
  public variant = input<'dynamic' | 'static'>()

  private parent = viewChild<ElementRef<HTMLElement>>('parent')

  public isFocused = signal<boolean>(false)
  public isHovered = signal<boolean>(false)

  @HostListener('focusin')
  public onFocusIn(): void {
    this.isFocused.set(true)
  }

  @HostListener('focusout')
  public onFocusOut(): void {
    this.isFocused.set(false)
  }

  @HostListener('pointerover', ['$event'])
  public onPointerOver(event: PointerEvent): void {
    const target = event.target as HTMLElement
    if (this.parent()?.nativeElement.contains(target)) {
      this.isHovered.set(true)
    }
  }

  @HostListener('pointerout', ['$event'])
  public onPointerOut(event: PointerEvent): void {
    const related = event.relatedTarget as HTMLElement | null

    if (!related || !this.parent()?.nativeElement.contains(related)) {
      this.isHovered.set(false)
    }
  }

  public hasError(): boolean {
    const control = this.control()
    if (!control) return false
    if (control.errors?.['set']) return true

    return !!control.errors && this.submitted()
  }

  public getError(): string | null {
    const ctrl = this.control()
    if (!ctrl || !ctrl.errors) return null
    const firstKey = Object.keys(ctrl.errors)[0]
    return firstKey ? (ctrl.errors[firstKey] as string) : null
  }
}
