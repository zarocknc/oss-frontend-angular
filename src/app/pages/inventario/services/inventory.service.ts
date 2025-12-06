import { Injectable, signal, computed } from '@angular/core';

export type AssetStatus = 'Disponible' | 'Asignado' | 'En mantenimiento' | 'Baja';

export interface InventoryAsset {
  id: string;
  alm: string; // Almacen location
  type: string; // Equipo: Laptop, Monitor
  brand: string;
  model: string;
  series: string;
  invCode: string; // INV
  cmdbCode: string; // CMDB
  status: AssetStatus;
  observation: string;
  
  // Specs for Details Panel
  processor?: string;
  ram?: string;
  age?: string; // Antiguedad
  currentLocation?: string; // Ubicacion actual (puede ser diferente de ALM si está asignado)
  bookValue?: string; // Valor Contable
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private _assets = signal<InventoryAsset[]>([
    {
      id: '1',
      alm: 'SAN BORJA',
      type: 'LAPTOP',
      brand: 'LENOVO',
      model: 'T440',
      series: '6TR7333',
      invCode: '00933',
      cmdbCode: 'NUEVO',
      status: 'Asignado',
      observation: 'CON DESGASTE',
      processor: 'Core i7',
      ram: '16GB',
      age: '4 años',
      currentLocation: 'San Borja',
      bookValue: 'S/. 2.000'
    },
    {
      id: '2',
      alm: 'SAN BORJA',
      type: 'LAPTOP',
      brand: 'LENOVO',
      model: 'T440',
      series: '6TR7334',
      invCode: '00934',
      cmdbCode: 'NUEVO',
      status: 'Disponible',
      observation: 'BUEN ESTADO',
      processor: 'Core i5',
      ram: '8GB',
      age: '3 años',
      currentLocation: 'Almacén Central',
      bookValue: 'S/. 1.500'
    },
    {
      id: '3',
      alm: 'SAN BORJA',
      type: 'LAPTOP',
      brand: 'LENOVO',
      model: 'T440',
      series: '6TR7335',
      invCode: '00935',
      cmdbCode: 'NUEVO',
      status: 'En mantenimiento',
      observation: 'FALLA DE PANTALLA',
      processor: 'Core i7',
      ram: '16GB',
      age: '4 años',
      currentLocation: 'Servicio Técnico',
      bookValue: 'S/. 1.800'
    },
    {
      id: '4',
      alm: 'SAN BORJA',
      type: 'LAPTOP',
      brand: 'LENOVO',
      model: 'T440',
      series: '6TR7336',
      invCode: '00936',
      cmdbCode: 'NUEVO',
      status: 'Baja',
      observation: 'OBSOLETO',
      processor: 'Core i3',
      ram: '4GB',
      age: '6 años',
      currentLocation: 'Almacén de Baja',
      bookValue: 'S/. 0'
    },
    // Adding more mock data to fill the table slightly
    {
        id: '5',
        alm: 'MIRAFLORES',
        type: 'MONITOR',
        brand: 'DELL',
        model: 'P2419H',
        series: 'CN-0D',
        invCode: '00940',
        cmdbCode: 'NUEVO',
        status: 'Asignado',
        observation: '',
        age: '2 años',
        bookValue: 'S/. 600'
    }
  ]);

  assets = this._assets.asReadonly();

  // KPIs
  stats = computed(() => {
    const list = this._assets();
    return {
      available: list.filter(a => a.status === 'Disponible').length,
      assigned: list.filter(a => a.status === 'Asignado').length,
      maintenance: list.filter(a => a.status === 'En mantenimiento').length,
      discharged: list.filter(a => a.status === 'Baja').length // Baja
    };
  });

  updateAssetStatus(id: string, newStatus: AssetStatus, observation: string) {
    this._assets.update(items => items.map(a => {
        if (a.id === id) {
            return { ...a, status: newStatus, observation: observation || a.observation };
        }
        return a;
    }));
  }

  addAssets(newAssets: InventoryAsset[]) {
    this._assets.update(current => [...current, ...newAssets]);
  }

  getNextId(): string {
      const ids = this._assets().map(a => parseInt(a.id)).filter(n => !isNaN(n));
      const max = ids.length > 0 ? Math.max(...ids) : 0;
      return (max + 1).toString();
  }
}
