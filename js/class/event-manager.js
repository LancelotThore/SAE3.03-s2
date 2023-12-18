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
            obj.week = event.week; // Ajoute la propriété week à l'objet retourné
            return obj;
        });
    }
}

export { EventManager };