import wixData from 'wix-data';
import { SmartArray } from 'backend/tools/smart-array';

export class NoFieldDuplicates {
    constructor (origin, fieldName) {
        this.origin = new NoDuplicatesMigrationTable(origin);
        this.origin.isDuplicate = item => this.isItemDuplicate(item);
        this.fieldName = fieldName;
    }

    id() {
        return this.origin.id();
    }

    map(item) {
        return this.origin.map(item);
    }

    async bulkInsert(items) {
        this.dbDuplicates = await new SmartArray().fromWixData(
            await wixData
                .query(this.id())
                .hasSome(this.fieldName, this.filedNameList(items))
                .find()
        );
        this.selfDuplicates = [];
        await this.origin.bulkInsert(items);
    }

    filedNameList(items) {
        var mappedArray = [];
        items.forEach(item => {
            var mappedItem = this.map(item)[this.fieldName];
            if (mappedArray.indexOf(mappedItem) == -1) {
                mappedArray.push(String(mappedItem));
            }
        });

        return mappedArray;
    }

    isItemDuplicate(item) {
        var field = this.map(item)[this.fieldName];
        if (this.selfDuplicates.indexOf(field) != -1) {
            return true;
        }
        this.selfDuplicates.push(field);
        return this.dbDuplicates.any(duplicate => duplicate[this.fieldName] == field);
    }
}

class NoDuplicatesMigrationTable {
    constructor (origin, isDuplicate) {
        this.origin = origin;
        this.isDuplicate = isDuplicate; 
    }

    id() {
        return this.origin.id();
    }

    map(item) {
        return this.origin.map(item);
    }

    async bulkInsert(items) {
        await this.origin.bulkInsert(
            new SmartArray(items).where(item => !this.isDuplicate(item))
        );
    }
}