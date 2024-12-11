import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnimationController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  
  standalone: true,
  
  imports: [CommonModule, IonicModule, FormsModule, LanguageComponent, TranslateModule]
})
export class CorreoPage implements OnInit, ViewChild {
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public correo: string = '';
  descendants: boolean = false;
  emitDistinctChangesOnly: boolean = false;
  first: boolean = false;
  read: any;
  isViewQuery: boolean = false;
  selector: any;
  static?: boolean | undefined;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private animationController: AnimationController,
    private authService: AuthService) {
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'translate(-85%)', 'translate(100%)')
        .fromTo('opacity', 0.2, 0.8)
      animation.play()
    }
  }
  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
    }
  }
  vCorreo() {
    this.authService.valCorreo(this.correo);
  }
  navigatePregunta(): void {
    this.router.navigate(['/pregunta'])
  }

  navigateLogin(): void {
    this.authService.navigatelogin();
  }

  ngOnInit() {

  }

}