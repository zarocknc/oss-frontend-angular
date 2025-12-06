import { Injectable, signal, computed } from '@angular/core';

export interface AssignedAsset {
  id: string;
  type: string; // Laptop, Monitor
  model: string;
  series: string;
  state: 'Nuevo' | 'Usado' | 'Malo';
  gama?: string;
}

export interface Employee {
  id: string;
  dni: string;
  name: string;
  email: string;
  position: string; // Cargo/Puesto
  area: string;
  location: string; // Sede: San Borja, etc
  startDate: string; // Fecha Ingreso
  profile: string; // Perfil (Empleado, Externo, etc)
  avatarUrl?: string;
  status: 'active' | 'terminated';
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private _employees = signal<Employee[]>([
    { 
      id: '1', 
      dni: '46787632', 
      name: 'Ana Gomez', 
      email: 'ana.gomez@empresa.pe', 
      position: 'Analista TI', 
      area: 'Oper. TI', 
      location: 'San Borja', 
      startDate: '2008-12-23', 
      profile: 'Empleado',
      status: 'active'
    },
    { 
      id: '2', 
      dni: '42345678', 
      name: 'Carlos Perez', 
      email: 'carlos.perez@empresa.pe', 
      position: 'Desarrollador', 
      area: 'Desarrollo', 
      location: 'Miraflores', 
      startDate: '2015-05-10', 
      profile: 'Empleado',
      status: 'active'
    },
    { 
      id: '3', 
      dni: '12345678', 
      name: 'Maria Rodriguez', 
      email: 'maria.rodriguez@empresa.pe', 
      position: 'Analista QA', 
      area: 'Calidad', 
      location: 'San Borja', 
      startDate: '2020-01-15', 
      profile: 'Externo',
      status: 'active'
    },
  ]);

  // Mock Asset Assignments
  private _assets = signal<{ [employeeId: string]: AssignedAsset[] }>({
    '1': [
      { id: 'l1', type: 'Laptop', model: 'Probook 440 g8', series: '5CD274YHRR', state: 'Usado', gama: 'Gama A' },
      { id: 'm1', type: 'Monitor', model: 'Dell P2419H', series: 'CN-0D', state: 'Usado', gama: 'Gama B' }
    ],
    '2': [
      { id: 'l2', type: 'Laptop', model: 'MacBook Pro', series: 'FVFX...', state: 'Nuevo', gama: 'Gama A+' }
    ]
  });

  employees = this._employees.asReadonly();

  searchEmployees(query: string, locationFilter: string): Employee[] {
    const q = query.toLowerCase();
    return this._employees().filter(e => {
      const matchesQuery = e.name.toLowerCase().includes(q) || e.dni.includes(q) || e.email.toLowerCase().includes(q);
      const matchesLocation = locationFilter ? e.location === locationFilter : true;
      return matchesQuery && matchesLocation;
    });
  }

  getEmployeeAssets(employeeId: string): AssignedAsset[] {
    return this._assets()[employeeId] || [];
  }

  addEmployee(employee: Omit<Employee, 'id'>) {
    const newEmp = { ...employee, id: Math.random().toString(36).substr(2, 9) };
    this._employees.update(list => [...list, newEmp]);
  }
}
