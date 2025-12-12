import { Component, signal } from '@angular/core'
import { ButtonChevron } from '../../../components/button-chevron/button-chevron'
import { Router } from '@angular/router'
import { Input } from '../../../components/input/input'
import { FormService } from '../../../services/form.service'
import { SendEmailVerificationForm } from '../../../types/forms/SendEmailVerificationForm'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from '../../../components/button/button'
import { AuthService } from '../../../services/auth.service'
import { SendPasswordRecoveryCredentials } from '../../../interfaces/payload/SendPasswordRecoveryCredentials'
import { PasswordRecoveryStage } from '../../../types/enums/PasswordRecoveryStage'
import { PasswordEnterForm } from '../../../types/forms/PasswordEnterForm'
import { passwordValidator } from '../../../utils/validators/passwordValidator'
import { passwordMatchValidator } from '../../../utils/validators/passwordMatchValidator'
import { PasswordRecoveryCredentials } from '../../../interfaces/payload/PasswordRecoveryCredentials'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-recover-password',
  imports: [ButtonChevron, Input, ReactiveFormsModule, Button, SvgIconComponent],
  providers: [
    { provide: 'prfService', useClass: FormService },
    { provide: 'pefService', useClass: FormService },
  ],
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.scss', '../../../shared/styles/auth-modal.scss'],
})
export class RecoverPassword {
  public PasswordResetStage = PasswordRecoveryStage
  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)
  public passwordRecoveryStage = signal<PasswordRecoveryStage>(PasswordRecoveryStage.VerifyEmail)

  public prf = new FormService<SendEmailVerificationForm>()
  public pef = new FormService<PasswordEnterForm>()

  public constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.prf.setForm(
      new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        code: new FormControl('', Validators.required),
      })
    )

    this.pef.setForm(
      new FormGroup(
        {
          code: new FormControl('', Validators.required),
          password: new FormControl('', [Validators.required, passwordValidator]),
          passwordConfirm: new FormControl('', Validators.required),
        },
        { validators: passwordMatchValidator }
      )
    )
  }

  public verifyEmailCode?: ReturnType<AuthService['sendPasswordRecovery']>
  public sendPasswordRecoveryState?: ReturnType<AuthService['sendPasswordRecovery']>
  public passwordRecoveryState?: ReturnType<AuthService['passwordRecovery']>

  public onSubmit(): void {
    this.prf.setSubmitted()

    if (this.prf.form.valid) {
      this.verifyEmailCode = this.authService.sendPasswordRecovery({
        body: this.prf.form.getRawValue() as SendPasswordRecoveryCredentials,
        form: this.prf.form,
        onSuccess: () => {
          this.pef.getControl('code').setValue(this.prf.getControl('code').value)
          this.passwordRecoveryStage.set(PasswordRecoveryStage.EnterPassword)
        },
      })
    }
  }

  public handleChevron(): void {
    if (this.passwordRecoveryStage() === PasswordRecoveryStage.EnterPassword) {
      this.passwordRecoveryStage.set(PasswordRecoveryStage.VerifyEmail)
    } else this.router.navigate(['/user/login'])
  }

  public sendCode(): void {
    const emailControl = this.prf.getControl('email')

    emailControl.markAsDirty()
    emailControl.updateValueAndValidity()

    if (emailControl.invalid) return

    this.sendPasswordRecoveryState = this.authService.sendPasswordRecovery({
      body: { email: emailControl.value as string },
      onSuccess: () => {
        this.codeSent.set(true)
        this.sendCodeActive.set(true)

        setTimeout(() => this.sendCodeActive.set(false), 30000)
      },
      onError: (err) => console.error(err),
    })
  }

  public changePassword(): void {
    this.passwordRecoveryState = this.authService.passwordRecovery({
      body: this.pef.form.getRawValue() as PasswordRecoveryCredentials,
      form: this.pef.form,
      onSuccess: () => {
        console.log('password Changed')
      },
    })
  }
}
