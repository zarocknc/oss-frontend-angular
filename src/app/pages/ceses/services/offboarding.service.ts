import { Injectable, signal, computed } from '@angular/core';

export type TerminationStatus = 'En Proceso' | 'Pendiente' | 'Finalizado';

export interface AssignedAsset {
  id: string;
  type: string;
  model: string;
  series: string;
  status: 'Asignado' | 'Devuelto';
}

export interface TerminationProcess {
  id: string;
  employeeName: string;
  employeeEmail: string;
  employeeDni: string;
  employeePosition: string; // Cargo
  employeeArea: string;
  location: string;
  terminationDate: string; // Fecha de Renuncia/Cese
  registrationDate: string; // Fecha de Registro en el sistema
  status: TerminationStatus;
  assets: AssignedAsset[];
}

@Injectable({
  providedIn: 'root'
})
export class OffboardingService {

  private _processes = signal<TerminationProcess[]>([
    {
      id: '1',
      employeeName: 'Ana Gomez',
      employeeEmail: 'ana.gomez@empresa.pe',
      employeeDni: '4568793',
      employeePosition: 'Analista TI',
      employeeArea: 'Sistemas',
      location: 'San Borja',
      terminationDate: '2025-11-23', // Future date vs today (mock assumes today is before)
      registrationDate: '2023-12-25',
      status: 'En Proceso',
      assets: [
        { id: 'a1', type: 'Laptop', model: 'Probook 440 g8', series: '5CD2782JK2', status: 'Asignado' },
        { id: 'a2', type: 'Monitor', model: 'Dell P2419H', series: 'CN-0D', status: 'Asignado' }
      ]
    },
    {
      id: '2',
      employeeName: 'Carlos Perez',
      employeeEmail: 'carlos.perez@empresa.pe',
      employeeDni: '4568794',
      employeePosition: 'Desarrollador',
      employeeArea: 'Sistemas',
      location: 'San Borja',
      terminationDate: '2023-09-25', // Past date
      registrationDate: '2023-09-25',
      status: 'Pendiente',
      assets: [
        { id: 'a3', type: 'Laptop', model: 'Macbook Pro', series: 'M1-PRO', status: 'Asignado' } // Not returned yet
      ]
    },
     {
      id: '3',
      employeeName: 'Maria Rodriguez',
      employeeEmail: 'maria.rodriguez@empresa.pe',
      employeeDni: '4568795',
      employeePosition: 'QA Lead',
      employeeArea: 'Calidad',
      location: 'Miraflores',
      terminationDate: '2023-12-25',
      registrationDate: '2023-12-25',
      status: 'Finalizado',
      assets: [
        { id: 'a4', type: 'Laptop', model: 'Dell Latitude', series: 'DL-5520', status: 'Devuelto' },
        { id: 'a5', type: 'Monitor', model: 'Samsung', series: 'S24', status: 'Devuelto' }
      ]
    }
  ]);

  processes = this._processes.asReadonly();

  searchProcesses(filters: { status?: string, location?: string, query?: string }): TerminationProcess[] {
    return this._processes().filter(p => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.location && p.location !== filters.location) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        return p.employeeName.toLowerCase().includes(q) || p.employeeEmail.toLowerCase().includes(q) || p.employeeDni.includes(q);
      }
      return true;
    });
  }

  // Action: Mark asset as returned
  markAssetAsReturned(processId: string, assetId: string) {
    this._processes.update(list => list.map(p => {
      if (p.id === processId) {
        const updatedAssets = p.assets.map(a => a.id === assetId ? { ...a, status: 'Devuelto' as const } : a);
        
        // Check if all assets are returned to update Process Status?
        // Logic: If TerminationDate <= Today AND Assets pending -> Pendiente
        // If TerminationDate <= Today AND All Assets returned -> Finalizado
        // If TerminationDate > Today -> En Proceso (irrespective of assets? usually assets are returned on last day)
        
        // For simple interaction let's primarily toggle the asset status
        // And maybe auto-update status if all returned?
        const allReturned = updatedAssets.every(a => a.status === 'Devuelto');
        let newStatus = p.status;
        if (allReturned && p.status !== 'En Proceso') { 
             newStatus = 'Finalizado'; 
        } 
        // Note: Real logic might be more complex, but this is good behavior for the UI prototype.

        return { ...p, assets: updatedAssets, status: newStatus };
      }
      return p;
    }));
  }
}
