import wixData from 'wix-data';

export class MigrationCleaner {
    constructor (dataSets) {
        this.dataSets = dataSets;
    }

    async clear() {
        try {
            var promisses = [];
            this.dataSets.forEach(dataSet => {
                console.log("clear: " + dataSet);
                promisses.push(wixData.truncate(dataSet));
            });

            await Promise.all(promisses);
            console.log("all tables cleared");
        }
        catch (error) {
            throw new Error("Clear data collections failed.\n" + error.message);
        }
    }
}