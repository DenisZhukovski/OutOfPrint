import { MigrationResult } from 'backend/migration/migration-progress';

export class StatefulMigration {
    constructor(origin, progress) {
        this.origin = origin;
        this.progress = progress;
    }

    steps() {
        var originSteps = this.origin.steps();
        if (this.progress == null) {
            return originSteps;
        }

        var statefulSteps = [];
        var index = 0;
        for (; index < this.progress.steps.length; index++) {
            statefulSteps.push(
                new StatefulStep(
                    originSteps[index],
                    this.progress.steps[index],
                    this.progress
                )
            );
        }

        for (; index < originSteps.length; index++) {
            statefulSteps.push(originSteps[index]);
        }
        return statefulSteps;
    }
}

class StatefulStep {
    constructor(origin, stepProgress, totalProgress) {
        this.origin = origin;
        this.stepProgress = stepProgress;
        this.totalProgress = totalProgress;
    }

    name() {
        return this.origin.name();
    }

    async run() {
        if (this.stepProgress.state == "Complete") {
            return new MigrationResult(
                this.stepProgress.name,
                this.stepProgress.state,
                this.stepProgress.data
            );
        }
        return await this.origin
            .recovered(this.stepProgress, this.totalProgress)
            .run();
    }
}