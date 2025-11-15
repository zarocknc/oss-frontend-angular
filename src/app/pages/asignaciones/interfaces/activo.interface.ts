export interface Activo {
  id: string;
  serie: string;
  codigoInventario: string;
  tipoEquipo: string; // Ej: 'Laptop'
  marca: string;
  modelo: string;
  estado: 'Disponible' | 'Asignado' | 'Mantenimiento'; // [Flujos.pdf source 2]
  gama: 'Baja' | 'Media' | 'Alta'; // [Flujos.pdf source 2]
}
