import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-[#3b82f6]">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="avatar mb-4">
            <div class="w-24 rounded-full bg-blue-100 p-4 ring ring-primary ring-offset-base-100 ring-offset-2">
               <lucide-icon name="user" class="h-full w-full text-blue-500"></lucide-icon>
            </div>
          </div>
          <h2 class="card-title mb-6">Ingresar al Sistema</h2>
          
          <div class="form-control w-full max-w-xs">
            <label class="input input-bordered flex items-center gap-2 mb-4">
              <input type="text" class="grow" placeholder="Usuario" />
              <lucide-icon name="user" class="h-4 w-4 opacity-70"></lucide-icon>
            </label>
            
            <label class="input input-bordered flex items-center gap-2 mb-6">
              <input [type]="showPassword() ? 'text' : 'password'" class="grow" placeholder="Contraseña" />
              <button type="button" (click)="togglePassword()">
                <lucide-icon [name]="showPassword() ? 'eye' : 'eye-off'" class="h-4 w-4 opacity-70"></lucide-icon>
              </button>
            </label>

            <button class="btn btn-primary w-full text-white bg-blue-500 hover:bg-blue-600 border-none">Ingresar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
