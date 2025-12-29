import { Component, effect, input, signal } from '@angular/core'
import z from 'zod'

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.html',
})
export class PasswordStrength {
  public password = input.required<string | null>()
  public passwordStrength = signal<number>(0)

  public constructor() {
    effect(() => {
      const pwd = this.password() ?? ''
      const strength = [
        z.string().min(9),
        z.string().regex(/\d/),
        z.string().regex(/[a-z]/),
        z.string().regex(/[A-Z]/),
        z.string().regex(/[\W_]/),
      ].filter((r) => r.safeParse(pwd).success).length
      this.passwordStrength.set(strength)
    })
  }

  public getBarColor(index: number): string {
    const strength = this.passwordStrength()
    const colors = ['#f70000', '#fcc000', '#3c74ff', '#1aba6b']
    const barsToShow = Math.min(4, strength)

    return index < barsToShow ? colors[Math.min(barsToShow - 1, colors.length - 1)] : '#d4d4d7'
  }

  public getStrengthLabel(): string {
    const strength = this.passwordStrength()
    if (strength <= 1) return 'Weak'
    if (strength === 2) return 'Average'
    if (strength === 3) return 'Good'
    return 'Strong'
  }

  public getStrengthColor(): string {
    const strength = this.passwordStrength()
    if (strength <= 1) return '#f70000'
    if (strength === 2) return '#fcc000'
    if (strength === 3) return '#3c74ff'
    return '#1aba6b'
  }
}
