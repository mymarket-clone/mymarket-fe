import { Component, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { RouterLink, ActivatedRoute, Router } from '@angular/router'
import { Button } from '@app/components/button/button'
import { Checkbox } from '@app/components/checkbox/checkbox'
import { Input } from '@app/components/input/input'
import { PasswordStrength } from '@app/components/password-strength/password-strength'
import { Segmented } from '@app/components/segmented/segmented'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import {
  IRegisterFormMain,
  IRegisterFormExtra,
  IRegisterFormVerification,
} from '@app/interfaces/forms/IRegisterForm'
import { InjectElementDirective } from '@app/modules/directives/injectElement.directive'
import { FormService } from '@app/services/form.service'
import { ApiService } from '@app/services/http/api.service'
import { UserStore } from '@app/stores/user.store'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { RegistrationStage } from '@app/types/RegistrationStage'
import { User } from '@app/types/User'
import { userExistsValidator } from '@app/utils/AsyncValidators'
import { Zod } from '@app/utils/Zod'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'app-register',
  imports: [
    SvgIconComponent,
    InjectElementDirective,
    Input,
    ReactiveFormsModule,
    Button,
    RouterLink,
    Segmented,
    Checkbox,
    PasswordStrength,
    TranslocoDirective,
  ],
  providers: [
    { provide: 'registerFormMain', useClass: FormService },
    { provide: 'registerFormExtra', useClass: FormService },
    { provide: 'registerFormVerification', useClass: FormService },
  ],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  public registrationStage = signal<RegistrationStage>('Main')

  public registerState?: IHttpService<void>
  public sendEmailVerificationCodeState?: IHttpService<void>
  public verifyEmailCodeState?: IHttpService<User>

  public registerFormMain = new FormService<IRegisterFormMain>()
  public registerFormExtra = new FormService<IRegisterFormExtra>()
  public registerFormVerification = new FormService<IRegisterFormVerification>()

  public sendCodeActive = signal<boolean>(false)
  public codeSent = signal<boolean>(false)
  public codeSendLoading = signal<boolean>(false)

  public showPasswordStrength = signal(false)
  public passwordNotEmpty = signal(false)
  public passwordVisible = signal(false)

  public constructor(
    private readonly ts: TranslocoService,
    private readonly authService: ApiService,
    private readonly actR: ActivatedRoute,
    private readonly router: Router,
    private readonly userStore: UserStore,
    private readonly zod: Zod
  ) {
    this.registerFormMain.setForm(
      new FormGroup({
        firstname: new FormControl('', [
          this.zod.required(),
          this.zod.onlyLetters(
            this.ts.translate('validators.onlyLetters', {
              field: 'სახელი',
            })
          ),
        ]),
        lastname: new FormControl('', [
          this.zod.required(),
          this.zod.onlyLetters(
            this.ts.translate('validators.onlyLetters', {
              field: 'გვარი',
            })
          ),
        ]),
        email: new FormControl('', {
          validators: [this.zod.required(), this.zod.email()],
          asyncValidators: userExistsValidator(this.ts),
          updateOn: 'blur',
        }),
        password: new FormControl('', [this.zod.required(), this.zod.password()]),
        passwordConfirm: new FormControl('', this.zod.required()),
      })
    )

    this.registerFormExtra.setForm(
      new FormGroup({
        gender: new FormControl(1, this.zod.required()),
        birthYear: new FormControl(
          new Date().getFullYear() - 16,
          this.zod.between(1900, new Date().getFullYear())
        ),
        phoneNumber: new FormControl('', this.zod.required()),
        termsAndConditions: new FormControl(false, {
          nonNullable: true,
          validators: this.zod.true(),
        }),
        privacyPolicy: new FormControl(false, {
          nonNullable: true,
          validators: this.zod.true(),
        }),
      })
    )

    this.registerFormVerification.setForm(
      new FormGroup({
        email: new FormControl(this.actR.snapshot.queryParamMap.get('email') || '', [
          this.zod.required(),
          this.zod.email(),
        ]),
        code: new FormControl('', [this.zod.length(4)]),
      })
    )
  }

  public ngOnInit(): void {
    if (this.actR.snapshot.queryParamMap.get('email')) {
      this.registrationStage.set('Verification')
    }

    this.onPasswordChange()
  }

  public validateMain(): void {
    this.registerFormMain.submit({
      onSuccess: () => {
        this.proceedToStage('Extra')
      },
    })
  }

  public registerUser(): void {
    this.registerFormExtra.submit({
      onSuccess: () => {
        this.registerState = this.authService.request({
          method: HttpMethod.POST,
          endpoint: 'register-user',
          body: {
            ...this.registerFormMain.getValues(),
            ...this.registerFormExtra.getValues(),
          },
          form: new FormGroup({
            ...this.registerFormMain.form.controls,
            ...this.registerFormExtra.form.controls,
          }),
          onSuccess: () => {
            this.registerFormVerification
              .getControl('email')
              .setValue(this.registerFormMain.getControl('email').value)
            this.registrationStage.set('Verification')
          },
          onError: (err) => {
            console.error(err)
          },
        })
      },
    })
  }

  public verifyEmail(): void {
    this.verifyEmailCodeState = this.authService.request({
      method: HttpMethod.POST,
      endpoint: 'verify-email-code',
      body: this.registerFormVerification.getValues(),
      form: this.registerFormVerification.form,
      onSuccess: (response) => {
        this.userStore.logout()
        this.userStore.setUser(response)
        this.router.navigate(['/'])
      },
    })
  }

  public sendCode(): void {
    this.sendCodeActive.set(true)
    this.codeSendLoading.set(true)

    const emailControl = this.registerFormVerification.getControl('email')

    if (emailControl.invalid) {
      this.registerFormVerification.setError('email', 'Please enter valid email address')
      return
    }

    this.sendEmailVerificationCodeState = this.authService.request({
      method: HttpMethod.POST,
      endpoint: 'send-email-verification-code',
      body: { email: emailControl.value as string },
      onSuccess: () => {
        this.codeSent.set(true)
        this.sendCodeActive.set(true)

        setTimeout(() => this.sendCodeActive.set(false), 30000)
      },
      onError: (err) => console.error(err),
    })
  }

  public proceedToStage(stage: RegistrationStage): void {
    this.registrationStage.set(stage)
  }

  public onSubmit(): void {
    switch (this.registrationStage()) {
      case 'Main':
        this.validateMain()
        break

      case 'Extra':
        this.registerUser()
        break

      case 'Verification':
        this.verifyEmail()
        break
    }
  }

  public onPasswordChange(): void {
    this.registerFormMain.getControl('password')!.valueChanges.subscribe((value: string | null) => {
      if (value?.length) {
        this.passwordVisible.set(true)
        requestAnimationFrame(() => this.passwordNotEmpty.set(true))
      } else {
        this.passwordNotEmpty.set(false)
        setTimeout(() => this.passwordVisible.set(false), 300)
      }
    })
  }
}
