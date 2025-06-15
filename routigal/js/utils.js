// Función simple que formatea los segundos a horas y minutos.
export function formatearTiempo(segundos) {
    let horas = parseFloat(Math.floor(segundos/3600)).toString().padStart(2, "0")
    let minutos = parseFloat(Math.floor(((segundos) - (horas*3600)) / 60)).toString().padStart(2, "0")
    
    return `${horas}:${minutos}`.trim();
}
// Función simple de formateo de horas, para recoger las horas de la BBDD y la hora de inicio.
export function formatearHoras(hora) {
    let [horas, minutos] = hora.split(':').map(Number)
    return horas*3600+minutos*60
}

// Función que retorna el valor de la fecha de hoy en nuestro huso horario.
export function getToday() {
    return new Date().toLocaleDateString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('/').reverse().join('-')
}
