import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PortalModule } from '@angular/cdk/portal'
import { LanguageService } from '@app/services/language.service'
import { PortalService } from '@app/services/portal.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PortalModule],
  templateUrl: './root.html',
})
export class Root implements OnInit {
  public constructor(
    private readonly languageService: LanguageService,
    public readonly portal: PortalService
  ) {}

  public ngOnInit(): void {
    this.languageService.init()
  }
}
