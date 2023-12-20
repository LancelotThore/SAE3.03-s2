import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

await M.init();

let all = [...M.getEvents("mmi1")];
console.log(all)

function renderTimes(events) {
    let series = [];

    // Grouper les événements par semestre
    let groupedBySemestre = {};
    events.forEach(event => {
        if (event.semestre === "-1" || event.category === -1) return;

        if (!groupedBySemestre[event.semestre]) {
            groupedBySemestre[event.semestre] = { Ressource: { CM: 0, TD: 0, TP: 0, Autre: 0 }, SAE: { CM: 0, TD: 0, TP: 0, Autre: 0 }, total: 0 };
        }

        groupedBySemestre[event.semestre][event.category][event.type] += event.duree;
        groupedBySemestre[event.semestre].total += event.duree;
    });

    // Créer le tableau series
    for (let semestre in groupedBySemestre) {
        ['Ressource', 'SAE'].forEach(category => {
            let data = groupedBySemestre[semestre][category];
            let total_donnee = data.CM + data.TD + data.TP + data.Autre;
            
            series.push([
                semestre,
                category,
                data.CM,
                data.TD,
                data.TP,
                data.Autre,
                total_donnee
            ]);
        });
    }

    console.log(series);
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
