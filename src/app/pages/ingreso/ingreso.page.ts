
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { IonInput } from '@ionic/angular';
import { AnimationController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  providers: [
    { provide: TranslateService },
    /* other services */
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ],
})
export class IngresoPage implements ViewChild {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;


  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  descendants: boolean = false;
  emitDistinctChangesOnly: boolean = false;
  first: boolean = false;
  read: any;
  isViewQuery: boolean = false;
  selector: any;
  static?: boolean | undefined;
  cuenta: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private animationController: AnimationController
  ) {
    addIcons({ colorWandOutline });
  }
  ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();

  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }
  navigateRegistro() {
    this.router.navigate(['/registrarme']);
  }

  login() {
    this.authService.login(this.cuenta, this.password);
    if (!this.authService.usuarioAutenticado.value) { // Cambia esto según cómo manejes el estado
      // Limpiar los campos si el inicio de sesión falla
      this.cuenta = '';
      this.password = '';
      
    }

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
  navigateMiRuta() {
    this.router.navigate(['/miruta']);
  }

  passwordRecovery() {
    this.router.navigate(['/correo']);
  }
}
