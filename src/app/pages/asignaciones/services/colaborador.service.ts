import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Colaborador } from '../interfaces/colaborador.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  // Mockup para buscar un colaborador -> Migrated to API usage
  buscarColaborador(dni: string, correo: string): Observable<Colaborador | null> {
    // We can search by code (assuming DNI ~ code) or filter all active
    // For specific DNI search:
    if (dni) {
       return this.http.get<any>(`${this.apiUrl}/empleados/codigo/${dni}`).pipe(
           map((e: any) => this.mapApiToColaborador(e)),
           catchError((e: unknown) => {
               console.error('Error fetching by DNI', e);
               return of(null);
           })
       );
    }
    return of(null);
  }

  private mapApiToColaborador(apiEmp: any): Colaborador {
      if (!apiEmp) return {} as Colaborador;
      return {
          id: apiEmp.id.toString(),
          dni: apiEmp.codigoEmpleado,
          correo: apiEmp.email,
          nombres: apiEmp.nombre,
          apellidos: `${apiEmp.apellidoPaterno} ${apiEmp.apellidoMaterno || ''}`.trim(),
          puesto: apiEmp.puesto?.nombre || '',
          perfil: 'Empleado',
          area: apiEmp.area?.nombre || '',
          sede: apiEmp.sede?.nombre || ''
      };
  }
}
