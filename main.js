
import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";
/*
   Ce fichier correspond au contrôleur de l'application. Il est chargé de faire le lien entre le modèle et la vue.
   Le modèle et la vue sont définis dans les fichiers js/model.js et js/view.js et importés (M et V, parties "publiques") dans ce fichier.
   Le modèle contient les données (les événements des 3 années de MMI).
   La vue contient tout ce qui est propre à l'interface et en particulier le composant Toast UI Calendar.
   Le principe sera toujours le même : le contrôleur va récupérer les données du modèle et les passer à la vue.
   Toute opération de filtrage des données devra être définie dans le modèle.
   Et en fonction des actions de l'utilisateur, le contrôleur pourra demander au modèle de lui retourner des données filtrées
   pour ensuite les passer à la vue pour affichage.

   Exception : Afficher 1, 2 ou les 3 années de formation sans autre filtrage peut être géré uniquement au niveau de la vue.
*/

// loadind data (and wait for it !)
await M.init();

let events = [...M.getEvents("mmi1"), ...M.getEvents("mmi2"), ...M.getEvents("mmi3")];
console.log(events)

let hoursPerWeek = {};

for (let event of events) {

    if (!hoursPerWeek[event.week]) {
        hoursPerWeek[event.week] = { hours: 0, minutes: 0 };
    }

    let durationMilliseconds = event.end - event.start;
    let durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
    let durationMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    hoursPerWeek[event.week].hours += durationHours;
    hoursPerWeek[event.week].minutes += durationMinutes;

    if (hoursPerWeek[event.week].minutes >= 60) {
        let extraHours = Math.floor(hoursPerWeek[event.week].minutes / 60);
        hoursPerWeek[event.week].hours += extraHours;
        hoursPerWeek[event.week].minutes %= 60;
    }
}

let chartData = Object.keys(hoursPerWeek).map(week => ({
    name: week.toString(),
    y: hoursPerWeek[week].hours + (hoursPerWeek[week].minutes / 60)
}));

var chart = JSC.chart('chartDiv', {
    debug: false,
    defaultSeries_type: 'columnSolid',
    title_label_text: 'Heures de cours par semaine en MMI',
    yAxis: {
        defaultTick_enabled: true,
        scale_range_padding: 0.15
    },
    legend_visible: false,
    toolbar_visible: false,
    series: [
        {
            name: 'Heures de cours total',
            color: 'turquoise',
            defaultPoint: {
                label: { text: '%value' }
            },
            points: chartData
        }
    ]
});