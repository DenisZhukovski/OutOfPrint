import wixData from 'wix-data';
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
                "Albums",
                "Formats",
                "Labels",
                "Artists",
                "Conditions",
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
                'title',
                100
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
                'title',
                250
            ),
            this.copyStep(
                "ImportFromArticles",
                "Artists",
                article => {
                    return {
                        "title": String(article.author)
                    };
                },
                'title',
                250
            ),
            this.copyStep(
                "ImportFromArticles",
                "Conditions",
                article => {
                    return {
                        "title": String(article.condition)
                    };
                },
                'title',
                250
            ),
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
                                    "_id": article._id,
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
            ),
            this.copyStep(
                "ImportFromOrders",
                "Orders",
                order => {
                    return {
                        "_id": String(order.orderReference),
                        "reference": String(order.orderReference),
                        "userId": String(order.userId),
                        "checkoutDate": order.checkoutDate
                    };
                },
                '_id'
            ),
            new CopyTableMigrationStep(
                new ChunkDataSource(
                    "ImportFromOrders",
                    0, 
                    25
                ),
                new LoggedMigrationTable(
                    new InsertOrderAlbumReferencesMigrationTable()
                )
            )
        ];
    }

    copyStep(copyFrom, copyTo, map, primaryField, pageSize) {
        return new CopyTableMigrationStep(
            new ChunkDataSource(
                copyFrom,
                0, 
                pageSize == null ? 1000 : pageSize
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

class InsertOrderAlbumReferencesMigrationTable {
    id() {
        return 'Orders';
    }

    async bulkInsert(orders) {
        if (orders.length > 0) {
            var orderLines = this.byOrderReference(orders);
            for(var orderReference in orderLines) {
                await wixData.insertReference(
                    this.id(),
                    "albums",
                    orderReference,
                    orderLines[orderReference].albums
                );
            }
        }
    }

    byOrderReference(orderLines) {
        var orders = {};
        orderLines.forEach(item => {
            var orderRef = String(item.orderReference);
            if (orders[orderRef] === undefined) {
                orders[orderRef] = {
                    albums: []
                }
            }
            orders[orderRef].albums.push(String(item.articleId));
        });
        return orders;
    }
}