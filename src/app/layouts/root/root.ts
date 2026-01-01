import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LanguageService } from '../../services/language.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './root.html',
})
export class Root implements OnInit {
  public constructor(private readonly languageService: LanguageService) {}

  public ngOnInit(): void {
    this.languageService.init()
    this.languageService.set('en')
  }
}
