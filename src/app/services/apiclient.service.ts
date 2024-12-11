import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publicacion } from '../model/publicacion';
import { showToast } from '../tools/message-functions';

@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    })
  };

  listaPublicaciones: BehaviorSubject<Publicacion[]> = new BehaviorSubject<Publicacion[]>([]);
  apiUrl = 'http://localhost:3000'; // Url al usar en navegador Web
  //apiUrl = 'http://192.168.100.13:3000'; // Url al usar en mi celular en mi WIFI, tu puedes tener otra IP

  constructor(private http: HttpClient) { }

  async cargarPublicaciones() {
    this.leerPublicaciones().subscribe({
      next: (publicaciones) => {
        this.listaPublicaciones.next(publicaciones as Publicacion[]);
      },
      error: (error: any) => {
        showToast('El servicio API Rest de Publicaciones no está disponible');
        this.listaPublicaciones.next([]);
      }
    });
  }

  crearPublicacion(publicacion: any): Observable<any> {
    return this.http.post(this.apiUrl + '/posts/', publicacion, this.httpOptions);
  }

  leerPublicaciones(): Observable<any> {
    return this.http.get(this.apiUrl + '/posts/');
  }

  leerPublicacion(idPublicacion: string): Observable<any> {
    return this.http.get(this.apiUrl + '/posts/' + idPublicacion);
  }

  actualizarPublicacion(publicacion: any): Observable<any> {
    return this.http.put(this.apiUrl + '/posts/' + publicacion.id, publicacion, this.httpOptions);
  }

  eliminarPublicacion(publicacionId: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/posts/' + publicacionId, this.httpOptions);
  }

}
