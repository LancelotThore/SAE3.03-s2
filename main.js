
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

let p = [...M.getEvents("mmi1")];

// let index = {}

// let key = ['fruit','vegetable'];

// for (let k of key) {
//     index[k] = product.filter((item) => {
//         return item.type === k;
//     });
// }
let events = M.getEvents("mmi1");

let weeklyHours = {};

for (let event of events) {
    if (!weeklyHours[event.week]) {
        weeklyHours[event.week] = { CM: 0, TD: 0, TP: 0, Autre: 0 };
    }

    let durationMilliseconds = event.end - event.start;
    let durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
    let durationMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    let durationTotalHours = durationHours + (durationMinutes / 60);

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

// Supposons que weeklyHours soit rempli avec vos données calculées.

var chart = JSC.chart('chartDiv', { 
    debug: false, 
    type: 'column', 
    yAxis: { 
      scale_type: 'stacked', 
      label_text: 'Heures' // Changez cela pour afficher "Heures" au lieu de "Units Sold" si nécessaire
    }, 
    title_label_text: 'Heures par semaine', 
    xAxis: { 
      label_text: 'Semaine', 
      categories: Object.keys(weeklyHours).sort((a, b) => a - b) // Tri des semaines
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
  