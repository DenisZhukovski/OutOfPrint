import { SmartArray } from 'backend/tools/smart-array';

export class StatefulMigration {
    constructor(origin, progress) {
        this.origin = origin;
        this.progress = progress;
    }

    steps() {
        return this.origin
            .steps()
            .map(step => new StatefulStep(step, this.progress));
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
        var step = this.stepToContinue();
        if (step != null) {
            return await step.run();
        }
        return await this.origin.run();
    }

    stepToContinue() {
        var step = null;
        if (this.progress != null) {
            var progressSteps = new SmartArray(
                this.progress.steps
            ).where(step => step.name == this.origin.name());
            for (let index = 0; index < progressSteps.length; index++) {
                let stepToContinue = progressSteps[index];
                if (stepToContinue.state != "Complete") {
                    // Here to continue
                    migrationStep = stepToContinue.toContinue(this.origin);
                    stepToContinue.complete();
                    return await this.origin.step(migrationStep);
                }
            }
        }

        return step;
    }
}