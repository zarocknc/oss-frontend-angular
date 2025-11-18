import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { LucideAngularModule } from 'lucide-angular'; // Para los iconos

// Importaciones locales
import { Colaborador } from './interfaces/colaborador.interface';
import { Activo } from './interfaces/activo.interface';
import { ColaboradorService } from './services/colaborador.service';
import { ActivoService } from './services/activo.service';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule // Asegúrate de importar esto
  ],
  templateUrl: './asignaciones.component.html',
})
export class AsignacionesComponent implements OnInit {

  // === Inyección de Dependencias (Estilo moderno) ===
  // Esto es como Angular "entrega" los servicios al componente
  private colaboradorService = inject(ColaboradorService);
  private activoService = inject(ActivoService);

  // === Estado del Componente ===
  // Búsqueda
  public searchDni: string = '';
  public searchCorreo: string = '';
  public fechaAsignacion: string = new Date().toISOString().split('T')[0];

  // Resultados
  public colaborador: Colaborador | null = null;
  public activosDisponibles: Activo[] = [];
  public activoSeleccionado: Activo | null = null;

  public isLoadingSearch: boolean = false;

  ngOnInit(): void {
    // Podríamos cargar algo al inicio si fuera necesario
    // this.cargarActivosDisponibles('default'); // O esperar a tener un perfil
  }

  buscarColaborador(): void {
    if (!this.searchDni && !this.searchCorreo) {
      alert('Por favor, ingrese DNI o Correo');
      return;
    }

    this.isLoadingSearch = true;
    this.colaborador = null;
    this.activosDisponibles = [];

    this.colaboradorService.buscarColaborador(this.searchDni, this.searchCorreo)
      .subscribe(colab => {
        this.colaborador = colab;
        this.isLoadingSearch = false;

        // Si encontramos un colaborador, buscamos activos para su perfil
        if (colab) {
          this.cargarActivosDisponibles(colab.perfil);
        }
      });
  }

  cargarActivosDisponibles(perfil: string): void {
    this.activoService.getActivosDisponibles(perfil)
      .subscribe(activos => {
        this.activosDisponibles = activos;
      });
  }

  seleccionarActivo(activo: Activo): void {
    this.activoSeleccionado = activo;
  }

  nuevaAsignacion(): void {
    // Resetear formulario para nueva asignación
    this.colaborador = null;
    this.activosDisponibles = [];
    this.activoSeleccionado = null;
    this.searchDni = '';
    this.searchCorreo = '';
    this.fechaAsignacion = new Date().toISOString().split('T')[0];
  }

  asignarYGuardar(): void {
    if (!this.colaborador || !this.activoSeleccionado) {
      alert('Debe seleccionar un colaborador y un activo.');
      return;
    }

    console.log('--- Asignación Creada (Mock) ---');
    console.log('Colaborador:', this.colaborador.nombres);
    console.log('Activo:', this.activoSeleccionado.serie);
    console.log('Fecha:', this.fechaAsignacion);

    // Aquí iría la llamada al servicio para "guardar" la asignación
    // this.asignacionService.crearAsignacion(...)

    alert('Asignación guardada exitosamente (simulación)');

    // Limpiar vista
    this.nuevaAsignacion();
  }
}
