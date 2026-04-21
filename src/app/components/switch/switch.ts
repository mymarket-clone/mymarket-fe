import { Component, OnInit, signal } from '@angular/core'
import { BaseInput } from '@app/shared/components/base-input'

@Component({
  selector: 'switch',
  templateUrl: 'switch.html',
})
export class Switch extends BaseInput implements OnInit {
  public toggled = signal<boolean>(false)

  public ngOnInit(): void {
    const raw = this.control().value
    this.toggled.set(this.toBoolean(raw))

    this.control().valueChanges.subscribe((value: unknown) => {
      this.toggled.set(this.toBoolean(value))
    })
  }

  private toBoolean(value: unknown): boolean {
    return value === true || value === 'true'
  }

  private override toString(value: boolean): string {
    return value ? 'true' : 'false'
  }

  public toggle(): void {
    const raw = this.control().value

    const current = this.toBoolean(raw)
    const next = !current

    this.control().setValue(this.toString(next))
    this.toggled.set(next)
  }
}
