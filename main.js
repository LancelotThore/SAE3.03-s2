import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

await M.init();

let all = [...M.getEvents("mmi1"), ...M.getEvents('mmi2'), ...M.getEvents("mmi3")]
console.log(all)

function renderTimes(data) {
    var chart = JSC.chart('chartDiv', {
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
        series: data
    });
}

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

    renderTimes(formattedData);
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

    if(ev.target.id == 'day') {
        let result;
        result = M.filterByTag("day", ev.target.value);
        getDernierCours(result);
    }
}

export { handlerClick };