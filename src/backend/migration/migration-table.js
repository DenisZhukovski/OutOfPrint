import wixData from 'wix-data';

export class MigrationTable {
    constructor (dataSetId, mapItem) {
        this.dataSetId = dataSetId;
        this.mapItem = mapItem;
    }

    id() {
        return this.dataSetId;
    }

    map(item) {
        return this.mapItem(item);
    }

    async bulkInsert(items) {
        console.log("INSERT MigrationTable");
        if (items.length > 0){
            console.log('total:' + items.length);
            console.log(this.map(items[0]));
        }
        if (items.length > 0) {
            await wixData.bulkInsert(
                this.id(),
                items.map(item => this.map(item))
            );
        }
    }
}
