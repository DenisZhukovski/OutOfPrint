// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import { startMigation } from 'backend/dataMigration';

$w.onReady(function () {
	
	$w("#importFromUsers").onReady(() => {
		$w("#usersCount").text = "0/" + $w("#importFromUsers").getTotalCount();
  	} );

	$w("#importFromArticles").onReady(() => {
		$w("#articlesCount").text = "0/" + $w("#importFromArticles").getTotalCount();
  	} );

	$w("#importFromOrders").onReady(() => {
		$w("#ordersCount").text = "0/" + $w("#importFromOrders").getTotalCount();
  	} );
	
	$w("#dataMigratioButton").onClick(async () => {
		console.log("start migration");
		try {
			await startMigation(
				"#importFromUsers",
				"#importFromArticles",
				"#importFromOrders"
			)
		}
		catch (error) {
			console.log(error);
		}
	})
	// Write your Javascript code here using the Velo framework API

	// Print hello world:
	// console.log("Hello world!");

	// Call functions on page elements, e.g.:
	// $w("#button1").label = "Click me!";

	// Click "Run", or Preview your site, to execute your code

});