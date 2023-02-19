// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import { DataMigration } from 'public/migration/data-migration.js'

$w("#stopButton").hide();
$w("#continueButton").hide();
var migration = new DataMigration()
	.onStateChanged(state => {
		$w("#migrationCaption").text = state;
		if (state == "In Progress") {
			$w("#stopButton").show();
			$w("#dataMigratioButton").hide();
			$w("#continueButton").hide();
		}
		else {
			$w("#stopButton").hide();
			$w("#dataMigratioButton").show();
			checkContinueButtonVisibility();
		}
	});
$w.onReady(async function () {
	$w("#importFromUsers").onReady(() => {
		$w("#usersCount").text = $w("#importFromUsers").getTotalCount().toString();
  	});

	$w("#importFromArticles").onReady(() => {
		$w("#articlesCount").text = $w("#importFromArticles").getTotalCount().toString();
  	});

	$w("#importFromOrders").onReady(() => {
		$w("#ordersCount").text = $w("#importFromOrders").getTotalCount().toString();
  	});
	
	checkContinueButtonVisibility();

	$w("#dataMigratioButton").onClick(async () => {
		await migration.start();
	});

	$w("#stopButton").onClick(() => {
		migration.stop();
	});
});

function checkContinueButtonVisibility() {
	if (migration.canBeContinued()) {
		$w("#continueButton").show();
		$w("#continueButton").onClick(async () => {
			await migration.onContinue();
		});
	}
}