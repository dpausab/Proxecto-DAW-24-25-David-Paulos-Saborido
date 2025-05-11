// Función que generaliza de forma asíncrona el uso de fetch, permitiendo pasar como parámetros tanto el método HTTP como el cuerpo de la petición.
export async function ajax(options) {
    const {url, method, data} = options

    try {
        const resp = await fetch(url, {
            method: method ?? "GET",
            headers: {
                'Content-Type':'application/json'
            },
            body: data ? JSON.stringify(data) : null
        })

        if (!resp.ok) {
            throw new Error(`Error ${resp.status} - ${resp.statusText}`)
        } 

        const json = await resp.json()
        return json
    } catch(error) {
        console.log(error.message)
        throw error
    }
}