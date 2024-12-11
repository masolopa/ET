import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationController, IonicModule, Platform } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { AuthService } from 'src/app/services/auth.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { showAlertDUOC, showAlertSuccess, showAlertYesNoDUOC } from 'src/app/tools/message-functions';
import jsQR, { QRCode } from 'jsqr';
import { BarcodeFormat, BarcodeScanner, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { MessageEnum } from 'src/app/tools/message-enum';
import { addIcons } from 'ionicons';
import { stopCircleOutline, videocamOutline } from 'ionicons/icons';
import { LanguageComponent } from '../language/language.component';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-codigo-qr',
  templateUrl: './codigo-qr.component.html',
  styleUrls: ['./codigo-qr.component.scss'],
  standalone: true,
  
  imports: [
    CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule
    , LanguageComponent    // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule// CGV-Permite usar pipe 'translate'
  ]
})
export class CodigoQrComponent implements OnInit {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() qrCapturado: EventEmitter<string> = new EventEmitter();
  usuario: User = new User();
  public asistencia: Asistencia = new Asistencia();
  public datosQR: string = '';
  public datosMiClase = new BehaviorSubject<Asistencia | null>(null);
  plataforma: string = 'web';
  esAndroid: boolean = false;
  public escaneando = false;
  @Output() cambiarComponenteHeader = new EventEmitter<string>();
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private bd: DatabaseService,
    private sqliteService: SQLiteService,
    private readonly ngZone: NgZone,
    private platform: Platform) {
    this.detectarPlataforma();

    addIcons({ videocamOutline });
    addIcons({ stopCircleOutline });
  }
  detectarPlataforma() {
    if (this.platform.is('android')) {
      this.plataforma = 'android';
    } else if (this.platform.is('ios')) {
      this.plataforma = 'ios';
    } else if (this.platform.is('desktop')) {
      this.plataforma = 'web';
    } else {
      this.plataforma = 'otra';
    }

    console.log('Plataforma detectada:', this.plataforma);
  }
  IonViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
    this.detectarPlataforma();

  }
  ngOnInit() {
    this.plataforma = this.sqliteService.platform;
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuario = usuario ? usuario : new User();
    });
  }
  async comenzarEscaneoQR() {
    if (this.plataforma === "web") {
      this.comenzarEscaneoQRWeb();
    } else {
      this.comenzarEscaneoQRNativo();

    }
  }
  public async comenzarEscaneoQRWeb() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playinline', 'true')
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }
  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));


    }
  }
  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.escaneando = false;
        if (this.asistencia.verificarAsistenciaDesdeQR(qrCode.data)) {
          this.bd.datosQR.next(qrCode.data);
          this.qrCapturado.emit(qrCode.data);
          showAlertSuccess('El codigo QR ha sido escaneado correctamente');
          this.navigateMiClase();

          this.detenerEscaneoQR();
        } else {
          showAlertDUOC('El codigo QR escaneado no corresponde a una Asistencia de DUOC');
        }
        return true;
      }
    }

    return false;
  }
  public detenerEscaneoQR(): void {
    const videoTracks =
      this.video.nativeElement.srcObject?.getTracks() as MediaStreamTrack[]; // Asegúrate de que sea un array de MediaStreamTrack
    if (videoTracks) {
      videoTracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    this.video.nativeElement.srcObject = null;
    this.escaneando = false;
  }
  async comenzarEscaneoQRNativo() {
    const datosQR = await this.escanearQRNativo();

    if (datosQR === '') return;
    if (datosQR.includes('Error: ')) {
      showAlertDUOC(datosQR.substring(7));
      return;
    }

    if (this.asistencia.verificarAsistenciaDesdeQR(datosQR)) {
      this.bd.datosQR.next(datosQR);
      this.qrCapturado.emit(datosQR);

      showAlertSuccess('El codigo QR ha sido escaneado correctamente');

      this.navigateMiClase();

    } else {
      showAlertDUOC('El código QR escaneado no corresponde a una Asistencia de DUOC');
    }
  }
  navigateMiClase() {
    this.cambiarComponenteHeader.emit('mi-clase'); // Ejemplo de cambio a 'foro'
  }

  public async escanearQRNativo(): Promise<string> {
    try {
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (result) => {
        if (!result.available) await BarcodeScanner.installGoogleBarcodeScannerModule();
      });
      if (!await BarcodeScanner.isSupported()) {
        return Promise.resolve('ERROR: Google Barcode Scanner no es compatible con este celular');
      }
      let status = await BarcodeScanner.checkPermissions();
      if (status.camera === 'denied') status = await BarcodeScanner.requestPermissions();
      if (status.camera === 'denied') {
        const resp = await showAlertYesNoDUOC('No fue posible otorgar permisos a la cámara. ¿Quiere '
          + 'acceder a las opciones de configuración de la aplicación y darle permiso manualmente?');
        if (resp === MessageEnum.YES) await BarcodeScanner.openSettings();

        return Promise.resolve('');
      }
      await BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
          })
        });

      });
      const { barcodes }: ScanResult = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode] })

      return Promise.resolve(barcodes[0].displayValue);


    } catch (error: any) {
      if (error.message.includes('canceled')) return Promise.resolve('');
      return Promise.resolve('ERROR: No fue posible leer el codigo QR');
    }
  }
}


