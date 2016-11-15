let gtfs;

/* eslint-env browser */
(function() {
    'use strict';
    registerServiceWorker();
})();

function registerServiceWorker() {
    // Check to make sure service workers are supported in the current browser,
    // and that the current page is accessed from a secure origin. Using a
    // service worker from an insecure origin will trigger JS console errors. See
    // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
    const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    );
    
    if ('serviceWorker' in navigator &&
        (window.location.protocol === 'https:' || isLocalhost)) {
        
        navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            // updatefound is fired if service-worker.js changes.
            registration.onupdatefound = function() {
                
                // When the service worker is waiting
                if (registration.waiting) {
                    console.log('is waiting');
                    return;
                }
                
                // Everytime the service worker is updated
                registration.addEventListener('updatefound', function() {
                    console.log('hey! there is a new updated found');
                });
            };
        }).catch(function(e) {
            console.error('Error during service worker registration:', e);
        });
    }
}

function loadStations() {
    //console.info('Loading stations...');
    gtfs.getListOfStations().then(function(stations) {
        gtfs.setStationsGrouped(stations);
        addStationsToDatalist(stations);
    });
}

function addStationsToDatalist(stations) {
    const $departures = $('#departureStations');
    const $arrivals = $('#arrivalStations');
    const $datalistStations = stations.map((station) => {
        return '<option value="' + station.name + '">';
    }).join('');
    
    $departures.html($datalistStations);
    $arrivals.html($datalistStations);
}

function removeSelectedStationInArrival(station) {
    const stationSelected = station.target.value;
    const $arrivals = $('#arrivalStations');
    
    if (stationSelected.length > 2) {
        $arrivals.children().each((index, station) => {
            if (station.value.includes(stationSelected)) {
                $arrivals.children()[index].remove();
            }
        });
    }
    
}

function cleanForm() {
    $('#scheduleStationsForm').trigger('reset');
    $('#departureStation').focus();
    $('.time-table-container').fadeOut();
}

function searchForTimeTable() {
    const departureStation = $('#departureStation').val();
    const arrivalStation = $('#arrivalStation').val();
    
    gtfs.getStopTimesFromStations(departureStation, arrivalStation)
    .then((stopTimes) => {
        gtfs.getTripsFromStopTimes(stopTimes)
        .then(timeTable => {
            showTimeTableSchedule(timeTable);
        });
    });
}

function showTimeTableSchedule(timeTableData) {
    const $timeTableBody = $('#timeTableSchedule > tbody');
    const rowsTimeTable = [];
    //console.info(timeTableData);
    
    $('.time-table-container').fadeIn();
    
    timeTableData.forEach((timeData) => {
        const wheel = (timeData.wheelChairAccesible === '1') ? '<i class="material-icons">check</i>' : '<i class="material-icons">close</i>';
        const bike = (timeData.bikesAllowed === '1') ? '<i class="material-icons">check</i>' : '<i class="material-icons">close</i>';
        const row = '<tr>' +
            '<td class="mdl-data-table__cell--non-numeric">' + timeData.routeId + '</td>' +
            '<td >' + timeData.tripId + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + timeData.tripHeadSign + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + timeData.departureTime + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + timeData.arrivalTime + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + timeData.timeToArrival + ' Mins</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + bike + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + wheel + '</td>' + +'</tr>';
        
        rowsTimeTable.push(row);
    });
    
    $timeTableBody.html(rowsTimeTable.join(''));
}

$(document).ready(function() {
    gtfs = new gtfsController();
    loadStations();
    $('#departureStation').on('blur', removeSelectedStationInArrival);
    $('#departureStation').on('focus', loadStations);
    $('#clearForm').on('click', cleanForm);
    $('#searchForTimeTable').on('click', searchForTimeTable);
});
