import { MigrationResult } from 'backend/migration/migration-progress';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';

export class DataTableMigrationStep {
    constructor (importFrom, importInto) {
        this.importFrom = importFrom
        this.importInto = importInto;
    }

    name() {
        return "Migration from " + this.importFrom.dataSetId + " to " + this.importInto.dataSetId;
    }

    async run() {
        try {
            await this.importInto.bulkInsert(
                await this.importFrom.next()
            );
            while (this.importFrom.hasNext()) {
                await this.importInto.bulkInsert(
                    await this.importFrom.next()
                );
            }

            return await this.toResult();
        }
        catch (error) {
            throw new Error(
                "Migration from " + this.importFrom.dataSetId +
                " to " + this.importInto.dataSetId +
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
        return new DataTableMigrationStep(
            new ChunkDataSource(
                this.importFrom.dataSetId,
                parseInt(progress.data.split('/')[0]), 
                this.importFrom.pageSize
            ),
            this.importInto
        );
    }
}