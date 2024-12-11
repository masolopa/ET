import { MatDateFormats } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Formato al escribir o ingresar una fecha manualmente
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato al mostrar en el input
    monthYearLabel: 'MMMM YYYY', // Formato para el selector de mes/año
    dateA11yLabel: 'LL', // Formato accesible para lectores de pantalla
    monthYearA11yLabel: 'MMMM YYYY', // Formato accesible para el selector de mes/año
  },
};
