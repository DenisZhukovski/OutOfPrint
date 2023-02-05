import wixData from 'wix-data';

export class DataTableMigrationStep {
    constructor (importFrom, targetDataset, map) {
        this.importFrom = importFrom
        this.targetDataset = targetDataset;
        this.map = map; 
    }

    name() {
        return "migration from " + this.importFrom + " to " + this.targetDataset;
    }

    async run() {
        try {
            this.total = 0;
            var entities = await wixData
                .query(this.importFrom)
                .find();
            if (entities.items.length > 0) {
                await this.bulkMigrate(entities.items);
                
                while (entities.hasNext()) {
                    entities = await entities.next(); 
                    await this.bulkMigrate(entities.items);
                } 
            }

            return this.name() + " complete: " 
                + await wixData.query(this.targetDataset).count() + "/" 
                + await wixData.query(this.importFrom).count();
        }
        catch (error) {
            throw new Error(
                "Migration from " + this.importFrom +
                " to " + this.targetDataset +
                " failed.\n" + error.message
            );
        }
    }

    async bulkMigrate(items) {
        var mappedEntities = [];
        items.forEach(entity => {
            mappedEntities.push(this.map(entity));
        });
        await wixData.bulkInsert(this.targetDataset, mappedEntities);
        this.total += items.length;
        console.log(this.total + " migrated");
    }
}