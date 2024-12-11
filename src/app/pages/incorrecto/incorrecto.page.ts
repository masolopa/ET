import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,

  imports: [IonicModule,CommonModule, FormsModule,LanguageComponent,TranslateModule]
})
export class IncorrectoPage implements OnInit {
  
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  constructor(private router: Router,
              private authService: AuthService,
              private translate: TranslateService
  ) { }
  
  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
      
    }
  }
  ngOnInit() {
  }
  navigateLogin(): void{
    this.authService.navigatelogin();
  }
}
