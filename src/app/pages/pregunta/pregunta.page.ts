import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  providers: [
    { provide: TranslateService },
    /* other services */
  ],
  imports: [CommonModule, FormsModule, IonicModule, LanguageComponent, TranslateModule]
})
export class PreguntaPage implements OnInit, AfterViewInit {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  @ViewChild("titulo", { read: ElementRef }) itemTitulo!: ElementRef;
  //public usuario: Usuario = new Usuario("","","","","","","",NivelEducacional.findNivelEducacionalById(1)!,undefined);
  usuario: User = new User();
  public respuesta: string = "";

  constructor(
    private animationController: AnimationController,
    private authService: AuthService,
    private translate: TranslateService) {
    this.authService.usuarioAutenticado.subscribe(usuario => {
      if (usuario) { // Verificar que el usuario no sea nulo antes de asignar
        this.usuario = usuario;
      }
    });
  }
  ionViewWillEnter() {
    if (this.selectLanguage) {
      this.selectLanguage.setCurrentLanguage();
    } else {
      
    }
  }
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo("transform", "translate(-80%)", "translate(100%)")
        .fromTo("opacity", 0.2, 0.8);
      animation.play();
    }
  }
  navigateLogin(): void {
    this.authService.navigatelogin();
  }

  vPregunta() {
    console.log(this.usuario.email);
    this.authService.valPregunta(this.usuario.email,this.respuesta);
  }


}
