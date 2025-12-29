import { Component, signal } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Input } from '../../../components/input/input'
import { AuthService } from '../../../services/auth.service'
import { Button } from '../../../components/button/button'
import { Router, RouterLink } from '@angular/router'
import { FormService } from '../../../services/form.service'
import { PasswordRecoveryStage } from '../../../types/PasswordRecoveryStage'
import { ISendEmailVerificationForm } from '../../../interfaces/forms/ISendEmailVerificationForm'
import { IPasswordEnterForm } from '../../../interfaces/forms/IPasswordEnterForm'
import { Zod } from '../../../utils/Zod'
import { HttpStatus } from '../../../types/enums/HttpStatus'
import { HttpErrorCodes } from '../../../types/enums/HttpErrorCodes'

@Component({
  selector: 'app-password-recovery',
  imports: [SvgIconComponent, Input, Button, RouterLink, ReactiveFormsModule],
  providers: [
    { provide: 'sendPasswordRecoveryForm', useClass: FormService },
    { provide: 'passwordEnter', useClass: FormService },
  ],
  templateUrl: './password-recovery.html',
})
export class PasswordRecovery {
  public passwordRecoveryStage = signal<PasswordRecoveryStage>('Verification')

  public sendPasswordRecoveryState?: ReturnType<AuthService['sendPasswordRecovery']>
  public verifyPasswordCodeState?: ReturnType<AuthService['verifyPasswordCode']>
  public passwordRecoveryState?: ReturnType<AuthService['passwordRecovery']>

  public sendPasswordRecoveryFs = new FormService<ISendEmailVerificationForm>()
  public passwordEnterFs = new FormService<IPasswordEnterForm>()

  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)
  public codeSendLoading = signal<boolean>(false)

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.sendPasswordRecoveryFs.setForm(
      new FormGroup({
        email: new FormControl('', [Zod.required(), Zod.email()]),
        code: new FormControl('', Zod.required()),
      })
    )

    this.passwordEnterFs.setForm(
      new FormGroup(
        {
          code: new FormControl('', Zod.required()),
          password: new FormControl('', [Zod.required(), Zod.password()]),
          passwordConfirm: new FormControl('', Zod.required()),
        },
        {
          validators: Zod.match('password', 'passwordConfirm'),
        }
      )
    )
  }

  public sendCode(): void {
    const emailControl = this.sendPasswordRecoveryFs.getControl('email')

    if (emailControl.invalid) {
      this.sendPasswordRecoveryFs.setError('email', 'Please enter valid email address')
      return
    }

    this.sendCodeActive.set(true)
    this.codeSendLoading.set(true)

    this.sendPasswordRecoveryState = this.authService.sendPasswordRecovery({
      body: { email: emailControl.value as string },
      onSuccess: () => {
        this.codeSendLoading.set(false)
        this.codeSent.set(true)
        setTimeout(() => this.sendCodeActive.set(false), 30000)
      },
      onError: (err, record) => {
        console.error(err)
        this.sendCodeActive.set(false)
        this.codeSendLoading.set(false)

        if (
          record &&
          record.status == HttpStatus.Unauthorized &&
          record.code == HttpErrorCodes.EmailNotVerified
        ) {
          this.router.navigate(['/user/register'], {
            queryParams: { email: record.email },
          })
        }
      },
    })
  }

  public verifyCode(): void {
    this.sendPasswordRecoveryFs.submit(() => {
      this.verifyPasswordCodeState = this.authService.verifyPasswordCode({
        body: this.sendPasswordRecoveryFs.getValues(),
        form: this.sendPasswordRecoveryFs.form,
        onSuccess: () => {
          this.passwordEnterFs
            .getControl('code')
            .setValue(this.sendPasswordRecoveryFs.getControl('code').value)
          this.passwordRecoveryStage.set('Password')
        },
        onError: (err) => console.error(err),
      })
    })
  }

  public changePassword(): void {
    this.passwordEnterFs.submit(() => {
      this.passwordRecoveryState = this.authService.passwordRecovery({
        body: this.passwordEnterFs.getValues(),
        form: this.passwordEnterFs.form,
        onSuccess: () => this.router.navigate(['/user/login']),
        onError: (err) => console.error(err),
      })
    })
  }
}
