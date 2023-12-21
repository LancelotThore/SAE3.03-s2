class Event {
    #id;
    #summary;
    #description;
    #start;
    #end;
    #location;
    #groups;
    #week;
    #type;
    #duree;
    #semestre;
    #category;
    #heurefin;
    #day;

    constructor(id, summary, description, start, end, location) {
        this.#id = id;
        this.#summary = summary.slice(0, summary.lastIndexOf(','));
        this.#description = description;
        this.#start = new Date(start);
        this.#end = new Date(end);
        this.#location = location;

        this.#groups = this.getGroups(summary);

        this.#week = this.calculateWeek();
        this.#duree = this.calculateDuree();

        if (this.#summary.includes("CM")) {
            this.#type = "CM";
        }
        else if (this.#summary.includes("TD")) {
            this.#type = "TD";
        }
        else if (this.#summary.includes("TP")) {
            this.#type = "TP";
        }
        else {
            this.#type = "Autre";
        }

        this.#semestre = this.getSemester(summary);
        this.#category = this.getCategory(summary);

        this.#heurefin = Number(this.getHeureFin());
    }

    get id() {
        return this.#id;
    }

    get summary() {
        return this.#summary;
    }

    get description() {
        return this.#description;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get location() {
        return this.#location;
    }

    get groups() {
        return this.#groups.map(gr => gr); // retourne une copie du tableau
    }

    get week() {
        return this.#week;
    }

    get duree() {
        return this.#duree;
    }

    get semestre() {
        return this.#semestre;
    }

    get category() {
        return this.#category;
    }

    get heurefin() {
        return this.#heurefin;
    }

    get day() {
        return this.#day;
    }

    // retourne un objet contenant les informations de l'événement
    // dans un format compatible avec Toast UI Calendar (voir https://nhn.github.io/tui.calendar/latest/EventObject)
    toObject() {
        return {
            id: this.#id,
            title: this.#summary,
            body: this.#description,
            start: this.#start,
            end: this.#end,
            location: this.#location,
            type: this.#type,
            week: this.#week,
            duree: this.#duree,
            semestre: this.#semestre,
            category: this.#category,
            groups: this.#groups,
            heurefin: this.#heurefin,
            day : this.#day
        }
    }

    getGroups(summary) {
        let groups = summary.slice(summary.lastIndexOf(',') + 1);
        groups = groups.split('.');
        groups = groups.map(gr => gr.replace(/\s/g, ""));

        // Filtrer et valider les groupes
        groups = groups.filter(gr => /^BUT[1-3]-G\d{1,2}$/.test(gr) && gr !== 'BUT1-G41' && gr !== 'BUT1-G42');

        return groups;
    }

    calculateWeek() {
        var date = new Date(this.#start.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        var week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    calculateDuree() {
        let diff = this.#end.getTime() - this.#start.getTime();
        let totalMinutes = diff / (1000 * 60);
        let hoursDecimal = totalMinutes / 60;
        return hoursDecimal;
    }

    getSemester = function (title) {
        let regexp = /^(R|(SA))[EÉ ]{0,2}[1-6](\.Crea)?(\.DWeb-DI)?\.[0-9]{2}/;
        let res = title.match(regexp);

        if (res != null) {
            let digit = res[0].match(/[1-6]{1}/);
            if (digit != null)
                return digit[0];
        }

        return -1;
    }

    getCategory(title) {
        let regexp = /^(R|(SAÉ?))[EÉ ]{0,2}([1-6]\.[0-9]{2})/;
        let res = title.match(regexp);

        if (res != null) {
            if (res[1] === "R") {
                return "Ressource";
            }
            else if (res[2] === "SAÉ") {
                return "SAE";
            }
        }
        return -1;
    }

    getHeureFin() {
        let time = this.#end.toISOString();
        let match = time.match(/T(\d{2}):(\d{2})/);

        let hour = parseInt(match[1], 10);
        let minute = parseInt(match[2], 10);
        hour += 2;
        let decimalTime = hour + (minute / 60);
        return decimalTime.toFixed(2);
    }

    getDay(dateString) {
        const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        return daysOfWeek[new Date(dateString).getDay()];
    }
}

export { Event };