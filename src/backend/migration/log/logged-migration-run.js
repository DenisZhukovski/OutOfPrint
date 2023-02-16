export class LoggedMigrationRun {
    constructor (origin) {
        this.origin = origin;
    }

    status() {
        return this.origin.state;
    }

    async run() {
        try {
            console.debug("Migration started.");
            var state = await this.origin.run();
            if (state.isComplete()) {
                console.info("Migration complete.");
            }
            else {
                console.debug("Migration interrupted.");
            }
            
            return state;
        }
        catch (error) {
            console.error("Migration failed.\n" + error.message);
            throw error;
        }
    }
}