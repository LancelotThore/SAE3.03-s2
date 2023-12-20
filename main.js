import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

await M.init();

let all = M.filterByTag("week", 51);


function renderTimes(events) {
    console.log(events)
    var chart = JSC.chart('chartDiv', {
            debug: true,
            defaultSeries_type: 'column',
            title_label_text: 'Fin des cours',
            yAxis: { label_text: 'Heures' },
            xAxis: {
              label_text: 'Groupe',
              categories: ['BUT1-G1', 'BUT1-G21', 'BUT1-G22', 'BUT1-G3', 'BUT2-G1', 'BUT2-G21', 'BUT2-G22', 'BUT2-G3', 'BUT3-G1', 'BUT3-G21', 'BUT3-G22', 'BUT3-G3']
            },
            series: [
              {
                name: 'Lundi '+events[0][0], points: [17, 16,19,19,14, 19, 19,18,19,19,19,19]
              },
              { name: 'Mardi '+events[1][0], points: [19, 19,19,12,19, 19, 17,19,19,16,19,19] },
              { name: 'Mercredi '+events[2][0], points: [19, 19,19,17,19, 19, 19,19,19,19,11,19] },
              { name: 'Jeudi '+events[3][0], points: [19, 19,17,19,19, 19, 13,19,19,19,18,19] },
              { name: 'Vendredi '+events[4][0], points: [19, 19,19.5,19,19, 19, 17.5,19,19,19,19,19] }
            ]
    });
}

function getDernierCours(events) {
    let cours = {};
    let allGroups = new Set(); // Utiliser un ensemble pour stocker des groupes uniques

    events.forEach(event => {
        let date = new Date(event.start).toLocaleDateString();
        if (!cours[date]) {
            cours[date] = {};
        }
        event.groups.forEach(group => {
            allGroups.add(group); // Ajouter le groupe à l'ensemble
            let groupEndTime = new Date(event.end).toLocaleTimeString();
            if (!cours[date][group] || groupEndTime > cours[date][group]) {
                cours[date][group] = groupEndTime;
            }
        });
    });

    // Convertir l'objet cours en tableau
    let tab = [];
    for (let date in cours) {
        let row = [date];
        allGroups.forEach(group => {
            row.push(cours[date][group] || "0");
        });
        tab.push(row);
    }

    renderTimes(tab);
}

getDernierCours(all)

function handlerClick(ev) {
    if (ev.target.id == 'group') {
        let result;
        if (ev.target.value == "tout") {
            result = all;
        }
        else {
            result = M.filterByTag("group", ev.target.value);
        }
        renderTimes(result);
    }

    if (ev.target.id == 'week') {
        let result;
        result = M.filterByTag("week", ev.target.value);
        getDernierCours(result);
    }
}

export { handlerClick };
