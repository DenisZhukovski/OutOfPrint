import { MigrationProgress, ContinuedMigrationProgress } from 'backend/migration/migration-progress';

export class MigrationRun {
    constructor(steps, state) {
        this.steps = steps;
        this.state = state;
        if (this.state == null) {
            this.state = new MigrationProgress();
        }
    }

    status() {
        return this.state;
    }

    async continueRun() {
        try {
            var continuedState = new ContinuedMigrationProgress(this.state);
            for (var i = 0; i < this.steps.length; i++) {
                await continuedState.step(this.steps[i]); 
            }

            this.state.steps.push("Complete");
            return this.state;
        }
        catch (error) {
            throw this.state.onError(error);
        }
    }

    async run() {
        this.state.clear();
        return await this.continueRun();
    }
}