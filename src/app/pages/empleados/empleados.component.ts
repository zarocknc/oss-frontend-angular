import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Plus, MapPin, User, Calendar, Briefcase, Mail } from 'lucide-angular';
import { EmployeeService, Employee, AssignedAsset } from './services/employee.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col">
      <!-- Header -->
       <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm mb-6">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
           Módulo Empleados
        </h1>
        <button class="btn btn-primary text-white gap-2 shadow-md">
          <lucide-icon name="plus" [size]="18"></lucide-icon>
          Nuevo Empleado
        </button>
      </div>

      <!-- Content Grid -->
      <div class="flex flex-1 gap-6 overflow-hidden">
        
        <!-- List Panel (Left) -->
        <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col min-w-0">
          
          <!-- Filters -->
          <div class="p-4 border-b border-gray-100 flex gap-4">
             <label class="input input-bordered flex items-center gap-2 w-full">
                <lucide-icon name="search" [size]="18" class="opacity-50"></lucide-icon>
                <input 
                  type="text" 
                  placeholder="Buscar Empleado" 
                  class="grow" 
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="filter()"
                />
            </label>
            <select class="select select-bordered w-40" [(ngModel)]="locationFilter" (ngModelChange)="filter()">
              <option value="">Todas Sedes</option>
              <option value="San Borja">San Borja</option>
              <option value="Miraflores">Miraflores</option>
              <option value="Surco">Surco</option>
            </select>
          </div>

          <!-- Table -->
          <div class="flex-1 overflow-auto">
            <table class="table table-pin-rows">
              <thead>
                <tr class="text-gray-600 bg-gray-50">
                  <th>DNI</th>
                  <th>Nombre y Ape.</th>
                  <th>Cargo</th>
                  <th>Sede</th>
                  <th>Fecha Ingreso</th>
                </tr>
              </thead>
              <tbody>
                @for (emp of filteredEmployees(); track emp.id) {
                  <tr 
                    class="hover:bg-blue-50 cursor-pointer transition-colors"
                    [class.bg-blue-100]="selectedEmployee()?.id === emp.id"
                    (click)="selectEmployee(emp)"
                  >
                    <td class="font-mono text-gray-500">{{ emp.dni }}</td>
                    <td class="font-medium text-gray-900">{{ emp.name }}</td>
                    <td>{{ emp.position }}</td>
                    <td>
                      <div class="badge badge-ghost gap-1">
                        {{ emp.location }}
                      </div>
                    </td>
                    <td class="text-gray-500 text-sm">{{ emp.startDate }}</td>
                  </tr>
                }
                @if (filteredEmployees().length === 0) {
                  <tr>
                    <td colspan="5" class="text-center py-10 text-gray-400">
                      No se encontraron empleados
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Details Panel (Right) -->
        @if (selectedEmployee(); as emp) {
          <div class="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
            
            <!-- Profile Info -->
            <div class="p-8 flex flex-col items-center border-b border-gray-100 bg-linear-to-b from-gray-50 to-white">
              <div class="avatar placeholder mb-4">
                <div class="bg-blue-500 text-white rounded-full w-24 text-3xl shadow-lg ring ring-blue-100 ring-offset-2">
                  <span>{{ getInitials(emp.name) }}</span>
                </div>
              </div>
              <h2 class="text-xl font-bold text-gray-800 text-center">{{ emp.name }}</h2>
              <p class="text-sm text-blue-600 font-medium">{{ emp.position }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ emp.email }}</p>
            </div>

            <div class="p-6 space-y-4 flex-1 overflow-y-auto">
              
              <!-- Details List -->
              <div class="space-y-3 pb-6 border-b border-dashed border-gray-200">
                <h3 class="font-bold text-gray-500 text-xs uppercase mb-3">Datos Generales</h3>
                
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Puesto:</span>
                  <span class="font-medium text-gray-700">{{ emp.position }}</span>
                </div>
                 <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Perfil:</span>
                  <span class="font-medium text-gray-700">{{ emp.profile }}</span>
                </div>
                 <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Area:</span>
                  <span class="font-medium text-gray-700">{{ emp.area }}</span>
                </div>
                 <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Sede:</span>
                  <span class="font-medium text-gray-700">{{ emp.location }}</span>
                </div>
              </div>

               <!-- Assets -->
               <div>
                  <h3 class="font-bold text-gray-800 text-sm mb-3">Activos Asignados</h3>
                  @if (assignedAssets().length > 0) {
                    <div class="space-y-2">
                      @for (asset of assignedAssets(); track asset.id) {
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                          <div class="flex justify-between mb-1">
                             <span class="font-semibold text-gray-700">{{ asset.type }}</span>
                             <span class="badge badge-xs badge-success badge-outline">{{ asset.state }}</span>
                          </div>
                          <div class="text-gray-500 text-xs">{{ asset.model }}</div>
                          <div class="text-gray-400 text-[10px] font-mono mt-1">{{ asset.series }}</div>
                        </div>
                      }
                    </div>
                  } @else {
                     <div class="text-center py-4 bg-gray-50 rounded text-xs text-gray-400 italic">
                       Sin activos asignados
                     </div>
                  }
               </div>

            </div>

             <!-- Actions Footer -->
            <div class="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
              <button class="btn btn-primary btn-sm text-white w-full">Ver Historial de Movimientos</button>
              <button class="btn btn-error btn-outline btn-sm w-full">Cesar Empleado</button>
            </div>

          </div>
        } @else {
           <div class="w-96 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-8">
              <div class="bg-white p-4 rounded-full mb-4 shadow-sm">
                <lucide-icon name="user" [size]="32" class="text-gray-300"></lucide-icon>
              </div>
              <h3 class="font-bold text-gray-400">Ningún empleado seleccionado</h3>
              <p class="text-sm text-gray-400 mt-2">Seleccione un empleado de la lista para ver sus detalles y activos.</p>
           </div>
        }

      </div>
    </div>
  `
})
export class EmpleadosComponent {
  private employeeService = inject(EmployeeService);

  searchQuery = '';
  locationFilter = '';

  selectedEmployee = signal<Employee | null>(null);
  filteredEmployees = signal<Employee[]>([]);
  assignedAssets = computed(() => {
    const emp = this.selectedEmployee();
    if (!emp) return [];
    return this.employeeService.getEmployeeAssets(emp.id);
  });

  constructor() {
    this.filter(); // Initial load
  }

  filter() {
    this.filteredEmployees.set(
      this.employeeService.searchEmployees(this.searchQuery, this.locationFilter)
    );
  }

  selectEmployee(emp: Employee) {
    this.selectedEmployee.set(emp);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
