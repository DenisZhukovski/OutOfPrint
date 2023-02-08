import { ContinuedMigrationProgress } from 'backend/migration/migration-progress';

export class MigrationRun {
    constructor(steps, state) {
        this.steps = steps;
        this.state = state;
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