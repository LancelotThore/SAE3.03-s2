import { Event } from './event.js';

class EventManager {
    #id;
    #name;
    #description;
    #events;

    constructor(id, name, description) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#events = [];
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    addEvents(events) {
        for (let uid in events) {
            let event = events[uid];

            // Crée un nouvel objet Event avec la semaine calculée
            const newEvent = new Event(
                uid,
                event.summary,
                event.description,
                event.start,
                event.end,
                event.location
            );

            // Ajoute l'événement à la liste des événements de l'EventManager
            this.#events.push(newEvent);
        }
    }

    // retourne tous les événements de l'agenda dans un tableau d'objet dont les propriétés sont compatibles avec Toast UI Calendar
    // (voir https://nhn.github.io/tui.calendar/latest/EventObject). On ajoute juste une propriété calendarId pour que Toast UI Calendar
    // puisse identifier l'agenda auquel appartient l'événement
    toObject() {
        return this.#events.map(event => {
            let obj = event.toObject();
            obj.calendarId = this.#id;
            obj.week = event.week;
            obj.groups = event.groups;
            obj.duree = event.duree;
            obj.semestre = event.semestre;
            obj.category = event.category;
            obj.heurefin = event.heurefin;
            obj.end = event.end;
            obj.day = event.day;
            return obj;
        });
    }

    filterEvents(critere, value) {
        let res = [];
    
        if (critere === 'group') {
            res = this.#events.filter(event => event.groups.includes(value));
        }
        else if (critere === 'day') {
            res = this.#events.filter(event => event.day.includes(value)); // Attention ici, la propriété 'day' n'existe pas dans vos objets d'événements. Peut-être vouliez-vous utiliser 'start' ou 'end'?
        }
    
        return res.map(event => {
            let obj = event.toObject();
            obj.calendarId = this.#id;
            return obj;
        });
    }    
}

export { EventManager };