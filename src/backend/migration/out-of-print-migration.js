import { TruncDataMigrationStep } from 'backend/migration/trunc-data-migration-step';
import { CopyTableMigrationStep } from 'backend/migration/copy-table-migration-step';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';
import { MigrationTable, PreCacheMigrationTable } from 'backend/migration/migration-table';
import { NoFieldDuplicates } from 'backend/migration/no-duplicates-migration-table';
import { LoggedMigrationTable } from 'backend/migration/log/logged-migration-table';
import { AlbumbsInsertCache} from 'backend/migration/albums-insert-cache';

export class OutOfPrintMigration {
    steps() {
        return [
            new TruncDataMigrationStep([
                "OrderLines",
                "Orders",
                "ShippingCosts",
                "Albums"
               // "Formats",
               // "Labels",
              //  "Artists",
              //  "Conditions",
              //  "Users"
            ]),
            // this.copyStep(
            //     "ImportFromUsers",
            //     "Users",
            //     user => {
            //         return {
            //             "_id": user._id,
            //             "Email": user.email,
            //         };
            //     },
            //     'Email'
            // ),
            // this.copyStep(
            //     "ImportFromArticles",
            //     "Labels",
            //     article => {
            //         return {
            //             "title": String(article.label)
            //         };
            //     },
            //     'title'
            // ),
            // this.copyStep(
            //     "ImportFromArticles",
            //     "Formats",
            //     article => {
            //         return {
            //             "title": String(article.format),
            //             "weight": article.weight
            //         };
            //     },
            //     'title'
            // ),
            // this.copyStep(
            //     "ImportFromArticles",
            //     "Artists",
            //     article => {
            //         return {
            //             "title": String(article.author)
            //         };
            //     },
            //     'title'
            // ),
            // this.copyStep(
            //     "ImportFromArticles",
            //     "Conditions",
            //     article => {
            //         return {
            //             "title": String(article.condition)
            //         };
            //     },
            //     'title'
            // ),
            new CopyTableMigrationStep(
                new ChunkDataSource(
                    "ImportFromArticles",
                    0, 
                    500
                ),
                new LoggedMigrationTable(
                    new PreCacheMigrationTable(
                        new MigrationTable(
                           "Albums",
                            article => {
                                return {
                                    "title": String(article.title),
                                    "artistId" : article.cache.id('Artists', String(article.author)), 
                                    "formatId" : article.cache.id('Formats', String(article.format)), 
                                    "labelId" : article.cache.id('Labels', String(article.label)), 
                                    "conditionId" : article.cache.id('Conditions', String(article.condition)), 
                                    "year": article.year,
                                    "images": article.images,
                                    "price" : article.price, 
                                    "stock" : article.stock, 
                                    "soundFileUri" : article.soundFile,
                                    "comments" : article.comments
                                };
                            }
                        ),
                        (items) => new AlbumbsInsertCache(items).init()
                    )
                )
            )
        ];

        // await new OutOfPrintMigration(
        //     "ImportFromUsers",
		// 	"ImportFromArticles",
		// 	"ImportFromOrders"
        // ).migrateAll();
    }

    copyStep(copyFrom, copyTo, map, primaryField) {
        return new CopyTableMigrationStep(
            new ChunkDataSource(
                copyFrom,
                0, 
                1000
            ),
            new LoggedMigrationTable(
                new NoFieldDuplicates(
                    new MigrationTable(
                        copyTo, 
                        map
                    ),
                    primaryField
                )
            )
        )
    }
}
