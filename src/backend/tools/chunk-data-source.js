import wixData from 'wix-data';

export class ChunkDataSource {
    constructor(dataSetId, start, pageSize) {
        this.dataSetId = dataSetId;
        this.start = start;
        this.pageSize = pageSize;
        this.entities = null;
        this.total = 0;
    }

    hasNext() {
        if (this.entities != null && this.total < this.pageSize) {
            return this.entities.hasNext();
        }

        return false;
    }

    async next() {
        if (this.entities == null) {
            this.entities = await wixData
                .query(this.dataSetId)
                .skip(this.start)
                .limit(this.pageSize)
                .find();
        }
        else {
            this.entities = await this.entities.next();
        }

        this.total += this.entities.items.length;
        return this.entities.items;
    }
}
