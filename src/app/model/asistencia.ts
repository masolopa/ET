export class Asistencia {

  public sede: string = '';
  public idAsignatura: string = '';
  public seccion: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public dia: string = '';

  public bloqueInicio: number = 0;
  public bloqueTermino: number = 0;
  public horaInicio: string = '';
  public horaFin: string = '';

  constructor() {

  }

  public setAsistencia(
    sede: string,
    idAsignatura: string,
    seccion: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    dia: string,

    bloqueInicio: number,
    bloqueTermino: number,
    horaInicio: string,
    horaFin: string
  ): void {

    this.sede = sede;

    this.idAsignatura = idAsignatura;
    this.seccion = seccion;
    this.nombreAsignatura = nombreAsignatura;
    this.nombreProfesor = nombreProfesor;
    this.dia = dia;
    this.bloqueInicio = bloqueInicio;
    this.bloqueTermino = bloqueTermino;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }

  public obtenerAsistenciaDesdeQR(datosQR: string): Asistencia {
    if (this.verificarAsistenciaDesdeQR(datosQR)) {
      const json = JSON.parse(datosQR);
  
      // Asegúrate de que las propiedades del JSON se asignen en el orden correcto
      const asistencia = new Asistencia();
      asistencia.sede = json.sede;
      asistencia.idAsignatura = json.idAsignatura;
      asistencia.seccion = json.seccion;
      asistencia.nombreAsignatura = json.nombreAsignatura;
      asistencia.nombreProfesor = json.nombreProfesor;
      asistencia.dia = json.dia;
      asistencia.bloqueInicio = json.bloqueInicio;
      asistencia.bloqueTermino = json.bloqueTermino;
      asistencia.horaInicio = json.horaInicio;
      asistencia.horaFin = json.horaFin;
  
      return asistencia;
    }
    return new Asistencia();  // Si no es válido, devuelve una nueva instancia vacía
  }
  


  verificarAsistenciaDesdeQR(datosQR: string): boolean {
    if (datosQR !== '') {
      try {
        const json = JSON.parse(datosQR);
        // Verifica que el JSON contiene todas las propiedades necesarias
        return json.sede !== undefined
          && json.idAsignatura !== undefined
          && json.seccion !== undefined
          && json.nombreAsignatura !== undefined
          && json.nombreProfesor !== undefined
          && json.dia !== undefined
          && json.bloqueInicio !== undefined
          && json.bloqueTermino !== undefined
          && json.horaInicio !== undefined
          && json.horaFin !== undefined;
      } catch (error) {
        console.error('Error al parsear el QR:', error);
      }
    }
    return false;
  }




}
