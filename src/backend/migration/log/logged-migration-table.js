export class LoggedMigrationTable {
    constructor(origin) {
        this.origin = origin;
        this.total = 0;
    }

    async bulkInsert(items) {
        try {
            await this.origin.bulkInsert(items);
            this.total += items.length;
            console.log(this.total + " migrated"); 
        }
        catch (error) {
            console.log(
                "Bulk insert into " + this.origin.dataSetId + "failed.\n" + 
                "Items: " + items + "\n" + 
                error.message
            );
            throw error;
        }
    }
}