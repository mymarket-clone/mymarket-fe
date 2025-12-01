import { Component, input, output } from '@angular/core'
import { Input } from '../../../../components/input/input'
import { ReactiveFormsModule } from '@angular/forms'
import { RegisterForm } from '../../../../types/forms/RegisterForm'
import { FormService } from '../../../../services/form.service'
import { Button } from '../../../../components/button/button'
import { RegisterStage } from '../../../../types/enums/RegisterStage'
import { RouterLink } from '@angular/router'
import { TooltipDirective } from '../../../../directives/appTooltip'

@Component({
  selector: 'app-register-main',
  imports: [Input, ReactiveFormsModule, Button, RouterLink, TooltipDirective],
  templateUrl: './register-main.html',
  styleUrl: './register-main.scss',
})
export class RegisterMain {
  public fs = input.required<FormService<RegisterForm>>()
  public submitted = input.required<boolean>()
  public moveTo = output<RegisterStage>()

  public onSubmit(): void {
    const controlsToSubmit = ['name', 'lastname', 'email', 'password', 'passwordConfirm']

    controlsToSubmit.forEach((controlName) => {
      const control = this.fs().getControl(controlName as keyof RegisterForm)
      control.markAsTouched()
    })

    const allValid = controlsToSubmit.every(
      (controlName) => this.fs().getControl(controlName as keyof RegisterForm).valid
    )

    if (allValid) this.moveTo.emit(RegisterStage.Extra)
  }
}
