import { LoggedStep } from 'backend/migration/logged-migration-step';

export class LoggedMigration {
    constructor (origin) {
        this.origin = origin;
    }

    steps() {
        var originSteps = this.origin.steps();
        var loggedSteps = [];
        for (var i = 0; i < originSteps.length; i++) {
            loggedSteps.push(new LoggedStep(originSteps[i]));
        }
        return loggedSteps;
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
            console.log("Migration started");
            var state = await this.origin.run();
            console.log("Migration complete");
            return state;
        }
        catch (error) {
            console.log("Migration failed.\n" + error.message);
            throw error;
        }
    }

    async continueRun() {
        try {
            console.log("Migration continued");
            var state = await this.origin.continueRun();
            console.log("Migration complete");
            return state;
        }
        catch (error) {
            console.log("Migration failed.\n" + error.message);
            throw error;
        }
    }
}