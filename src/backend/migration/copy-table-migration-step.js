import { MigrationResult } from 'backend/migration/migration-progress';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';

export class CopyTableMigrationStep {
    constructor (importFrom, importInto) {
        this.importFrom = importFrom
        this.importInto = importInto;
    }

    name() {
        return "Migration from " + this.importFrom.dataSetId + " to " + this.importInto.id();
    }

    async run() {
        try {
            do {
                var items = await this.importFrom.next();
                await this.importInto.bulkInsert(items);
            } while (this.importFrom.hasNext());

            return await this.toResult();
        }
        catch (error) {
            throw new Error(
                "Migration from " + this.importFrom.dataSetId +
                " to " + this.importInto.id() +
                " failed.\n" + error.message
            );
        }
    }

    async toResult() {
        var totalImported = this.importFrom.currentIndex();
        var totalToImport = await this.importFrom.total();
        return new MigrationResult(
            this.name(),
            totalImported == totalToImport 
                ? 'Complete'
                : 'InProgress',
            totalImported + "/" + totalToImport
        );
    }

    recovered(progress) {
        return new CopyTableMigrationStep(
            new ChunkDataSource(
                this.importFrom.dataSetId,
                parseInt(progress.data.split('/')[0]), 
                this.importFrom.pageSize
            ),
            this.importInto
        );
    }
}