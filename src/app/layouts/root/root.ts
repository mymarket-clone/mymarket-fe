import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PortalModule } from '@angular/cdk/portal'
import { LanguageService } from '@app/services/language.service'
import { PortalService } from '@app/services/portal.service'
import { SignalRService } from '@app/services/http/signalr.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PortalModule],
  templateUrl: './root.html',
})
export class Root implements OnInit {
  public constructor(
    private readonly languageService: LanguageService,
    private readonly signalR: SignalRService,
    public readonly portal: PortalService
  ) {}

  public ngOnInit(): void {
    this.languageService.init()

    const connection = this.signalR.createConnection()

    connection.on('ReceiveMessage', (msg) => {
      console.log('message:', msg)
    })

    connection
      .start()
      .then(() => console.log('Connected'))
      .catch((err) => console.error('Connection error:', err))
  }
}
