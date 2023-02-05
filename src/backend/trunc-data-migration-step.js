import wixData from 'wix-data';

export class TruncDataMigrationStep {
    constructor (dataSets) {
        this.dataSets = dataSets;
    }

    name() {
        return this.constructor.name;
    }

    async run() {
        var results = [];

        for (var i = 0; i< this.dataSets.length; i++) {
            var dataSet = this.dataSets[i];
            
            await wixData.truncate(dataSet);
            results.push(dataSet + " cleared");
            console.log(dataSet + " cleared");
        }

        return results;
    }
}