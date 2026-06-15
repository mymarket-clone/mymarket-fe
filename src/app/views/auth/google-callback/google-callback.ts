import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-google-callback',
  template: '',
})
export class GoogleCallback implements OnInit {
  public constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap

    window.opener?.postMessage(
      {
        source: 'google-oauth',
        auth: params.get('auth') ?? undefined,
        error: params.get('error') ?? undefined,
        message: params.get('message') ?? undefined,
      },
      window.location.origin
    )

    window.close()
  }
}
