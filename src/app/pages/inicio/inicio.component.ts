import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from '../page.component';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PageComponent, CommonModule, LucideAngularModule],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  private dashboardService = inject(DashboardService);
  
  stats = this.dashboardService.stats;
  recentActivities = this.dashboardService.recentActivities;
  distribution = this.dashboardService.distribution;

  chartSegments = computed(() => {
    const dist = this.distribution();
    const total = dist.asignado + dist.baja + dist.disponible + dist.mantenimiento;
    
    if (total === 0) return { asignado: 0, baja: 0, disponible: 0 };

    const asignadoPct = (dist.asignado / total) * 100;
    const bajaPct = (dist.baja / total) * 100;
    const disponiblePct = (dist.disponible / total) * 100;
    
    return {
      asignado: asignadoPct, 
      baja: asignadoPct + bajaPct,
      disponible: asignadoPct + bajaPct + disponiblePct
    };
  });

  chartBackground = computed(() => {
    const s = this.chartSegments();
    return `conic-gradient(
      #3b82f6 0% ${s.asignado}%, 
      #ef4444 ${s.asignado}% ${s.baja}%, 
      #22c55e ${s.baja}% ${s.disponible}%, 
      #fbbf24 ${s.disponible}% 100%
    )`;
  });
}
