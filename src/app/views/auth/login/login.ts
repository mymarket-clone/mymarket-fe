import { Component } from '@angular/core'
import { Input } from '../../../components/input/input'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Button } from '../../../components/button/button'
import { AuthService } from '../../../services/auth.service'
import { LoginForm } from '../../../types/forms/LoginForm'
import { FormService } from '../../../services/form.service'
import { LoginCredentials } from '../../../interfaces/payload/LoginCredentials'

@Component({
  selector: 'app-login',
  imports: [Input, ReactiveFormsModule, RouterLink, Button],
  providers: [FormService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public loginState?: ReturnType<AuthService['loginUser']>

  public constructor(
    private readonly authService: AuthService,
    public readonly fs: FormService<LoginForm>
  ) {
    this.fs.setForm(
      new FormGroup({
        emailOrPhone: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      })
    )
  }

  public onSubmit(): void {
    this.fs.setSubmitted()

    if (this.fs.form.valid) {
      this.loginState = this.authService.loginUser({
        body: this.fs.form.getRawValue() as LoginCredentials,
        form: this.fs.form,
      })
    }
  }
}
