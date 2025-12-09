import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { lastValueFrom } from 'rxjs'; // Import for better async handling

import { Activo } from './interfaces/activo.interface';
import { ActivoService } from './services/activo.service';
import { EmployeeService, Employee } from '../empleados/services/employee.service';
import { AsignacionService, AsignacionRequest } from './services/asignacion.service'; // Import new service

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './asignaciones.component.html',
})
export class AsignacionesComponent implements OnInit, AfterViewInit {

  private activoService = inject(ActivoService);
  private employeeService = inject(EmployeeService);
  private asignacionService = inject(AsignacionService); // Inject service
  private platformId = inject(PLATFORM_ID);

  // === Estado del Componente ===
  // Búsqueda
  public searchDni: string = '';
  public searchCorreo: string = '';
  public fechaAsignacion: string = new Date().toISOString().split('T')[0];

  // Resultados
  public colaborador: Employee | null = null;
  public activosDisponibles: Activo[] = [];
  public activoSeleccionado: Activo | null = null;

  public isLoadingSearch: boolean = false;
  
  // Loading state for save button
  // Loading state for save button
  public isSaving: boolean = false; 

  // === Tabs State ===
  public activeTab: 'nuevo' | 'historial' = 'nuevo';
  public historialAsignaciones: any[] = [];
  public isLoadingHistorial: boolean = false;

  // === Modal State ===
  public showModal: boolean = false;
  public modalFilters = {
    tipo: '',
    serie: '',
    estado: '',
    almacen: ''
  };

  // Pagination
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalItems: number = 0;
  public Math = Math; 

  // Mock Data for Modal
  public allModalData: Activo[] = []; 
  public filteredModalData: Activo[] = []; 
  public paginatedModalData: Activo[] = []; 

  ngOnInit(): void {
    this.generateMockData();
  }

  setActiveTab(tab: 'nuevo' | 'historial'): void {
    this.activeTab = tab;
    if (tab === 'historial') {
      this.loadHistorial();
    }
  }

  loadHistorial(): void {
    this.isLoadingHistorial = true;
    this.asignacionService.getHistorial().subscribe({
      next: (data) => {
        this.historialAsignaciones = data;
        this.isLoadingHistorial = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.isLoadingHistorial = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('cally');
    }
  }

  generateMockData(): void {
    const tipos = ['Laptop', 'Monitor', 'Teclado', 'Mouse', 'Docking Station'];
    const marcas = ['HP', 'Dell', 'Lenovo', 'Apple', 'Logitech'];
    const estados: ('Disponible' | 'Asignado' | 'Mantenimiento' | 'En Revisión' | 'Malo')[] = ['Disponible', 'Asignado', 'Mantenimiento', 'En Revisión', 'Malo'];
    const gamas: ('Baja' | 'Media' | 'Alta')[] = ['Baja', 'Media', 'Alta'];

    this.allModalData = Array.from({ length: 50 }, (_, i) => ({
      id: `ACT-${i + 1}`,
      serie: `SERIE-${1000 + i}`,
      codigoInventario: `INV-${2000 + i}`,
      tipoEquipo: tipos[Math.floor(Math.random() * tipos.length)],
      marca: marcas[Math.floor(Math.random() * marcas.length)],
      modelo: `Modelo ${Math.floor(Math.random() * 100)}`,
      estado: estados[Math.floor(Math.random() * estados.length)],
      gama: gamas[Math.floor(Math.random() * gamas.length)]
    }));

    this.filterModalData();
  }

  // === Modal Actions ===
  openModal(): void {
    this.showModal = true;
    this.currentPage = 1;
    this.modalFilters = { tipo: '', serie: '', estado: '', almacen: '' };
    this.filterModalData();
  }

  closeModal(): void {
    this.showModal = false;
  }

  filterModalData(): void {
    this.filteredModalData = this.allModalData.filter(item => {
      const matchTipo = !this.modalFilters.tipo || item.tipoEquipo === this.modalFilters.tipo;
      const matchSerie = !this.modalFilters.serie || item.serie.toLowerCase().includes(this.modalFilters.serie.toLowerCase());
      const matchEstado = !this.modalFilters.estado || item.estado === this.modalFilters.estado;
      return matchTipo && matchSerie && matchEstado;
    });
    this.totalItems = this.filteredModalData.length;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedModalData = this.filteredModalData.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalItems / this.itemsPerPage)) return;
    this.currentPage = page;
    this.updatePagination();
  }

  selectActivoFromModal(activo: Activo): void {
    this.activoSeleccionado = activo;
    if (!this.activosDisponibles.find(a => a.id === activo.id)) {
      this.activosDisponibles = [activo, ...this.activosDisponibles];
    }
    this.closeModal();
  }

  buscarColaborador(): void {
    if (!this.searchDni && !this.searchCorreo) {
      alert('Por favor, ingrese DNI o Correo');
      return;
    }

    this.isLoadingSearch = true;
    this.colaborador = null;
    this.activosDisponibles = [];

    // Search in the signal from EmployeeService
    const employees = this.employeeService.employees();
    const found = employees.find(e => 
      (this.searchDni && e.dni === this.searchDni) ||
      (this.searchCorreo && e.email.toLowerCase() === this.searchCorreo.toLowerCase())
    );

    // Simulate delay for UX or just set immediately
    setTimeout(() => {
      this.colaborador = found || null;
      this.isLoadingSearch = false;

      if (this.colaborador) {
        this.cargarActivosDisponibles(this.colaborador.profile || 'Estándar');
        // Clear inputs if needed, or keep for context
      } else {
        // Optional: toast or alert
        console.warn('Colaborador no encontrado');
      }
    }, 500); 
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
    this.isSaving = false;
  }

  asignarYGuardar(): void { // No async here to fit Angular structure, use subscribe
    if (!this.colaborador || !this.activoSeleccionado) {
      alert('Debe seleccionar un colaborador y un activo.');
      return;
    }

    if (this.isSaving) return;
    this.isSaving = true;

    const request: AsignacionRequest = {
      dispositivoId: parseInt(this.activoSeleccionado.id, 10), // Converting string ID to number
      empleadoId: parseInt(this.colaborador.id, 10),
      fechaAsignacion: this.fechaAsignacion,
      observacionesAsignacion: 'Asignación creada desde frontend', // Input field could be added later
      usuarioAsignaId: 1 // HC for now as per plan
    };

    console.log('--- Enviando Asignación ---', request);

    this.asignacionService.crearAsignacion(request).subscribe({
      next: (response) => {
        console.log('Respuesta Exitosa:', response);
        alert('Asignación guardada exitosamente');
        this.nuevaAsignacion();
      },
      error: (err) => {
        console.error('Error al guardar asignación:', err);
        alert('Error al guardar la asignación. Verifique los datos e intente nuevamente.');
        this.isSaving = false;
      }
    });
  }
}
