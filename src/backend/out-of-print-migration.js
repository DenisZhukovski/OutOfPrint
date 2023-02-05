import { TruncDataMigrationStep } from 'backend/migration/trunc-data-migration-step';
import { DataTableMigrationStep } from 'backend/migration/datatable-migration-step';

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
                "ImportFromUsers",
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
