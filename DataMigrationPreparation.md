# Out of Print data migration preparation

The document describes the steps for data migration preparation process. The reason is because new Editor X project has lighter data structure regarding to original one. To be able to start the process original data shoud be exported as excel files.

## CSV file preparation
1. Open target Excel file (<b>oop_articles_22-12-12_164112.xlsx</b> as an example) in Excel program.
2. Delete first empty row from Excel document 

     <b style="color:gray">Notice:</b> if the row will not be deleted csv file import operation may have the issues.
    ![Alt text](docs/images/DataPreparationMigration/EmptyRow.png?raw=true "Empty Rows")
3. Make sure that all columns in Excel document have names. Ideally all the names should be in English. The column should be either removed or name should be assigned. 

    <b style="color:darkorange">Important:</b> 3 latest columns in oop_articles_22-12-12_164112.xlsx have no name.  ("<b>Comments</b>", "<b>Notes</b>", "<b>Notes2</b>" been assigned to them)
4. Save Excel document as csv file.

    <img src="docs/images/DataPreparationMigration/SaveAsCSV.png" alt="Sace as CSV" style="width:600px;"/>

## Editor X Import
The section describes import stepts for Editor X data sources.
1. Go to Editor X project and open Content Manager.
2. Once the manager is open chose <b>ImportFromArticles</b> data source (Content Manager -> ImportFromArticles).
3. Delete all the items in the data table if the table is not empty.
4. Choose "Import Items" menu option.

    <img src="docs/images/DataPreparationMigration/ImportItems.png" alt="Import Items" style="width:500px;"/>
5. Select <b>oop_articles_22-12-12_164112.csv</b> file from the location you used when was doing "<i>Save Excel document as csv file</i>" operation.
6. Once the file was uploaded make sure that there are no warning messages and Editor X recongnized all columns.

    <img src="docs/images/DataPreparationMigration/ConfigureColumnsToImport.png" alt="Configure columns to import" style="width:600px;"/>
    <br/>
    <br/>
    <b style="color:gray">Notice:</b> On the screenshot below there is a warning message that says that imported file was not prepared properly:

    <img src="docs/images/DataPreparationMigration/ImportWarning.png" alt="Configure columns to import" style="width:600px;"/>
    

7. Tap on "Next" button.
8. Review the mappings and tap on "Import" button.
9. Wait while import operation complete

    <img src="docs/images/DataPreparationMigration/ImportInProgress.png" alt="Configure columns to import" style="width:500px;"/>

9. Once import complete the table with imported data will appear. Close the manager.

## Import Users
Importing users data is the same operation as the previous but with some small particularities:
1. Users file "oop_users_20221212.xlsx"
2. Exitor X Content Manager -> ImportFromUsers.
3. Users have only 2 columns to import (Id and Email) for all other detected columns just unselect the mapping.

    <img src="docs/images/DataPreparationMigration/UnselectUndefinedCoulmns.png" alt="Configure columns to import" style="width:600px;"/>
4. Once the file was uploaded Tap "Manage Fields" and set Email as a primary field and remove Title field
    <img src="docs/images/DataPreparationMigration/UsersManageFields.png" alt="Configure columns to import" style="width:400px;"/>
## Import Orders
Importing orders data is the same operation as the previous but with some small particularities:
1. Orders file (oop_orders_22-12-12_160029.xlsx)
2. Exitr X Content Manager -> ImportFromOrders
3. Orders have only 4 columns to import. All other detected columns should be just unselected during the mapping.
4. Once the file was uploaded Tap "Manage Fields" and set OrderReference as a primary field and remove Title field

## Editor X migration data processing
To finish the migration follow the steps described in [Data Migration Processing](DataMigrationParsing.md) section.
