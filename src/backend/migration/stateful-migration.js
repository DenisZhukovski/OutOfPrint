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
                    this.progress.steps[index]
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
    constructor(origin, progress) {
        this.origin = origin;
        this.progress = progress;
    }

    name() {
        return this.origin.name();
    }

    async run() {
        if (this.progress.state == "Complete") {
            return new MigrationResult(
                this.progress.name,
                this.progress.state,
                this.progress.data
            );
        }
        return await this.origin
            .recovered(this.progress)
            .run();
    }
}