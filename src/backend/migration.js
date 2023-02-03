import wixData from 'wix-data';

export class Migration {
    constructor (importFrom, targetDataset, map) {
        this.importFrom = importFrom
        this.targetDataset = targetDataset;
        this.map = map; 
    }

    async migrate() {
        try {
            this.total = 0;
            console.log("migration from " + this.importFrom + "started");
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

            console.log("migration from " + this.importFrom + "complete");
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