// Función que generaliza de forma asíncrona el uso de fetch, permitiendo pasar como parámetros tanto el método HTTP como el cuerpo de la petición.
export async function ajax(options, credentials=null) {
    const {url, method, data} = options
    let flag = false

    if (credentials) flag = true
    try {
        let resp = null
        if (flag) {
            resp = await fetch(url, {
                method: method ?? "GET",
                headers: {
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body: data ? JSON.stringify(data) : null
            })
        } else {
            resp = await fetch(url, {
                method: method ?? "GET",
                headers: {
                    'Content-Type':'application/json'
                },
                body: data ? JSON.stringify(data) : null
            })
        }

        const json = await resp.json()

        if (!resp.ok) {
            if (json.message) {
                throw new Error(`${json.message}`)
            } else {
                throw new Error(`Error ${resp.status} - ${resp.statusText}`)
            }
        } 

        return json
    } catch(error) {
        console.log(error.message)
        throw error
    }
}