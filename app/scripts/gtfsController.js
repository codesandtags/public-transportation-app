function gtfsController() {
}

gtfsController.prototype.getUrl = function(url) {
    return fetch(url).then(response => {
        return response.text();
    });
};

gtfsController.prototype.getListOfStations = function() {
    const url = './data/stops.txt';
    
    return this.getUrl(url)
    .then(response => {
        return new Promise(function(resolve, reject) {
            if (response) {
                const stations = Papa.parse(response)
                // Return each element as an object with relevant information
                .data.map(function(station) {
                    return {
                        id: station[0],
                        name: station[2],
                        lat: station[3],
                        lng: station[4],
                        zoneId: station[5],
                        url: station[6]
                    };
                })
                // Eliminate undefined names
                .filter(function(station, index, stations) {
                    return (station.name !== undefined);
                });
                
                // Delete the first row (titles)
                stations.shift();
                
                // Stations grouped by Name
                const stationsGrouped = [];
                stations.forEach(station => {
                    const stationIds = stations
                    .filter(stationFilter => stationFilter.name === station.name)
                    .map(station => station.id);
                    
                    const isAlreadyAdded = stationsGrouped
                    .some(stationFilter => stationFilter.name === station.name);
                    
                    if (!isAlreadyAdded) {
                        station.id = stationIds;
                        stationsGrouped.push(station);
                    }
                });
                
                resolve(stationsGrouped);
            } else {
                reject(new Error('Is not possible fetch the stations'));
            }
        });
    });
};

gtfsController.prototype.getStopTimesFromStations = function(departureStationName, arrivalStationName) {
    const departureStation = this.getStationByName(departureStationName).pop();
    const arrivalStation = this.getStationByName(arrivalStationName).pop();
    const url = './data/stop_times.txt';
    //console.info('Departure Station ', departureStation);
    //console.info('Arrival Station', arrivalStation);
    
    return this.getUrl(url).then(response => {
        return new Promise((resolve, reject) => {
            if (response) {
                const stopTimesFiltered = [];
                const stopTimes = Papa.parse(response)
                
                // Return each element as an object with relevant information
                .data.map(stopTime => {
                    return {
                        tripId: stopTime[0],
                        arrivalTime: stopTime[1],
                        departureTime: stopTime[2],
                        stopId: stopTime[3],
                        stopSequence: stopTime[4]
                    };
                })
                // Filter the stopTimes by the stationDeparture and stationArrival
                .filter(stopTime => {
                    return (departureStation.id.includes(stopTime.stopId) ||
                    arrivalStation.id.includes(stopTime.stopId) );
                })
                // Sort the stopTimes by tripId
                .sort((stopTimeA, stopTimeB) => {
                    if (stopTimeA.tripId < stopTimeB.tripId) return -1;
                    if (stopTimeA.tripId > stopTimeB.tripId) return 1;
                    return 0;
                });
                // Filter the stopTimes by the stationDeparture and stationArrival
                stopTimes.forEach((stopTime, index, array) => {
                    if (index % 2 === 0 && departureStation.id.includes(stopTime.stopId)) {
                        // Identify the stations
                        const stopTimeRegister = stopTime;
                        const arrivalStopTime = array[index + 1];
                        const timeInSecondsDeparture = this.getTimeInSeconds(stopTimeRegister.arrivalTime);
                        const timeInSecondsArrival = this.getTimeInSeconds(arrivalStopTime.arrivalTime);
                        
                        // Add atributes to the departure in order to create just one register
                        if (timeInSecondsDeparture < timeInSecondsArrival) {
                            stopTimeRegister.arrivalTime = arrivalStopTime.departureTime;
                            stopTimeRegister.stopIdArrival = arrivalStopTime.stopId;
                            stopTimeRegister.timeToArrival = this.getDifferenceInMinutesFromTwoTimes(
                                stopTimeRegister.departureTime, stopTimeRegister.arrivalTime);
                            stopTimesFiltered.push(stopTimeRegister); // Storage the modified register
                        }
                    }
                });
                
                resolve(stopTimesFiltered);
            } else {
                reject(new Error('Is not possible retrieve stopTimes'));
            }
        });
    });
};

gtfsController.prototype.getTripsFromStopTimes = function(stopTimes) {
    const url = './data/trips.txt';
    
    return this.getUrl(url).then(response => {
        return new Promise((resolve, reject) => {
            if (response) {
                const trips = Papa.parse(response)
                // Return each element as an object with relevant information
                .data.map(trip => {
                    return {
                        routeId: trip[0],
                        serviceId: trip[1],
                        tripId: trip[2],
                        tripHeadSign: trip[3],
                        tripShortName: trip[4],
                        directionId: trip[5],
                        wheelChairAccesible: trip[7],
                        bikesAllowed: trip[8]
                    };
                })
                .filter(trip => {
                    for (let i = 0; i < stopTimes.length; i++) {
                        if (trip.tripId === stopTimes[i].tripId) {
                            // Add aditional information for each trip
                            trip.stopIdDeparture = stopTimes[i].stopId;
                            trip.stopIdArrival = stopTimes[i].stopIdArrival;
                            trip.stopIdArrival = stopTimes[i].stopIdArrival;
                            trip.departureTime = stopTimes[i].departureTime;
                            trip.arrivalTime = stopTimes[i].arrivalTime;
                            trip.timeToArrival = stopTimes[i].timeToArrival;
                            return true;
                        }
                    }
                    return false;
                })
                // Soft trips by departureTime
                .sort((tripA, tripB) => {
                    const timeInSecondsTripA = this.getTimeInSeconds(tripA.departureTime);
                    const timeInSecondsTripB = this.getTimeInSeconds(tripB.departureTime);
                    
                    if (timeInSecondsTripA < timeInSecondsTripB) return -1;
                    if (timeInSecondsTripA > timeInSecondsTripB) return 1;
                    return 0;
                });
                
                resolve(trips);
            } else {
                reject(new Error('Is not possible retrieve trips'));
            }
        });
    });
};

gtfsController.prototype.setStationsGrouped = function(stations) {
    this.stations = stations;
};

gtfsController.prototype.getStationByName = function(stationName) {
    return this.stations.filter(station => station.name === stationName);
};

gtfsController.prototype.getDifferenceInMinutesFromTwoTimes = function(time1, time2) {
    const totalInSeconds1 = this.getTimeInSeconds(time1);
    const totalInSeconds2 = this.getTimeInSeconds(time2);
    
    return Math.abs(totalInSeconds2 - totalInSeconds1) / 60; // Time in minutes
};

gtfsController.prototype.getTimeInSeconds = function(time) {
    const portionTime = time.split(':').map(portion => Number(portion));
    return (portionTime[0] * 3600) // Hours to seconds
        + (portionTime[1] * 60) // Minutes to seconds
        + portionTime[2]; // Just add the seconds
};
