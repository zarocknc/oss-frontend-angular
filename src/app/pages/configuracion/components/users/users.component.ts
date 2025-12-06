import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-users-config',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
       <!-- Header -->
       <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Bo</h2>
          <button class="btn btn-primary text-white shadow-lg gap-2" (click)="addUser()">
             <lucide-icon name="plus" size="18"></lucide-icon>
             Nuevo Usuario
          </button>
       </div>

       <!-- Table -->
       <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="table w-full">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
               <tr>
                  <th>Nombre Completo</th>
                  <th>Correo Institucional</th>
                  <th>Rol Asignado</th>
                  <th>Estado</th>
                  <th class="text-end">Acciones</th>
               </tr>
            </thead>
            <tbody>
               @for (user of users(); track user.id) {
                  <tr class="hover:bg-gray-50 border-b border-gray-100">
                     <td class="font-medium text-gray-800">{{ user.name }}</td>
                     <td class="text-gray-600 font-mono text-sm">{{ user.email }}</td>
                     <td>
                        <span class="badge badge-sm badge-outline font-bold text-xs">{{ user.role }}</span>
                     </td>
                     <td>
                        <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                           {{ user.status }}
                        </span>
                     </td>
                     <td class="text-end">
                        <button class="btn btn-link btn-xs text-blue-600 no-underline">EDITAR</button>
                     </td>
                  </tr>
               }
            </tbody>
          </table>
       </div>
    </div>
  `
})
export class UsersComponent {
  private configService = inject(ConfigurationService);
  users = this.configService.users;

  addUser() {
      // Mock Action
      this.configService.addUser({
          name: 'NUEVO USUARIO',
          email: 'NUEVO@EMPRESA.PE',
          role: 'GESTOR DE ACTIVOS',
          status: 'ACTIVO'
      });
  }
}
