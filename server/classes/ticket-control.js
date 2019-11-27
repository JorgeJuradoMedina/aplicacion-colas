// grabar en el archivo
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;

    }
}

class TicketControl {
    // nota: es recomendable que todas las classes contengan un constructor
    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();

        // crear un arreglo el cual contendra todos los ticket penientes generados antes
        this.tickets = [];
        this.ultimos4 = [];
        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {

            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();

        }

    }

    siguiente() {
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;

    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }
    getUltimos4() {
        return this.ultimos4;
    }
    atenderTicket(escritorio) {
        // se verifica si hay tickets pendientes por atender
        if (this.tickets.length === 0) {
            return 'No hay tickets';

        }
        // estraigo un numero delos arreglos
        let numeroTicket = this.tickets[0].numero;

        this.tickets.shift();
        // creo un nuevo ticket el cual sera atendido
        let atenderTicket = new Ticket(numeroTicket, escritorio);
        this.ultimos4.unshift(atenderTicket);
        // verifico que solo aya 4 tickets en ventana
        if (this.ultimos4.length > 4) {
            // esta parte elimina el ticket ya atendido para poder ingresar uno nuevo en el arreglo de 4
            this.ultimos4.splice(-1, 1);

        }
        console.log('ultimos 4');
        console.log(this.ultimos4);
        this.grabarArchivo();
        return atenderTicket;
    }


    reiniciarConteo() {
        this.ultimo = 0;
        // almoneto de reiniciar el conteo se reinicia el arreglo de tickets
        this.tickets = [];
        this.ultimos4 = [];
        console.log('Se ha inicializado el sistema')

        this.grabarArchivo();

    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4

        };

        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }


}

module.exports = {
    TicketControl
}