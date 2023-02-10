export class LoggedMigrationRun {
    constructor (origin) {
        this.origin = origin;
    }

    status() {
        return this.origin.state;
    }

    async run() {
        try {
            console.log("Migration started.");
            var state = await this.origin.run();
            console.log("Migration complete.");
            return state;
        }
        catch (error) {
            console.log("Migration failed.\n" + error.message);
            throw error;
        }
    }
}