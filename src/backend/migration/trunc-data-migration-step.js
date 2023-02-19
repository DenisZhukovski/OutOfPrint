import wixData from 'wix-data';
import { MigrationResult } from 'backend/migration/migration-progress';
import { SmartArray } from 'backend/tools/smart-array';

export class TruncDataMigrationStep {
    constructor (dataSets) {
        this.dataSets = dataSets;
    }

    name() {
        return this.constructor.name;
    }

    async run() {
        var data = [];
        for (var i = 0; i< this.dataSets.length; i++) {
            var dataSet = this.dataSets[i];
            await wixData.truncate(dataSet);
            data.push(dataSet + " cleared");
            console.log(dataSet + " cleared");
        }

        return new MigrationResult(
            this.name(),
            'Complete',
            data
        );
    }

    recovered(stepProgress, totalProgress) {
        console.log("Recover TruncDataMigrationStep")
        var completeSteps = [];
        for (let index = 1; index < totalProgress.steps.length; index++) {
            const step = totalProgress.steps[index];
            completeSteps.push(step.name.split(" to ")[1]);
        }
        console.log("Completed steps: " + completeSteps);
        this.dataSets = new SmartArray(this.dataSets).where(table => completeSteps.indexOf(table) == -1);
        console.log("Datasets to clear: " + this.dataSets);
        return this;
    }
}
