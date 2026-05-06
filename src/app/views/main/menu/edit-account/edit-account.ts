import { Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Input } from '@app/components/input/input'
import { IEditAccount } from '@app/interfaces/forms/IEditAccount'
import { FormService } from '@app/services/form.service'
import { Zod } from '@app/utils/Zod'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'
import { Segmented } from '@app/components/segmented/segmented'
import { ApiService } from '@app/services/http/api.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { UserDetail } from '@app/types/User'
import { Button } from '@app/components/button/button'
import { UserStore } from '@app/stores/user.store'

@Component({
  selector: 'edit-account',
  templateUrl: 'edit-account.html',
  imports: [Input, TranslocoDirective, Segmented, Button, ReactiveFormsModule],
  providers: [FormService],
})
export class EditAccount {
  public currentUserState?: IHttpService<UserDetail>
  public editProfileState?: IHttpService<void>

  public constructor(
    private readonly zod: Zod,
    private readonly apiService: ApiService,
    private readonly ts: TranslocoService,
    private readonly userStore: UserStore,
    public readonly fs: FormService<IEditAccount>
  ) {
    this.currentUserState = this.apiService.request({
      method: HttpMethod.GET,
      endpoint: 'users/current',
      onSuccess: (data) => {
        this.fs.getControl('firstname').setValue(data.name)
        this.fs.getControl('lastname').setValue(data.lastname)
        this.fs.getControl('email').setValue(data.email)
        this.fs.getControl('gender').setValue(data.genderType)
        this.fs.getControl('birthYear').setValue(data.birthYear)
        this.fs.getControl('phoneNumber').setValue(data.number)
      },
    })

    this.fs.setForm(
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
        }),
        gender: new FormControl(1, this.zod.required()),
        birthYear: new FormControl(
          new Date().getFullYear() - 16,
          this.zod.between(1900, new Date().getFullYear())
        ),
        phoneNumber: new FormControl('', this.zod.required()),
      })
    )
  }

  public onSubmit(): void {
    this.fs.submit({
      onSuccess: () => {
        this.apiService.request({
          method: HttpMethod.PUT,
          endpoint: 'users',
          body: this.fs.getValues(),
          onSuccess: () => {
            const current = this.userStore.getUser()
            if (!current) return

            const updated = {
              ...current,
              user: {
                ...current.user,
                ...this.fs.getValues(),
              },
            }

            this.userStore.setUser(updated)
          },
        })
      },
    })
  }
}
