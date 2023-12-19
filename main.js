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
            groupedBySemestre[event.semestre] = { TP: 0, TD: 0, CM: 0, Autre: 0 };
        }

        groupedBySemestre[event.semestre][event.type] += event.duree;
    });

    // Pour chaque semestre
    for (let semestre in groupedBySemestre) {
        let total_duree_du_semestre = Object.values(groupedBySemestre[semestre]).reduce((acc, val) => acc + val, 0);

        series.push({
            name: '',
            points: [{ x: semestre, y: total_duree_du_semestre, legendEntry: { sortOrder: parseInt(semestre) } }],
            shape: { innerSize: '0%', size: '20%' },
            defaultPoint_label: { text: '<b>%name</b>', placement: 'inside' },
            palette: ['#F53D01', '#0562F0']
        });

        // Pour chaque catégorie (Ressource et SAE)
        ['Ressource', 'SAE'].forEach(category => {
            let data = { CM: 0, TD: 0, TP: 0, Autre: 0 };
            if (groupedBySemestre[semestre][category]) {
                data = groupedBySemestre[semestre][category];
            }

            let points = Object.entries(data).map(([type, duree]) => ({
                x: `${type} ${semestre}`,
                y: duree,
                legendEntry: { sortOrder: (category === 'Ressource' ? 1 : 2), attributes_type: `${category} ${semestre}` }
            }));

            series.push({
                name: '',
                points: points,
                shape: { innerSize: '60%', size: '40%' },
                defaultPoint_label: { text: '<b>%name</b>', placement: 'inside' },
                palette: ['#CC3F2B', '#F04339', '#1314F0', '#4B9DF0']
            });
        });
    }

    var chart = JSC.chart('chartDiv', {
        debug: true,
        defaultSeries: { type: 'pieDonut', shape_center: '50%,50%' },
        title: {
            label: { text: 'Horraire de cours', style_fontSize: 16 },
            position: 'center'
        },
        defaultPoint: { tooltip: '<b>%name</b><br>Revenue: <b>{%yValue:c2}B</b>' },
        legend: { template: '{%value:c2}B %icon %name', position: 'right' },
        series: series
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
