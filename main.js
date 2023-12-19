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

let all = [...M.getEvents("mmi1"), ...M.getEvents("mmi2"), ...M.getEvents("mmi3")];

// let index = {}

// let key = ['fruit','vegetable'];

// for (let k of key) {
//     index[k] = product.filter((item) => {
//         return item.type === k;
//     });
// }

console.log(all)

function renderTimes(events) {
    let weeklyHours = {};
    for (let event of events) {
        if (event.week === undefined) {
            console.log(event);
            continue;
        }
        if (!weeklyHours[event.week]) {
            weeklyHours[event.week] = { CM: 0, TD: 0, TP: 0, Autre: 0 };
        }
        let durationTotalHours = event.duree;
        if (event.type === 'CM') {
            weeklyHours[event.week].CM += durationTotalHours;
        }
        if (event.type === 'TD') {
            weeklyHours[event.week].TD += durationTotalHours;
        }
        if (event.type === 'TP') {
            weeklyHours[event.week].TP += durationTotalHours;
        }
        if (event.type === 'Autre') {
            weeklyHours[event.week].Autre += durationTotalHours;
        }
    }

    var chart = JSC.chart('chartDiv', {
        debug: false,
        type: 'column',
        yAxis: {
            scale_type: 'stacked',
            label_text: 'Heures'
        },
        title_label_text: 'Heures par semaine',
        xAxis: {
            label_text: 'Semaines',
            categories: Object.keys(weeklyHours)
        },
        series: [
            {
                name: 'TP',
                points: Object.values(weeklyHours).map(week => week.TP)
            },
            {
                name: 'TD',
                points: Object.values(weeklyHours).map(week => week.TD)
            },
            {
                name: 'CM',
                points: Object.values(weeklyHours).map(week => week.CM)
            },
            {
                name: 'Autre',
                points: Object.values(weeklyHours).map(week => week.Autre)
            }
        ]
    });
}

renderTimes(all)

function handlerClick(ev) {
    if (ev.target.id == 'group') {
        let result;
        if (ev.target.value == "tout") {
            result = all;
        }
        else {
            result = M.filterByTag(ev.target.value);
        }
        renderTimes(result);
    }
}

export { handlerClick };