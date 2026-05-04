import { Injectable } from '@angular/core'
import { UserStore } from '@app/stores/user.store'
import * as signalR from '@microsoft/signalr'

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection?: signalR.HubConnection

  public constructor(private readonly userStore: UserStore) {}

  public createConnection(): signalR.HubConnection {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/chat', {
        accessTokenFactory: () => this.getToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    return this.connection
  }

  private getToken(): string {
    const token = this.userStore.accessToken
    if (!token) throw new Error('Unauthenticated access of ws')
    return token
  }
}
