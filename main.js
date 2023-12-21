import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";


await M.init();

let all = [...M.getEvents("mmi1"), ...M.getEvents('mmi2'), ...M.getEvents("mmi3")]
let grop = groupCategory(M.filterByTag("group", "BUT1-G1"));

function render(grp) {
    let chartData = heuresSemaine(all);
    let weeklyHours = heuresSemaineType(all);
    let series = grp;
    let formattedData = getDernierCours(all);

    var chart1 = JSC.chart('chartDiv1', {
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

    var chart2 = JSC.chart('chartDiv2', {
        debug: false,
        type: 'horizontalColumn',
        yAxis: {
            scale_type: 'stacked',
            label_text: 'Heures'
        },
        title_label_text: 'Heures par semaine',
        xAxis: {
            label_text: 'Semaine',
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

    var chart3 = JSC.chart('chartDiv3', {
        debug: false,
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

      var chart4 = JSC.chart('chartDiv4', {
        debug: false,
        type: 'line',
        legend_visible: true,
        xAxis: {
            crosshair_enabled: true,
            scale: { type: 'time' }
        },
        yAxis: { orientation: 'opposite', },
        defaultSeries: {
            firstPoint_label_text: '<b>%seriesName</b>',
            defaultPoint_marker: {
                type: 'none',
            }
        },
        defaultPoint: {
            tooltip: '<b>%seriesName:</b> %valueh'
        },
        title_label_text: 'Heure de fin des cours par jour et par groupe',
        series: formattedData
    });
}

render(grop)
// it 1

function heuresSemaine(events) {
    let hoursPerWeek = {};

    for (let event of events) {
        if (hoursPerWeek[event.week] == undefined) {
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

    return chartData;
}

// it 2

function heuresSemaineType(events) {
    let weeklyHours = {};

    for (let event of events) {
        if (event.week == undefined) console.log(event);

        if (weeklyHours[event.week] == undefined) {
            weeklyHours[event.week] = { CM: 0, TD: 0, TP: 0, Autre: 0 };
        }

        const durationTotalHours = (event.end - event.start) / (1000 * 60 * 60);

        weeklyHours[event.week][event.type] = (weeklyHours[event.week][event.type] || 0) + durationTotalHours;
    }

    return weeklyHours;
}

// it 3

function groupCategory(events) {
    let series = [];
    let groupedBySemestre = {};

    events.forEach(event => {
        if (event.semestre === "-1" || event.category === -1) return;

        if (groupedBySemestre[event.semestre] == undefined) {
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

    return series;
}

// it 4

function getDernierCours(events) {
    let groupedEvents = {};

    events.forEach(event => {
        event.groups.forEach(group => {
            let date = new Date(event.start);
            let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            let decimalEndTime = event.heurefin;

            if (groupedEvents[group] == undefined) {
                groupedEvents[group] = {};
            }

            if (groupedEvents[group][formattedDate] == undefined || decimalEndTime > groupedEvents[group][formattedDate]) {
                groupedEvents[group][formattedDate] = decimalEndTime;
            }
        });
    });

    let formattedData = Object.keys(groupedEvents).map(group => ({
        name: group,
        points: Object.entries(groupedEvents[group]).map(([date, value]) => [date, value])
    }));

    return formattedData;
}

function handlerClick(ev) {
    if (ev.target.id == 'group') {
        let result = groupCategory(M.filterByTag("group", ev.target.value));
        render(result) ;
    }

    if (ev.target.id == 'day') {
        let result;
        result = M.filterByTag("day", ev.target.value);
        getDernierCours(result);
    }
}

export { handlerClick };