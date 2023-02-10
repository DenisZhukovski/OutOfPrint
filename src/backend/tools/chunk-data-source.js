import wixData from 'wix-data';

export class ChunkDataSource {
    constructor(dataSetId, start, pageSize) {
        this.dataSetId = dataSetId;
        this.start = start;
        this.pageSize = pageSize;
        this.entities = null;
        this.totalFetched = 0;
    }

    hasNext() {
        if (this.entities != null && this.totalFetched < this.pageSize) {
            return this.entities.hasNext();
        }

        return false;
    }

    currentIndex() {
        return this.start + this.totalFetched;
    }

    async total() {
        return await wixData.query(this.dataSetId).count();
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

        this.totalFetched += this.entities.items.length;
        return this.entities.items;
    }
}
