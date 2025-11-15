import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Colaborador } from '../interfaces/colaborador.interface';

@Injectable({
  providedIn: 'root' // Esto lo hace un singleton global
})
export class ColaboradorService {

  constructor() { }

  // Mockup para buscar un colaborador
  buscarColaborador(dni: string, correo: string): Observable<Colaborador | null> {
    
    // Simula una llamada API
    const mockColaborador: Colaborador = {
      id: 'usr_123',
      dni: dni,
      correo: correo,
      nombres: 'Ana',
      apellidos: 'García Torres',
      puesto: 'Analista de Finanzas',
      perfil: 'Finanzas',
      area: 'Contabilidad',
      sede: 'Lima Central'
    };

    // Retorna el mock después de 1 segundo
    return of(mockColaborador).pipe(delay(1000));
  }
}
