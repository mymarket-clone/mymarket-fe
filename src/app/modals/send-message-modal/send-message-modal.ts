import { Component, Inject, signal } from '@angular/core'
import { SEND_MESSAGE_DATA } from '@app/configs/injector-token.config'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { ApiService } from '@app/services/http/api.service'
import { PortalService } from '@app/services/portal.service'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'send-message-modal',
  templateUrl: 'send-message-modal.html',
  imports: [SvgIconComponent, TranslocoPipe, TranslocoDirective],
})
export class SendMessageModal {
  public dataInput = signal<{
    reciever: number
    postId: number
  } | null>(null)
  public showError = signal<boolean>(false)
  public message = signal<string>('')
  public sendMessageState?: IHttpService<void>

  public constructor(
    @Inject(SEND_MESSAGE_DATA) public data: { reciever: number; postId: number },
    private readonly portalService: PortalService,
    public readonly apiService: ApiService
  ) {
    this.dataInput.set(data)
  }

  public onMessageChange(value: string): void {
    this.message.set(value)
  }

  public closeModal(): void {
    this.portalService.close()
  }

  public sendMessage(): void {
    if (this.message().trim().length <= 0) {
      this.showError.set(true)
    } else {
      this.showError.set(false)
      this.sendMessageState = this.apiService.request({
        method: HttpMethod.POST,
        endpoint: `chat/send-message`,
        body: {
          reciever: this.dataInput()?.reciever,
          postId: this.dataInput()?.postId,
          message: this.message(),
        },
      })
    }
  }
}
