document.addEventListener("DOMContentLoaded", () => {
    const botonHamburguesa = document.querySelector('#boton-hamburguesa');
    const menu = document.querySelector('nav ul');
    
    botonHamburguesa.addEventListener("click", () => {
        menu.classList.toggle('show');
    })
})

