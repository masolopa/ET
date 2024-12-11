export class NivelEducacional {

  id = 1;
  nombre = 'Básica Incompleta';

  public constructor() {
    
  }

  public setNivelEducacional(id: number, nombre: string): void {
    this.id = id;
    this.nombre = nombre;
  }

  public static getNivelEducacional(id: number, nombre: string): NivelEducacional {
    const nivel = new NivelEducacional();
    nivel.setNivelEducacional(id, nombre);
    return nivel;
  }

  public static getNivelesEducacionales(): NivelEducacional[] {
    const niveles: NivelEducacional[] = [
      NivelEducacional.getNivelEducacional(1, 'Básica Incompleta'),
      NivelEducacional.getNivelEducacional(2, 'Básica Completa'),
      NivelEducacional.getNivelEducacional(3, 'Media Incompleta'),
      NivelEducacional.getNivelEducacional(4, 'Media Completa'),
      NivelEducacional.getNivelEducacional(5, 'Superior Incompleta'),
      NivelEducacional.getNivelEducacional(6, 'Superior Completa')
    ];
    return niveles;
  }
  
  public getEducacion(): string {
    return this.id.toString() + ' - ' + this.nombre;
  }
  public static buscarNivelEducacional(id: number): NivelEducacional | undefined {

    return NivelEducacional.getNivelesEducacionales().find(level => level.id === id);
  }

}
