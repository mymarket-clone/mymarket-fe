import { Component, input, output } from '@angular/core'
import { Input } from '../../../../components/input/input'
import { Button } from '../../../../components/button/button'
import { FormService } from '../../../../services/form.service'
import { RegisterForm } from '../../../../types/forms/RegisterForm'
import { ReactiveFormsModule } from '@angular/forms'
import { Segmented } from '../../../../components/segmented/segmented'
import { RegisterStage } from '../../../../types/enums/RegisterStage'
import { Checkbox } from '../../../../components/checkbox/checkbox'
import { AuthService } from '../../../../services/auth.service'
import { RegisterCredentials } from '../../../../interfaces/payload/RegisterCredentials'
import { ButtonChevron } from '../../../../components/button-chevron/button-chevron'

@Component({
  selector: 'app-register-extra',
  imports: [Input, Button, ReactiveFormsModule, Segmented, Checkbox, ButtonChevron],
  templateUrl: './extra.html',
  styleUrls: ['./extra.scss', '../../../../shared/styles/auth-modal.scss'],
})
export class Extra {
  public fs = input.required<FormService<RegisterForm>>()
  public submitted = input.required<boolean>()
  public moveTo = output<RegisterStage>()

  public registerState?: ReturnType<AuthService['registerUser']>

  public constructor(private readonly authService: AuthService) {}

  public handleChevron(): void {
    this.fs().form.reset()
    this.fs().resetSubmitted()
    this.moveTo.emit(RegisterStage.Main)
  }

  public onSubmit(): void {
    this.fs().setSubmitted()

    if (this.fs().form.valid) {
      this.registerState = this.authService.registerUser({
        body: this.fs().form.getRawValue() as RegisterCredentials,
        form: this.fs().form,
        onSuccess: () => {
          this.moveTo.emit(RegisterStage.Verification)
        },
      })
    }
  }
}
