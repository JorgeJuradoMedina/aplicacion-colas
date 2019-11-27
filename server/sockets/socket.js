const { io } = require('../server');

const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    // emitir un evento 'estado actual'
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });
    client.on('antenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });

        }
        let antenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(antenderTicket);
        // actualizar / notificar cambios en los ultimos 4

        client.broadcast.emit('ultimos4', {
                ultimos4: ticketControl.getUltimos4()
            })
            // emitir 'ultimos4'

    })


});