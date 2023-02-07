import wixData from 'wix-data';

export class ChunkDataSource {
    constructor(dataSetId, start, pageSize) {
        this.dataSetId = dataSetId;
        this.start = start;
        this.pageSize = pageSize;
        this.entities = null;
    }

    hasNext() {
        if (this.entities != null) {
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

        return this.entities.items;
    }
}
