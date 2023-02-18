import wixData from 'wix-data';
import { SmartArray } from 'backend/tools/smart-array';

export class AlbumbsInsertCache {
    constructor(articles) {
        this.articles = articles;
    }

    async init() {
        this.cache = {
            'Artists': await this.cachedTable('Artists', 'author'),
            'Formats': await this.cachedTable('Formats', 'format'),
            'Labels': await this.cachedTable('Labels', 'label'),
            'Conditions': await this.cachedTable('Conditions', 'condition')
        };
        console.log('Cache initialized');
        return this;
    }

    async cachedTable(table, field) {
        console.log('Cache Table: ' + table);
        return new SmartArray().fromWixData(
            await wixData
                .query(table)
                .hasSome('title', new SmartArray(this.articles).distinctMap(article => String(article[field])))
                .find()
        );
    }

    id(table, value) {
        if (this.cache[table] == null) {
            throw new Error("Table is not present in the cache:" + this.cache);
        }
        var item = this.cache[table].firstOrDefault(item => String(item.title) == value);
        if (item == null) {
             console.warn("No item '" + value + "' found in '" + table + "'");
             return null;
        }

        return item._id;
    }
}