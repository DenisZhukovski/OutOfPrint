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
        if (items.length > 0) {
            await wixData.bulkInsert(
                this.id(),
                items.map(item => this.map(item))
            );
        }
    }
}
