import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activo } from '../interfaces/activo.interface';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {

  constructor() { }

  // Mockup para obtener activos disponibles
  getActivosDisponibles(perfil: string): Observable<Activo[]> {
    
    // Lógica simulada: el perfil 'Finanzas' requiere gama 'Media' o 'Alta'
    // El gestor hacía esto manualmente [Flujos.pdf source 2]
    
    const mockActivos: Activo[] = [
      {
        id: 'act_001', serie: 'SN-A90FGG', codigoInventario: 'INV-1001',
        tipoEquipo: 'Laptop', marca: 'Lenovo', modelo: 'ThinkPad T14',
        estado: 'Disponible', gama: 'Media'
      },
      {
        id: 'act_002', serie: 'SN-B87HSA', codigoInventario: 'INV-1002',
        tipoEquipo: 'Laptop', marca: 'Dell', modelo: 'XPS 15',
        estado: 'Disponible', gama: 'Alta'
      },
      {
        id: 'act_003', serie: 'SN-C12FRA', codigoInventario: 'INV-1003',
        tipoEquipo: 'Laptop', marca: 'HP', modelo: 'ProBook 440',
        estado: 'Disponible', gama: 'Media'
      }
    ];

    return of(mockActivos);
  }
}
