// ==========================
// CLASES (POO)
// ==========================
class Tarea {
  constructor({ id, descripcion, estado = 'pendiente', fechaCreacion, fechaLimite = null }) {
    this.id = id || crypto.randomUUID();
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.fechaLimite = fechaLimite;
  }

  toggleEstado() {
    this.estado = this.estado === 'pendiente' ? 'completada' : 'pendiente';
  }

  isCompletada() {
    return this.estado === 'completada';
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];
    this.cargarDesdeLocalStorage();
    this.filtroActual = 'todas';
    this.terminoBusqueda = '';
  }

  agregarTarea(tarea) {
    this.tareas.unshift(tarea);
    this.guardarEnLocalStorage();
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardarEnLocalStorage();
  }

  toggleEstadoTarea(id) {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.toggleEstado();
      this.guardarEnLocalStorage();
    }
  }

  obtenerTodasLasTareas() {
    return this.tareas;
  }

  obtenerTareasFiltradas() {
    let resultado = this.tareas;

    if (this.filtroActual === 'pendientes') {
      resultado = resultado.filter(t => !t.isCompletada());
    } else if (this.filtroActual === 'completadas') {
      resultado = resultado.filter(t => t.isCompletada());
    }

    if (this.terminoBusqueda) {
      const terminoLower = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(t => t.descripcion.toLowerCase().includes(terminoLower));
    }

    return resultado;
  }

  guardarEnLocalStorage() {
    localStorage.setItem('taskflow_data', JSON.stringify(this.tareas));
  }

  cargarDesdeLocalStorage() {
    const data = localStorage.getItem('taskflow_data');
    if (data) {
      try {
        this.tareas = JSON.parse(data).map(t => new Tarea(t));
      } catch (e) {
        console.error('Error parseando localStorage: ', e);
        this.tareas = [];
      }
    }
  }
}

// ==========================
// CONSTANTES Y ESTADO
// ==========================
const gestor = new GestorTareas();
const temporizadores = new Map();

const form = document.getElementById('task-form');
const inputDesc = document.getElementById('task-desc');
const inputDate = document.getElementById('task-deadline');
const btnSubmit = document.getElementById('btn-submit');
const spinnerSubmit = document.getElementById('submit-spinner');
const listaDOM = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('task-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toast-container');
const apiLoading = document.getElementById('api-loading');