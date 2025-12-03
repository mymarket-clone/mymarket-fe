import { Component, signal } from '@angular/core'
import { FormService } from '../../../services/form.service'
import { RegisterForm } from '../../../types/forms/RegisterForm'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../../services/auth.service'
import { userExistsValidator } from '../../../utils/userExistsValidator'
import { RegisterMain } from './register-main/register-main'
import { Extra } from './extra/extra'
import { notZeroValidator } from '../../../utils/validators/notZeroValidator'
import { RegisterStage } from '../../../types/enums/RegisterStage'
import { passwordValidator } from '../../../utils/validators/passwordValidator'
import { passwordMatchValidator } from '../../../utils/validators/passwordMatchValidator'
import { lettersOnlyValidator } from '../../../utils/validators/lettersOnlyValidatior'
import { Verification } from './verification/verification'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RegisterMain, Extra, Verification],
  providers: [FormService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public registerState?: ReturnType<AuthService['registerUser']>
  public stage = signal<RegisterStage>(RegisterStage.Main)
  public readonly RegisterStage = RegisterStage

  public constructor(
    private readonly authService: AuthService,
    private readonly actR: ActivatedRoute,
    public readonly fs: FormService<RegisterForm>
  ) {
    this.fs.setForm(
      new FormGroup(
        {
          name: new FormControl('', [Validators.required, lettersOnlyValidator]),
          lastname: new FormControl('', Validators.required),
          email: new FormControl('', {
            validators: [Validators.required, Validators.email],
            asyncValidators: [userExistsValidator(this.authService)],
            updateOn: 'blur',
          }),
          password: new FormControl('', [Validators.required, passwordValidator]),
          passwordConfirm: new FormControl('', Validators.required),
          gender: new FormControl(0, [Validators.required, notZeroValidator]),
          birthYear: new FormControl(2016, [Validators.required, notZeroValidator]),
          phoneNumber: new FormControl('', [Validators.required]),
          termsAndConditions: new FormControl(false, [Validators.requiredTrue]),
          privacyPolicy: new FormControl(false, [Validators.requiredTrue]),
        },
        { validators: passwordMatchValidator }
      )
    )

    if (this.actR.snapshot.queryParamMap.get('email')) {
      this.stage.set(RegisterStage.Verification)
    }
  }

  public moveTo(stage: RegisterStage): void {
    this.stage.set(stage)
  }
}
