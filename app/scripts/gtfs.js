class gtfs {
    
    getUrl(url) {
        return fetch(url).then(response => {
            return response.text();
        });
    }
    
    getListOfStations() {
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
    }
    
    getStopTimesFromStations(departureStationName, arrivalStationName) {
        const departureStation = this.getStationByName(departureStationName).pop();
        const arrivalStation = this.getStationByName(arrivalStationName).pop();
        const url = './data/stop_times.txt';
        console.info('Departure Station ', departureStation);
        console.info('Arrival Station', arrivalStation);
        
        return this.getUrl(url).then(response => {
            return new Promise((resolve, reject) => {
                if (response) {
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
                    });
                    
                    resolve(stopTimes);
                } else {
                    reject(new Error('Is not possible retrieve stopTimes'));
                }
            });
        });
    }
    
    getTripsFromStopTimes(stopTimes) {
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
                                return true;
                            }
                        }
                        return false;
                    });
                    // Filter the stopTimes by the stationDeparture and stationArrival
                    console.info(stopTimes);
                    console.info(trips);
                    resolve(trips);
                } else {
                    reject(new Error('Is not possible retrieve trips'));
                }
            });
        });
    }
    
    setStationsGrouped(stations) {
        this.stations = stations;
    }
    
    getStationsGrouped(stations) {
        return this.stations;
    }
    
    getStationByName(stationName) {
        return this.stations.filter(station => station.name === stationName);
    }
}
