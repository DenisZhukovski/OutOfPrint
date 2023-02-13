import { TruncDataMigrationStep } from 'backend/migration/trunc-data-migration-step';
import { CopyTableMigrationStep } from 'backend/migration/copy-table-migration-step';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';
import { MigrationTable } from 'backend/migration/migration-table';
import { NoFieldDuplicates, NoDuplicatesMigrationTable } from 'backend/migration/no-duplicates-migration-table';
import { LoggedMigrationTable } from 'backend/migration/log/logged-migration-table';

export class OutOfPrintMigration {
    steps() {
        return [
            new TruncDataMigrationStep([
                "OrderLines",
                "Orders",
                "ShippingCosts",
                "Albums",
                "Formats",
                "Labels",
                "Artists",
                "Users"
            ]),
            // new CopyTableMigrationStep(
            //     new ChunkDataSource(
            //         "ImportFromUsers",
            //         0, 
            //         1000
            //     ),
            //     new LoggedMigrationTable(
            //         new MigrationTable(
            //             "Users", 
            //             user => {
            //                 return {
            //                     "_id": user._id,
            //                     "Email": user.email,
            //                 };
            //             }
            //         )
            //     )
            // ),
            new CopyTableMigrationStep(
                new ChunkDataSource(
                    "ImportFromArticles",
                    0, 
                    1000
                ),
                new LoggedMigrationTable(
                    new NoFieldDuplicates(
                        new NoDuplicatesMigrationTable(
                            new MigrationTable(
                                "Labels", 
                                article => {
                                    return {
                                        "Title": article.label,
                                    };
                                }
                            )
                        ),
                        'Title'
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
}
