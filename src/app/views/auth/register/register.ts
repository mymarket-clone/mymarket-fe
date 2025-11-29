import { Component } from '@angular/core'
import { FormService } from '../../../services/form.service'
import { RegisterForm } from '../../../types/forms/RegisterForm'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Input } from '../../../components/input/input'
import { RouterLink } from '@angular/router'
import { Button } from '../../../components/button/button'
import { AuthService } from '../../../services/auth.service'
import { RegisterCredentials } from '../../../interfaces/payload/RegisterCredentials'

@Component({
  selector: 'app-register',
  imports: [Input, ReactiveFormsModule, RouterLink, Button],
  providers: [FormService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public registerState?: ReturnType<typeof AuthService.registerUser>

  public constructor(public readonly fs: FormService<RegisterForm>) {
    this.fs.setForm(
      new FormGroup({
        name: new FormControl(''),
        lastname: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)]),
      })
    )
  }

  public onSubmit(): void {
    this.fs.setSubmitted()

    if (this.fs.form.valid) {
      this.registerState = AuthService.registerUser({
        body: this.fs.form.getRawValue() as RegisterCredentials,
        form: this.fs.form,
      })
    }
  }
}
