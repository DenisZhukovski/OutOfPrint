import { MigrationProgress } from 'backend/migration/migration-progress';

export class MigrationRun {
    constructor(migration) {
        this.migration = migration;
        this.progress = new MigrationProgress();
    }

    status() {
        return this.progress;
    }

    async run() {
        try {
            var steps = this.migration.steps();
            for (var i = 0; i < steps.length; i++) {
                var stepResult = await this.progress.step(steps[i]);
                if (!stepResult.isComplete()) {
                    break;
                }
            }

            return this.progress;
        }
        catch (error) {
            throw this.progress.onError(error);
        }
    }
}
