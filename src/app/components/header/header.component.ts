import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { arrowBack, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AnimationController, SegmentValue } from '@ionic/angular/standalone';
import { LanguageComponent } from '../language/language.component';
import { User } from 'src/app/model/user';
import { showAlert } from 'src/app/tools/message-functions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,

  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule
    , LanguageComponent   // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class HeaderComponent implements OnInit {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  @ViewChild("titulo", { read: ElementRef }) itemTitulo!: ElementRef;
  @Output() componenteSeleccionado = new EventEmitter<string>();
  segmentValue = 'qr';
  currentUser: User = new User();

  isAdmin: boolean = this.authService.getRole();

  constructor(private animationController: AnimationController, private translate: TranslateService, private authService: AuthService, private router: Router) {

    addIcons({ logOutOutline });
    addIcons({ arrowBack });
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      this.currentUser = usuario || new User();
    })
  }
  ngOnInit(): void {
  }
  ionViewWillEnter() {

    this.seleccionarComponente('qr');

    this.selectLanguage.setCurrentLanguage();
  }
  
  
  setSegmentValue(value: string) {
    this.segmentValue = value;
    this.componenteSeleccionado.emit(value); // Emitir el cambio al padre
  }
  public ngAfterViewInit(): void {

    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(4000)
        .fromTo("transform", "translate(-30%)", "translate(100%)")
        .fromTo("opacity", 0, 0.8);
      animation.play();
    }
  }

  seleccionarComponente(value: SegmentValue | undefined) {
    const componente = value ?? 'qr'; // Asigna 'qr' si el valor es undefined
    this.componenteSeleccionado.emit(String(componente));
  }
  isHomePage(): boolean {
    return this.router.url === '/inicio';
  }
  isRutaPage(): boolean {
    return this.router.url === '/ruta';
  }
  navigateAtras(): void {
    this.router.navigate(['/ingreso'])
  }
  logout() {
    this.authService.logout();
  }

}
