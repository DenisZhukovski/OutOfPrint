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
            if (state.isComplete()) {
                console.log("Migration complete.");
            }
            else {
                console.log("Migration interrupted.");
            }
            
            return state;
        }
        catch (error) {
            console.error("Migration failed.\n" + error.message);
            throw error;
        }
    }
}