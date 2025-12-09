import { Injectable, signal } from '@angular/core';

export interface DashboardStats {
  totalEmpleados: number;
  activosProduccion: number;
  activosPendientesDevolucion: number;
  empleadosCesados: number;
}

export interface AssetStatusDistribution {
  asignado: number;
  baja: number;
  disponible: number;
  mantenimiento: number;
}

export interface RecentActivity {
  id: number;
  empleado: string;
  movimiento: string;
  sede: string;
  fecha: string; // ISO date string or formatted
  equipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Mock Data Signals
  stats = signal<DashboardStats>({
    totalEmpleados: 10,
    activosProduccion: 10,
    activosPendientesDevolucion: 1,
    empleadosCesados: 2
  });

  distribution = signal<AssetStatusDistribution>({
    asignado: 10,  // Blue
    baja: 1,       // Red (Mocked, 1 damaged)
    disponible: 4, // Green (1002, 2001, 3003, 4003)
    mantenimiento: 1 // Orange/Yellow (1004 In Repair)
  });

  recentActivities = signal<RecentActivity[]>([
    { id: 1, empleado: 'sofia.m@upc.edu.pe', movimiento: 'Devolución', sede: 'San Isidro', fecha: '2023-05-15', equipo: 'Teclado Logitech' },
    { id: 2, empleado: 'sofia.m@upc.edu.pe', movimiento: 'Préstamo', sede: 'San Isidro', fecha: '2023-05-11', equipo: 'Teclado Logitech' },
    { id: 3, empleado: 'claudio.pizarro@upc.edu.pe', movimiento: 'Asignación', sede: 'Callao', fecha: '2023-04-15', equipo: 'Galaxy Tab S7' },
    { id: 4, empleado: 'gianmarco@upc.edu.pe', movimiento: 'Asignación', sede: 'Monterrico', fecha: '2023-03-05', equipo: 'MacBook Pro M1' },
    { id: 5, empleado: 'susana.baca@upc.edu.pe', movimiento: 'Renovación', sede: 'Miraflores', fecha: '2023-02-20', equipo: 'EliteBook 840' },
    { id: 6, empleado: 'ricardo.palma@upc.edu.pe', movimiento: 'Ingreso Nuevo', sede: 'San Isidro', fecha: '2023-01-20', equipo: 'Dell Latitude 7420' }
  ]);

  constructor() {
    // In a real implementation, we would fetch data here or in a method
    // this.fetchDashboardData();
  }
}
