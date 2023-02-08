import wixData from 'wix-data';
import { MigrationResult } from 'backend/migration/migration-progress';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';

export class DataTableMigrationStep {
    constructor (importFrom, importInto, map) {
        this.importFrom = importFrom
        this.importInto = importInto;
        this.map = map; 
    }

    name() {
        return "Migration from " + this.importFrom.dataSetId + " to " + this.importInto;
    }

    async run() {
        try {
            this.total = 0;
            var entities = await this.importFrom.next();
            if (entities.length > 0) {
                await this.bulkMigrate(entities);
                while (this.importFrom.hasNext()) {
                    await this.bulkMigrate(
                        await this.importFrom.next()
                    );
                }
            }

            return await this.toResult();
        }
        catch (error) {
            throw new Error(
                "Migration from " + this.importFrom.dataSetId +
                " to " + this.importInto +
                " failed.\n" + error.message
            );
        }
    }

    async bulkMigrate(items) {
        await wixData.bulkInsert(
            this.importInto, 
            items.map(entity => this.map(entity))
        );
        this.total += items.length;
        console.log(this.total + " migrated");
    }

    async toResult() {
        var totalImported =  await wixData.query(this.importInto).count();
        var totalToImport = await wixData.query(this.importFrom.dataSetId).count();
        return new MigrationResult(
            this.name(),
            totalImported == totalToImport 
                ? 'Complete'
                : 'InProgress',
            totalImported + "/" + totalToImport,
            stepResult => new DataTableMigrationStep(
                new ChunkDataSource(
                    this.importFrom.dataSetId,
                    stepResult.data.split('/')[0], 
                    this.importFrom.pageSize
                ),
                this.importInto,
                this.map
            )
        );
    }
}