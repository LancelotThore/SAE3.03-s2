import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

await M.init();

let all = [...M.getEvents("mmi1"), ...M.getEvents('mmi2'), ...M.getEvents("mmi3")]
console.log(all)

function renderTimes(data) {
    var chart = JSC.chart('chartDiv', {
        debug: true,
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

function formatDataForChart(data) {
    let formattedData = [];

    data.forEach(groupData => {
        let groupName = groupData[0];
        let points = [];

        for (let i = 1; i < groupData.length; i++) {
            let date = groupData[i][0];
            let value = groupData[i][1];
            points.push([date, value]);
        }

        formattedData.push({
            name: groupName,
            points: points
        });
    });

    renderTimes(formattedData);
}

function getDernierCours(events) {
    let groupedEvents = {};

    events.forEach(event => {
        event.groups.forEach(group => {
            if (!groupedEvents[group]) {
                groupedEvents[group] = {};
            }
            let date = new Date(event.start);
            let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            let decimalEndTime = parseFloat(event.heurefin);
            if (!groupedEvents[group][formattedDate] || decimalEndTime > groupedEvents[group][formattedDate]) {
                groupedEvents[group][formattedDate] = decimalEndTime;
            }
        });
    });

    let tab = [];
    for (let group in groupedEvents) {
        let groupData = [group];
        for (let date in groupedEvents[group]) {
            groupData.push([date, groupedEvents[group][date]]);
        }
        tab.push(groupData);
    }

    console.log(tab)
    formatDataForChart(tab)
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