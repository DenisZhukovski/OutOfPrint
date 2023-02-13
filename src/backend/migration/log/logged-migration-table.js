export class LoggedMigrationTable {
    constructor(origin) {
        this.origin = origin;
        this.total = 0;
    }

    id() {
        return this.origin.id();
    }

    async bulkInsert(items) {
        try {
            await this.origin.bulkInsert(items);
            this.total += items.length;
            console.log(this.total + " migrated"); 
        }
        catch (error) {
            console.error(
                "Bulk insert into " + this.origin.id() + " failed.\n" + 
                "Items: " + items + "\n" + 
                error.message
            );
            throw error;
        }
    }
}