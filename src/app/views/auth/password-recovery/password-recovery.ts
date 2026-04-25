import { Component, signal } from '@angular/core'
import { SvgIconComponent } from 'angular-svg-icon'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { TranslocoDirective } from '@jsverse/transloco'
import { Input } from '@app/components/input/input'
import { Button } from '@app/components/button/button'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IPasswordEnterForm } from '@app/interfaces/forms/IPasswordEnterForm'
import { ISendEmailVerificationForm } from '@app/interfaces/forms/ISendEmailVerificationForm'
import { FormService } from '@app/services/form.service'
import { ApiService } from '@app/services/http/api.service'
import { HttpErrorCodes } from '@app/types/enums/HttpErrorCodes'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { HttpStatus } from '@app/types/enums/HttpStatus'
import { PasswordRecoveryStage } from '@app/types/PasswordRecoveryStage'
import { Zod } from '@app/utils/Zod'

@Component({
  selector: 'app-password-recovery',
  imports: [SvgIconComponent, Input, Button, RouterLink, ReactiveFormsModule, TranslocoDirective],
  providers: [
    { provide: 'sendPasswordRecoveryForm', useClass: FormService },
    { provide: 'passwordEnter', useClass: FormService },
  ],
  templateUrl: './password-recovery.html',
})
export class PasswordRecovery {
  public passwordRecoveryStage = signal<PasswordRecoveryStage>('Verification')

  public sendPasswordRecoveryState?: IHttpService<void>
  public verifyPasswordCodeState?: IHttpService<void>
  public passwordRecoveryState?: IHttpService<void>

  public sendPasswordRecoveryFs = new FormService<ISendEmailVerificationForm>()
  public passwordEnterFs = new FormService<IPasswordEnterForm>()

  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)
  public codeSendLoading = signal<boolean>(false)

  public constructor(
    private readonly authService: ApiService,
    private readonly router: Router,
    private readonly zod: Zod
  ) {
    this.sendPasswordRecoveryFs.setForm(
      new FormGroup({
        email: new FormControl('', [this.zod.required(), this.zod.email()]),
        code: new FormControl('', this.zod.required()),
      })
    )

    this.passwordEnterFs.setForm(
      new FormGroup(
        {
          code: new FormControl('', this.zod.required()),
          password: new FormControl('', [this.zod.required(), this.zod.password()]),
          passwordConfirm: new FormControl('', this.zod.required()),
        },
        {
          validators: this.zod.match('password', 'passwordConfirm'),
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

    this.sendPasswordRecoveryState = this.authService.request({
      method: HttpMethod.POST,
      endpoint: 'auth/send-password-recovery',
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
    this.sendPasswordRecoveryFs.submit({
      onSuccess: () => {
        this.verifyPasswordCodeState = this.authService.request({
          method: HttpMethod.POST,
          endpoint: 'auth/verify-password-code',
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
      },
    })
  }

  public changePassword(): void {
    this.passwordEnterFs.submit({
      onSuccess: () => {
        this.passwordRecoveryState = this.authService.request({
          method: HttpMethod.POST,
          endpoint: 'auth/password-recovery',
          body: this.passwordEnterFs.getValues(),
          form: this.passwordEnterFs.form,
          onSuccess: () => this.router.navigate(['/user/login']),
          onError: (err) => console.error(err),
        })
      },
    })
  }
}
