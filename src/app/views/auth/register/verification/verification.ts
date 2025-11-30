import { Component, effect, input, output } from '@angular/core'
import { RegisterStage } from '../../../../types/enums/RegisterStage'
import { Input } from '../../../../components/input/input'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { FormService } from '../../../../services/form.service'
import { RegisterForm } from '../../../../types/forms/RegisterForm'
import { Button } from '../../../../components/button/button'
import { SendEmailVerificationForm } from '../../../../types/forms/SendEmailVerificationForm'
import { AuthService } from '../../../../services/auth.service'
import { VerifyEmailCodeCredentials } from '../../../../interfaces/payload/VerifyEmailCodeCredentials'
import { UserStore } from '../../../../store/user.store'
import { Router } from '@angular/router'

@Component({
  selector: 'app-verification',
  imports: [Input, ReactiveFormsModule, Button],
  templateUrl: './verification.html',
  styleUrl: './verification.scss',
})
export class Verification {
  public fs = input.required<FormService<RegisterForm>>()
  public submitted = input.required<boolean>()
  public moveTo = output<RegisterStage>()

  public verifyEmailCode?: ReturnType<AuthService['verifyEmailCode']>

  public constructor(
    private readonly authservice: AuthService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    public readonly vfs: FormService<SendEmailVerificationForm>
  ) {
    effect(() => {
      this.vfs.setForm(
        new FormGroup({
          email: new FormControl(this.fs().getControl('email').value),
          code: new FormControl(''),
        })
      )
    })
  }

  public onSubmit(): void {
    this.vfs.setSubmitted()

    this.verifyEmailCode = this.authservice.verifyEmailCode({
      body: this.vfs.form.getRawValue() as VerifyEmailCodeCredentials,
      form: this.vfs.form,
      onSuccess: (response) => {
        this.userStore.logout()
        this.userStore.setUser(response)
        this.router.navigate(['/'])
      },
    })
  }
}
