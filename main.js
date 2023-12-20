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
    console.log(series)

    var chart = JSC.chart('chartDiv', {
        debug: true,
        defaultSeries: { type: 'pieDonut', shape_center: '50%,50%' },
        title: {
          label: {
            text: 'Horraire de cours',
            style_fontSize: 16
          },
          position: 'center'
        },
        defaultPoint: {
          tooltip: '<b>%name</b><br>Revenue: <b>{%yValue:c2}B</b>'
        },
        legend: { template: '{%value:c2}B %icon %name', position: 'right' },
        series: [
          {
            name: '',
            points: [
              { x: "s1", y: 218.12, legendEntry: { sortOrder: 1 } },
              { x: "S2", y: 239.18, legendEntry: { sortOrder: 3, lineAbove: true } },
            ],
            shape: { innerSize: '0%', size: '20%' },
            defaultPoint_label: {
              text: '<b>%name</b>',
              placement: 'inside'
            },
            palette: ['#F53D01', '#0562F0']
          },
          {
          name: '',
            points: [
              { x: 'Ressource S1', y: 240.12, legendEntry: { sortOrder: 1 }, attributes_type: 'S1' },
              { x: 'SAE S1', y: 270.18, legendEntry: { sortOrder: 2 }, attributes_type: 'S1' },
              { x: 'Ressource S2', y: 270.18, legendEntry: { sortOrder: 3 }, attributes_type: 'S2' },
              { x: 'SAE S2', y: 270.18, legendEntry: { sortOrder: 4}, attributes_type: 'S2' },
            ],
            shape: { innerSize: '60%', size: '40%' },
            defaultPoint_label: {
              text: '<b>%name</b>',
              placement: 'inside'
            },
            palette: ['#CC3F2B', '#F04339', '#1314F0', '#4B9DF0']
          },
          {
            name: '',
            points: [
              { x: 'CM', y: 50.56, legendEntry_sortOrder: 2, attributes_type: 'Ressource S1' },
              { x: 'TD', y: 42.36, legendEntry_sortOrder: 2, attributes_type: 'Ressource S1' },
              { x: 'TP', y: 46.85, legendEntry_sortOrder: 2, attributes_type: 'Ressource S1' },
              { x: 'Autre', y: 78.35, legendEntry_sortOrder: 2, attributes_type: 'Ressource S1' },
              { x: 'CM', y: 50.56, legendEntry_sortOrder: 2, attributes_type: 'SAE S1' },
              { x: 'TD', y: 42.36, legendEntry_sortOrder: 2, attributes_type: 'SAE S1' },
              { x: 'TP', y: 46.85, legendEntry_sortOrder: 2, attributes_type: 'SAE S1' },
              { x: 'Autre', y: 78.35, legendEntry_sortOrder: 2, attributes_type: 'SAE S1' },
            ],
            defaultPoint_tooltip: '<b>%year %name</b><br>Revenue: <b>{%yValue:c2}B</b>',
            shape: { innerSize: '55%', size: '80%' },
            palette: JSC.colorToPalette('#CC3F2B', { lightness: 0.4 }, 4, 0).concat(
              JSC.colorToPalette('#F04339', { lightness: 0.4 }, 4, 0),
              JSC.colorToPalette('#1314F0', { lightness: 0.4 }, 4, 0),
              JSC.colorToPalette('#4B9DF0', { lightness: 0.4 }, 4, 0),
            )
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
