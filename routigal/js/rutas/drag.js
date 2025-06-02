import { store } from './store.js'
import { renderSelected } from './render.js'
import { calcularRuta } from './rutas.js'

const { dom: DOM, variables: VARIABLES } = store;

export function handleDragStart(e) {
    this.style.opacity = '0.4';
    VARIABLES.dragElement = this
    VARIABLES.idItem = VARIABLES.dragElement.dataset.id
  }
export function handleDragEnd(e) {
    this.style.opacity = '1';

    document.querySelectorAll(".selected .row").forEach(function (item) {
      item.classList.remove('over');
    });
  }
export function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }
export function handleDragEnter(e) {
    this.classList.add('over');
  }
export function handleDragLeave(e) {
    this.classList.remove('over');
  }
export function handleDrop(e) {
    e.stopPropagation(); 

    if (VARIABLES.dragElement !== this) {
        let old = VARIABLES.selected[this.dataset.id]
        VARIABLES.selected[this.dataset.id] = VARIABLES.selected[VARIABLES.idItem]
        VARIABLES.selected[VARIABLES.idItem] = old
        renderSelected(VARIABLES.selected)
        calcularRuta()
    }
    return false;
  }