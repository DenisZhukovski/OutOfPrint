import { LoggedStep } from 'backend/migration/logged-migration-step';

export class LoggedMigration {
    constructor (origin) {
        this.origin = origin;
    }

    steps() {
        return this.origin
            .steps()
            .map(step => new LoggedStep(step));
    }
}

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