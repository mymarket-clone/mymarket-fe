import { Component, input, output } from '@angular/core'
import { Input } from '../../../../components/input/input'
import { ReactiveFormsModule } from '@angular/forms'
import { RegisterForm } from '../../../../types/forms/RegisterForm'
import { FormService } from '../../../../services/form-service/form.service'
import { Button } from '../../../../components/button/button'
import { RegisterStage } from '../../../../types/enums/RegisterStage'
import { RouterLink } from '@angular/router'
import { TooltipDirective } from '../../../../directives/appTooltip'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-register-main',
  imports: [Input, ReactiveFormsModule, Button, RouterLink, TooltipDirective, SvgIconComponent],
  templateUrl: './register-main.html',
  styleUrls: ['./register-main.scss', '../../../../shared/styles/auth-modal.scss'],
})
export class RegisterMain {
  public fs = input.required<FormService<RegisterForm>>()
  public moveTo = output<RegisterStage>()

  public onSubmit(): void {
    const controlsToSubmit = ['name', 'lastname', 'email', 'password', 'passwordConfirm']

    controlsToSubmit.forEach((controlName) => {
      const control = this.fs().getControl(controlName as keyof RegisterForm)
      control.markAllAsDirty()
    })

    const allValid = controlsToSubmit.every(
      (controlName) => this.fs().getControl(controlName as keyof RegisterForm).valid
    )

    if (allValid) this.moveTo.emit(RegisterStage.Extra)
  }
}
