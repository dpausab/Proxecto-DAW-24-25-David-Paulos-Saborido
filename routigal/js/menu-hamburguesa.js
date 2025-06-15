// Script simple que gestiona la visualización del menú, en pantallas donde no quepa en la cabecera se mostrará un icono, desplegando el menú, cuando quepa se mostrará en linea.
document.addEventListener("DOMContentLoaded", () => {
    const botonHamburguesa = document.querySelector('#boton-hamburguesa');
    const menu = document.querySelector('nav ul');
    
    botonHamburguesa.addEventListener("click", () => {
        menu.classList.toggle('show');
    })
})

