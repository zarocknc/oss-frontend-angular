import { Injectable, signal, computed } from '@angular/core';

export interface Employee {
  id: string;
  name: string;
  email: string;
  dni: string;
}

export interface Asset {
  id: string;
  type: string; // Laptop, Monitor
  brand: string;
  model: string;
  series: string;
  state: 'Nuevo' | 'Usado' | 'Malo';
  status: 'assigned' | 'available' | 'maintenance';
  location?: string; // Almacen
  inventoryCode?: string; // Inv.
  gama?: string; // Gama A, Gama B
}

export interface ReplacementRecord {
  id: string;
  date: string;
  ticket: string;
  employee: Employee;
  originalAsset: Asset;
  newAsset: Asset;
  reportUrl?: string; // Valid link to file
  observations?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReplacementService {
  // Mock Data
  private _employees = signal<Employee[]>([
    { id: '1', name: 'Ana Martinez', email: 'ana.martinez@emp.com', dni: '45678901' },
    { id: '2', name: 'Carlos Lopez', email: 'carlos.lopez@emp.com', dni: '12345678' }
  ]);

  private _assets = signal<Asset[]>([
    // Assigned to Ana
    { id: 'a1', type: 'Laptop', brand: 'HP', model: 'Probook 440 g8', series: '5CD2782JK2', state: 'Usado', status: 'assigned' },
    { id: 'a2', type: 'Monitor', brand: 'HP', model: 'Probook 440 g8', series: '5CD2782J98', state: 'Usado', status: 'assigned' },
    // Available
    { id: 's1', type: 'Laptop', brand: 'HP', model: 'Probook 640 G8', series: '5CD980933', state: 'Usado', status: 'available', location: 'San Isidro', inventoryCode: 'EURP083', gama: 'Gama B' },
    { id: 's2', type: 'Laptop', brand: 'HP', model: 'Probook 640 G8', series: '5CD980934', state: 'Nuevo', status: 'available', location: 'Miraflores', inventoryCode: 'EURP084', gama: 'Gama A' },
    { id: 's3', type: 'Laptop', brand: 'Dell', model: 'Latitude 5420', series: 'DL980935', state: 'Nuevo', status: 'available', location: 'San Isidro', inventoryCode: 'EURP085', gama: 'Gama A' },
    { id: 's4', type: 'Monitor', brand: 'Dell', model: 'P2419H', series: 'DL980936', state: 'Usado', status: 'available', location: 'San Isidro', inventoryCode: 'EURP086', gama: 'Gama B' },
  ]);

  // Use a map to track assignments: EmployeeId -> AssetId[]
  // For mock, just hardcode
  private _assignments = signal<{ [employeeId: string]: string[] }>({
    '1': ['a1', 'a2']
  });

  private _replacements = signal<ReplacementRecord[]>([
    {
      id: 'r1', date: '2023-11-25', ticket: 'req09283',
      employee: { id: '1', name: 'Ana Martinez', email: 'ana.martinez@emp.com', dni: '45678901' },
      originalAsset: { id: 'old_1', type: 'Laptop', brand: 'HP', model: 'Probook 440 g8', series: '5CD8786YT56', state: 'Usado', status: 'assigned' }, // Historical data
      newAsset: { id: 'new_1', type: 'Laptop', brand: 'HP', model: 'Probook 440 g9', series: '5CD8786YT78', state: 'Nuevo', status: 'assigned' }, // Historical data
      reportUrl: '#'
    }
  ]);

  // Read-only signals or computed logic can be exposed
  replacements = this._replacements.asReadonly();

  searchEmployee(query: string): Employee | undefined {
    const q = query.toLowerCase();
    return this._employees().find(e => e.dni.includes(q) || e.email.toLowerCase().includes(q) || e.name.toLowerCase().includes(q));
  }

  getAssignedAssets(employeeId: string): Asset[] {
    const assetIds = this._assignments()[employeeId] || [];
    return this._assets().filter(a => assetIds.includes(a.id));
  }

  getAvailableAssets(filters?: { location?: string, series?: string, state?: string, model?: string }): Asset[] {
    return this._assets().filter(a => {
      if (a.status !== 'available') return false;
      if (filters?.location && a.location !== filters.location) return false;
      if (filters?.series && !a.series.toLowerCase().includes(filters.series.toLowerCase())) return false;
      if (filters?.state && a.state !== filters.state) return false;
      if (filters?.model && !a.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      return true;
    });
  }

  createReplacement(data: Omit<ReplacementRecord, 'id'>) {
    const newRecord: ReplacementRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    this._replacements.update(list => [newRecord, ...list]);
    
    // In a real app, we would update asset status here
    // For mock, we can swap them if we want, but just recording it is enough for the UI flow
    console.log('Replacement Created', newRecord);
  }
}
