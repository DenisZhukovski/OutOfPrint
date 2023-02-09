import { MigrationProgress } from 'backend/migration/migration-progress';

export class MigrationRun {
    constructor(steps) {
        this.steps = steps;
        this.progress = new MigrationProgress();
    }

    status() {
        return this.progress;
    }

    async run() {
        try {
            for (var i = 0; i < this.steps.length; i++) {
                await this.progress.step(this.steps[i]); 
            }

            return this.progress;
        }
        catch (error) {
            throw this.progress.onError(error);
        }
    }
}
