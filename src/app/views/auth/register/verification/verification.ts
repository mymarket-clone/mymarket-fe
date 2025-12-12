import { Component, effect, input, output, signal } from '@angular/core'
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
import { ActivatedRoute, Router } from '@angular/router'
import { ButtonChevron } from '../../../../components/button-chevron/button-chevron'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-verification',
  imports: [Input, ReactiveFormsModule, Button, ButtonChevron, SvgIconComponent],
  templateUrl: './verification.html',
  styleUrls: ['./verification.scss', '../../../../shared/styles/auth-modal.scss'],
})
export class Verification {
  public fs = input.required<FormService<RegisterForm>>()
  public submitted = input.required<boolean>()
  public moveTo = output<RegisterStage>()

  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)

  public constructor(
    private readonly authService: AuthService,
    private readonly userStore: UserStore,
    private readonly router: Router,
    private readonly actR: ActivatedRoute,
    public readonly vfs: FormService<SendEmailVerificationForm>
  ) {
    effect(() => {
      this.vfs.setForm(
        new FormGroup({
          email: new FormControl(
            this.fs().getControl('email').value || this.actR.snapshot.queryParamMap.get('email')
          ),
          code: new FormControl(''),
        })
      )
    })
  }

  public verifyEmailCode?: ReturnType<AuthService['verifyEmailCode']>
  public sendEmailVerificationCodeState?: ReturnType<AuthService['sendEmailVerificationCode']>

  public handleChevron(): void {
    this.router.navigate(['/user/login'])
  }

  public onSubmit(): void {
    this.vfs.setSubmitted()

    this.verifyEmailCode = this.authService.verifyEmailCode({
      body: this.vfs.form.getRawValue() as VerifyEmailCodeCredentials,
      form: this.vfs.form,
      onSuccess: (response) => {
        this.userStore.logout()
        this.userStore.setUser(response)
        this.router.navigate(['/'])
      },
    })
  }

  public sendCode(): void {
    const emailControl = this.vfs.getControl('email')

    emailControl.markAsDirty()
    emailControl.updateValueAndValidity()

    if (emailControl.invalid) return

    this.sendEmailVerificationCodeState = this.authService.sendEmailVerificationCode({
      body: { email: emailControl.value as string },
      onSuccess: () => {
        this.codeSent.set(true)
        this.sendCodeActive.set(true)

        setTimeout(() => this.sendCodeActive.set(false), 30000)
      },
      onError: (err) => console.error(err),
    })
  }
}
