export async function getUsuarios() {
    let datos  = await ajax({
        url: `/api/usuarios/getAll/${parseInt(page)}`
    })

    usuarios = datos.datos
    next = datos.next

    return {
        datos: usuarios,
        next
    }
}

export async function getRoles() {
    let datos  = await ajax({
        url: `/api/roles/getAll`
    })

    roles = datos
    return roles
}

async function getUbicaciones(nombre=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/ubicaciones/getAll/${page}?nombre=${nombre}`
    })

    ubicaciones = datos.datos
    next = datos.next

    return {
        
    }
}