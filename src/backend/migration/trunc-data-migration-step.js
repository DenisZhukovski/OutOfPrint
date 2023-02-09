import wixData from 'wix-data';
import { MigrationResult } from 'backend/migration/migration-progress';

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

    recovered(progress) {
        return this;
    }
}