import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals for state
  users = signal<UserConfig[]>([]);
  locations = signal<LocationConfig[]>([]);
  assetTypes = signal<AssetTypeConfig[]>([]);
  areas = signal<any[]>([]); // simplified type for now or add interface
  positions = signal<any[]>([]);
  employeeStatuses = signal<any[]>([]);

  generalParams = signal<GeneralParams>({
    systemName: 'Sistema de Gestión de Activos TI',
    companyName: 'Mi Empresa S.A.C.'
  });

  constructor() {
    this.loadReferenceData();
  }

  loadReferenceData() {
    // Load Users
    this.http.get<any[]>(`${this.apiUrl}/usuarios`).pipe(
      map((users: any[]) => users.map((u: any) => ({
        id: u.id.toString(),
        name: u.nombreCompleto || u.username,
        email: u.email,
        role: 'ADMINISTRADOR', // Default
        status: u.activo ? 'ACTIVO' : 'INACTIVO'
      } as UserConfig)))
    ).subscribe({
      next: (data: UserConfig[]) => this.users.set(data),
      error: (e: unknown) => console.error('Error loading users', e)
    });

    // Load Locations (Sedes)
    this.http.get<any[]>(`${this.apiUrl}/catalogos/sedes`).pipe(
      map((sedes: any[]) => sedes.map((s: any) => ({
        id: s.id.toString(),
        name: s.nombre,
        warehouseName: `Almacén ${s.nombre}`,
        type: 'Secundario', // Default
        address: s.direccion,
        internalCode: s.codigo
      } as LocationConfig)))
    ).subscribe({
      next: (data: LocationConfig[]) => this.locations.set(data),
      error: (e: unknown) => console.error('Error loading locations', e)
    });

    // Load Asset Types
    this.http.get<any[]>(`${this.apiUrl}/catalogos/tipos-dispositivo`).pipe(
      map((types: any[]) => types.map((t: any) => ({
        id: t.id.toString(),
        name: t.nombre,
        description: t.descripcion
      } as AssetTypeConfig)))
    ).subscribe({
      next: (data: AssetTypeConfig[]) => this.assetTypes.set(data),
      error: (e: unknown) => console.error('Error loading asset types', e)
    });

    // Load Areas
    this.http.get<any[]>(`${this.apiUrl}/catalogos/areas`).subscribe({
      next: (data) => this.areas.set(data),
      error: (e) => console.error('Error loading areas', e)
    });

    // Load Puestos
    this.http.get<any[]>(`${this.apiUrl}/catalogos/puestos`).subscribe({
      next: (data) => this.positions.set(data),
      error: (e) => console.error('Error loading positions', e)
    });

    // Load Employee Statuses
    this.http.get<any[]>(`${this.apiUrl}/catalogos/estados-empleado`).subscribe({
      next: (data) => this.employeeStatuses.set(data),
      error: (e) => console.error('Error loading employee statuses', e)
    });
  }

  // Methods
  addUser(user: Omit<UserConfig, 'id'>) {
     // TODO: Implement API post
  }

  addLocation(loc: Omit<LocationConfig, 'id'>) {
     // TODO: Implement API post
  }

  addAssetType(type: Omit<AssetTypeConfig, 'id'>) {
      // TODO: Implement API post
  }

  updateGeneralParams(params: GeneralParams) {
    this.generalParams.set(params);
  }
}
