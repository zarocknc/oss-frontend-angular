import { Injectable, signal } from '@angular/core';

export interface UserConfig {
  id: string;
  name: string;
  email: string;
  role: 'ADMINISTRADOR' | 'GESTOR DE ACTIVOS';
  status: 'ACTIVO' | 'INACTIVO';
}

export interface LocationConfig {
  id: string;
  name: string; // Sede
  warehouseName: string;
  address?: string;
  phone?: string;
  responsible?: string;
  type: 'Central' | 'Secundario';
  internalCode?: string;
}

export interface AssetTypeConfig {
  id: string;
  name: string;
  description: string;
}

export interface GeneralParams {
  systemName: string;
  companyName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  // Signals for state
  users = signal<UserConfig[]>([
    { id: '1', name: 'JULIO DIAZ MEMO', email: 'JULIO.D.@EMPRESA.PE', role: 'ADMINISTRADOR', status: 'ACTIVO' },
    { id: '2', name: 'MARIA PEREZ', email: 'MARIA.P.@EMPRESA.PE', role: 'GESTOR DE ACTIVOS', status: 'ACTIVO' }
  ]);

  locations = signal<LocationConfig[]>([
    { id: '1', name: 'SAN BORJA', warehouseName: 'ALMACÉN CENTRAL', type: 'Central', address: 'Av. Javier Prado 123', responsible: 'Juan Perez', internalCode: 'SB-001' },
    { id: '2', name: 'MIRAFLORES', warehouseName: 'ALMACÉN MIRAFLORES', type: 'Secundario', address: 'Calle Shell 456', responsible: 'Ana Gomez', internalCode: 'MF-001' }
  ]);

  assetTypes = signal<AssetTypeConfig[]>([
    { id: '1', name: 'Laptop', description: 'Computadoras portátiles' },
    { id: '2', name: 'Monitor', description: 'Pantallas externas' },
    { id: '3', name: 'Teléfono', description: 'Teléfonos IP' },
    { id: '4', name: 'Impresora', description: 'Dispositivos de impresión' }
  ]);

  generalParams = signal<GeneralParams>({
    systemName: 'Sistema de Gestión de Activos TI',
    companyName: 'Mi Empresa S.A.C.'
  });

  // Methods
  addUser(user: Omit<UserConfig, 'id'>) {
    const newId = (this.users().length + 1).toString();
    this.users.update(list => [...list, { ...user, id: newId }]);
  }

  addLocation(loc: Omit<LocationConfig, 'id'>) {
     const newId = (this.locations().length + 1).toString();
     this.locations.update(list => [...list, { ...loc, id: newId }]);
  }

  addAssetType(type: Omit<AssetTypeConfig, 'id'>) {
      const newId = (this.assetTypes().length + 1).toString();
      this.assetTypes.update(list => [...list, { ...type, id: newId }]);
  }

  updateGeneralParams(params: GeneralParams) {
    this.generalParams.set(params);
  }
}
