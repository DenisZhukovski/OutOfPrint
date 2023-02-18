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

export class PreCacheMigrationTable {
    constructor (origin, cache) {
        this.origin = origin;
        this.cache = cache;
    }

    id() {
        return this.origin.id();
    }

    map(item) {
        return this.origin.map(item);
    }

    async bulkInsert(items) {
        if (items.length > 0) {
            var cache = await this.cache(items);
            items.forEach(item => item.cache = cache);
        }
        await this.origin.bulkInsert(items);
    }
}
