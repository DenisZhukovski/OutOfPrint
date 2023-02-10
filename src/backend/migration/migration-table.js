import wixData from 'wix-data';
import { SmartArray } from 'backend/tools/smart-array';

export class MigrationTable {
    constructor (dataSetId, map) {
        this.dataSetId = dataSetId;
        this.map = map;
    }

    async bulkInsert(items) {
        if (items.length > 0) {
            await wixData.bulkInsert(
                this.dataSetId,
                items.map(item => this.map(item))
            );
        }
    }
}

// class NoDuplicatesMigrationTable {
//     constructor (origin) {
//         this.origin = origin;
//     }

//     async bulkInsert(items) {
//         var entities = await wixData
//             .query(this.origin.dataSetId)
//             .hasSome("_id", items.map(item => item._id))
//             .find();
        
//         var existingItems = new SmartArray()
//         var noDuplicates = new SmartArray(items).where(item => entities.items. )
//         await this.origin.bulkInsert(items);
//     }
// }