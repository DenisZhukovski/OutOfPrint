// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import { startMigation } from 'backend/data-migration';

$w.onReady(async function () {
	
	$w("#importFromUsers").onReady(() => {
		$w("#usersCount").text = $w("#importFromUsers").getTotalCount().toString();
  	} );

	$w("#importFromArticles").onReady(() => {
		$w("#articlesCount").text = $w("#importFromArticles").getTotalCount().toString();
  	} );

	$w("#importFromOrders").onReady(() => {
		$w("#ordersCount").text = $w("#importFromOrders").getTotalCount().toString();
  	} );
	
	$w("#dataMigratioButton").onClick(async () => {
		
		try {
			$w("#migrationCaption").text = "IN PROGRESS";
			var state = await startMigation(null);
			console.log(state);
			while (!isMigrationSomplete(state)) {
				state = await startMigation(state);
				console.log(state);
			}
			$w("#migrationCaption").text = "COMPLETE";
		}
		catch (error) {
			console.log(error);
		}
	});
});

function isMigrationSomplete(state) {
	if (state.steps.length > 0) {
		return state.steps[state.steps.length - 1].state == "Complete"
	}
	return false;
}

function delay(ms) {
	return new Promise(resolve => setTimeout(() => resolve(), ms));
}