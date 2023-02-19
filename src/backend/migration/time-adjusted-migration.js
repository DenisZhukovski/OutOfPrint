import { CopyTableMigrationStep } from 'backend/migration/copy-table-migration-step';

export class TimeAutoAdjustedMigration {
    constructor(origin, executionAnalytics) {
        this.origin = origin;
        this.executionAnalytics = executionAnalytics;
    }

    steps() {
        var index = 0; 
        return this.origin.steps().map(step => {
            var mappedStep = new TimeAutoAdjustedStep(
                step,
                this.executionAnalytics,
                index
            );
            index++;
            return mappedStep;
        });
    }
}

class TimeAutoAdjustedStep {
    constructor(origin, analytics, stepIndex) {
        this.origin = origin;
        this.analytics = analytics;
        this.stepIndex = stepIndex; 
    }

    name() {
        return this.origin.name();
    }

    async run() {
        this.adjustStep();
        var t1 = this.performance();
        var result = await this.origin.run();
        var t2 = this.performance();
        result.executionTime = t2 - t1;
        if (this.origin.constructor == CopyTableMigrationStep) {
            result.pageSize = this.origin.importFrom.pageSize;
        }

        return result;
    }

    recovered(stepProgress, totalProgress) {
        return new TimeAutoAdjustedStep(
            this.origin.recovered(stepProgress, totalProgress),
            this.analytics,
            this.stepIndex
        );
    }

    performance() {
        return Number(Date.now()) / 1000; //get the current time in seconds
    }

    adjustStep() {
        if (this.analytics != null) {
            if (this.origin.constructor == CopyTableMigrationStep && this.stepIndex < this.analytics.steps.length) {
                var step = this.analytics.steps[this.stepIndex];
                var pageSize = this.origin.importFrom.pageSize;
                if (step.pageSize != null) {
                    pageSize = step.pageSize;
                }
                if (step.executionTime < 12) {
                    this.origin.importFrom.pageSize = pageSize + Math.round(pageSize * 0.1);
                }
                else {
                    this.origin.importFrom.pageSize = pageSize - Math.round(pageSize * 0.1);
                }

                if (this.origin.importFrom.pageSize > 1000) {
                    this.origin.importFrom.pageSize = 1000;
                }
            }
        }
    }
}