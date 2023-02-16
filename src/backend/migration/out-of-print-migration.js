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
            this.copyStep(
                "ImportFromUsers",
                "Users",
                user => {
                    return {
                        "_id": user._id,
                        "Email": user.email,
                    };
                },
                'Email'
            ),
            this.copyStep(
                "ImportFromArticles",
                "Labels",
                article => {
                    return {
                        "title": String(article.label)
                    };
                },
                'title'
            ),
            this.copyStep(
                "ImportFromArticles",
                "Formats",
                article => {
                    return {
                        "title": String(article.format),
                        "weight": article.weight
                    };
                },
                'title'
            ),
            this.copyStep(
                "ImportFromArticles",
                "Artists",
                article => {
                    return {
                        "title": String(article.author)
                    };
                },
                'title'
            ),
            this.copyStep(
                "ImportFromArticles",
                "Conditions",
                article => {
                    return {
                        "title": String(article.condition)
                    };
                },
                'title'
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
                    new NoDuplicatesMigrationTable(
                        new MigrationTable(
                            copyTo, 
                            map
                        )
                    ),
                    primaryField
                )
            )
        )
    }
}
