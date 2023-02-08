import { TruncDataMigrationStep } from 'backend/migration/trunc-data-migration-step';
import { DataTableMigrationStep } from 'backend/migration/datatable-migration-step';
import { ChunkDataSource } from 'backend/tools/chunk-data-source';

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
            new DataTableMigrationStep(
                new ChunkDataSource(
                    "ImportFromUsers",
                    0, 
                    10
                ),
                "Users", 
                user => {
                    return {
                        "_id": user._id,
                        "Email": user.email,
                    };
            })
        ];

        // await new OutOfPrintMigration(
        //     "ImportFromUsers",
		// 	"ImportFromArticles",
		// 	"ImportFromOrders"
        // ).migrateAll();
    }
}
