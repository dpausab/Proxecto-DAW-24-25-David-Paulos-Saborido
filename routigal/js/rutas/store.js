export let store = {
    dom: {
        document: document,
        availeable: document.querySelector(".availeable"),
        selected: document.querySelector(".selected-ubis"),
        tramos: document.querySelector("#tramos"),
        form: document.querySelector(".params"),
        actualizacion: document.querySelector("#info-ubicaciones").querySelector("h4"),
        selects: {
            tecnico: document.querySelectorAll('select')[0],
            origen: document.querySelectorAll('select')[1],
            destino: document.querySelectorAll('select')[2],
            tiempo: document.querySelectorAll('select')[3]
        },
        inputs: {
            horaSalida: document.querySelector("#selectSalida"),
            nombreRuta: document.querySelector("#nombreRuta"),
            fecha: document.querySelector("#fechaRuta"),
            distanciaTotal: document.querySelector("#distanciaTotal"),
            tiempoTotal: document.querySelector("#tiempoTotal"),
            kmInicio: document.querySelector("#kmInicio"),
            kmFinal: document.querySelector("#kmFinal")
        },
        buttons: {
            guardar: document.querySelector("#guardar"),
            glpi: document.querySelector("#glpi")
        },
    },
    variables: {
        tickets: [],
        selected: [],
        tramos: [],
        tecnicos: [],
        ubicaciones: [],
        routeWaypoints: [],
        auxiliar: [],
        ticketsAsignados: [],
        ticketsCGE: [],
        ticketsDelete: [],
        rutaUpdate: null,
        ticketsMap: new Map(),
        ubicacionesMap: new Map(),
        dragElement: null,
        popups: null,
        btnsInfo: null,
        control: null,
        map: null,
        checks: null,
        start: null,
        end: null,
        idRuta: null,
        idItem: null,
        horaSalida: null,
        selects: null,
        distanciaRuta: 0,
        tiempoRuta: 0,
        flag: true,
        posible: true,
        update: false
    }
};