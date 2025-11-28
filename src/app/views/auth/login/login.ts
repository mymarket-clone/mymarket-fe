import { Component, inject } from '@angular/core'
import { Input } from '../../../components/input/input'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Button } from '../../../components/button/button'
import { AuthService } from '../../../services/auth.service'
import { LoginFormControls } from '../../../types/LoginFormControls'

@Component({
  selector: 'app-login',
  imports: [Input, ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authService = inject(AuthService)
  public loginState?: ReturnType<AuthService['loginUser']>
  public submitted = false

  public loginForm = new FormGroup<LoginFormControls>({
    emailOrPhone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  public getControl<K extends keyof LoginFormControls>(key: K): LoginFormControls[K] {
    return this.loginForm.controls[key]
  }

  public onSubmit(): void {
    this.submitted = true
    if (this.loginForm.invalid) return

    this.loginState = this.authService.loginUser({
      body: {
        emailOrPhone: this.getControl('emailOrPhone').value!,
        password: this.getControl('password').value!,
      },
      form: this.loginForm,
    })
  }
}
