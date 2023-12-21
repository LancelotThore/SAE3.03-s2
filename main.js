import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

await M.init();

let all = M.filterByTag("BUT1-G1");

function renderTimes(events) {
    let series = [];
    let groupedBySemestre = {};

    events.forEach(event => {
        if (event.semestre === "-1" || event.category === -1) return;

        if (!groupedBySemestre[event.semestre]) {
            groupedBySemestre[event.semestre] = { Ressource: { CM: 0, TD: 0, TP: 0, Autre: 0 }, SAE: { CM: 0, TD: 0, TP: 0, Autre: 0 }, total: 0 };
        }

        groupedBySemestre[event.semestre][event.category][event.type] += event.duree;
        groupedBySemestre[event.semestre].total += event.duree;
    });

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

    var chart = JSC.chart('chartDiv', {
        debug: true,
        defaultSeries: { type: 'pieDonut', shape_center: '50%,50%' },
        title: {
          label: {
            text: 'Horraire de cours par Groupe',
            style_fontSize: 16
          },
          position: 'center'
        },
        defaultPoint: {
          tooltip: '<b>%name</b><br>Heures: <b>%Valueh</b>'
        },
        legend: { template: '%value h %icon %name', position: 'right' },
        series: [
          {
            name: '',
            points: [
              { x: 'S'+series[0][0], y: series[0][6]+series[1][6], legendEntry: { sortOrder: 1 } },
              { x: 'S'+series[2][0], y: series[2][6]+series[3][6], legendEntry: { sortOrder: 3, lineAbove: true } },
            ],
            shape: { innerSize: '0%', size: '20%' },
            defaultPoint: {
                label_text: '<b>%name</b> ',
                outline: { color: 'white', width: 5 }
                
            },
            defaultPoint_label: {
              text: '<b>%name</b>',
              placement: 'inside'
            },
            palette: ['#8D2C5A', '#006EA3']
          },
          {
          name: '',
            points: [
              { x: 'Ressource S'+series[0][0], y: series[0][6], legendEntry: { sortOrder: 1 }, attributes_type: 'S'+series[0][0] },
              { x: 'SAE S'+series[0][0], y: series[1][6], legendEntry: { sortOrder: 2 }, attributes_type: 'S'+series[0][0] },
              { x: 'Ressource S'+series[2][0], y: series[2][6], legendEntry: { sortOrder: 3 }, attributes_type: 'S'+series[2][0] },
              { x: 'SAE S'+series[2][0], y: series[3][6], legendEntry: { sortOrder: 4}, attributes_type: 'S'+series[2][0] },
            ],
            shape: { innerSize: '60%', size: '40%' },
            defaultPoint: {
                label_text: '<b>%name</b> ',
                outline: { color: 'white', width: 5 }
                
            },
            defaultPoint_label: {
              text: '<b>%name</b>',
              placement: 'inside'
            },
            palette: ['#F4CFDF', '#CA3C66', '#9AC8EB', '#5784BA']
          },
          {
            name: '',
            points: [
              { x: 'R - CM', y: series[0][2], legendEntry_sortOrder: 2, attributes_type: 'Ressource S'+series[0][0] },
              { x: 'R - TD', y: series[0][3], legendEntry_sortOrder: 2, attributes_type: 'Ressource S'+series[0][0] },
              { x: 'R - TP', y: series[0][4], legendEntry_sortOrder: 2, attributes_type: 'Ressource S'+series[0][0] },
              { x: 'S - CM', y: series[1][2], legendEntry_sortOrder: 2, attributes_type: 'SAE S'+series[0][0] },
              { x: 'S - TD', y: series[1][3], legendEntry_sortOrder: 2, attributes_type: 'SAE S'+series[0][0] },
              { x: 'S - TP', y: series[1][4], legendEntry_sortOrder: 2, attributes_type: 'SAE S'+series[0][0] },
              { x: 'S - Autonomie', y: series[1][5], legendEntry_sortOrder: 2, attributes_type: 'SAE S'+series[0][0] },
              { x: 'R - CM', y: series[2][2], legendEntry_sortOrder: 4, attributes_type: 'Ressource S'+series[2][0] },
              { x: 'R - TD', y: series[2][3], legendEntry_sortOrder: 4, attributes_type: 'Ressource S'+series[2][0] },
              { x: 'R - TP', y: series[2][4], legendEntry_sortOrder: 4, attributes_type: 'Ressource S'+series[2][0] },
              { x: 'S - CM', y: series[3][2], legendEntry_sortOrder: 4, attributes_type: 'SAE S'+series[2][0] },
              { x: 'S - TD', y: series[3][3], legendEntry_sortOrder: 4, attributes_type: 'SAE S'+series[2][0] },
              { x: 'S - TP', y: series[3][4], legendEntry_sortOrder: 4, attributes_type: 'SAE S'+series[2][0] },
              { x: 'S - Autonomie', y: series[3][5], legendEntry_sortOrder: 4, attributes_type: 'SAE S'+series[2][0] },

            ],
            defaultPoint: {
                label_text: '<b>%name</b> ',
                outline: { color: 'white', width: 3 }
            },
            shape: { innerSize: '55%', size: '80%' },
            palette: JSC.colorToPalette('#F4CFDF', { lightness: 0.4 }, 3, 0).concat(
              JSC.colorToPalette('#CA3C66', { lightness: 0.4 }, 4, 0),
              JSC.colorToPalette('#9AC8EB', { lightness: 0.4 }, 4, 0),
              JSC.colorToPalette('#5784BA', { lightness: 0.4 }, 4, 0),
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
