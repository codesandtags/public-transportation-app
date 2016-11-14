class gtfs {
    
    getJson(url) {
        return fetch(url).then(response => {
            return response.text();
        });
    }
    
    getListOfStations() {
        const url = './data/stops.txt';
        
        return this.getJson(url)
        .then(response => {
            return new Promise(function(resolve, reject) {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Is not posible fetch the stations'));
                }
            });
        });
    }
}
