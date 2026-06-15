import { Component, signal } from '@angular/core'
import { ApiService } from '@app/services/http/api.service'
import { PortalService } from '@app/services/portal.service'
import { UserStore } from '@app/stores/user.store'
import { UserDetail } from '@app/types/User'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { TranslocoDirective } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'top-up-balance-modal',
  templateUrl: 'top-up-balance-modal.html',
  imports: [SvgIconComponent, TranslocoDirective],
})
export class TopUpBalanceModal {
  public amount = signal<string>('')
  public error = signal<string | null>(null)
  public loading = signal(false)

  public constructor(
    private readonly apiService: ApiService,
    private readonly portalService: PortalService,
    private readonly userStore: UserStore
  ) {}

  public closeModal(): void {
    this.portalService.close()
  }

  public onAmountChange(value: string): void {
    this.amount.set(value)
    this.error.set(null)
  }

  public submit(): void {
    const amount = Number(this.amount())

    if (!Number.isFinite(amount) || amount <= 0) {
      this.error.set('balance.invalidAmount')
      return
    }

    this.loading.set(true)
    this.apiService.request<UserDetail, { amount: number }>({
      method: HttpMethod.POST,
      endpoint: 'users/balance/top-up',
      body: { amount },
      onSuccess: (user) => {
        this.userStore.setBalance(Number(user.balance ?? 0))
        this.closeModal()
      },
      onError: () => this.error.set('balance.invalidAmount'),
      onFinally: () => this.loading.set(false),
    })
  }
}
