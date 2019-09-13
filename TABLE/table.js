jQuery(document).ready(function($) {

	let films = [
		{genre: "Drama", title: "The Deer", time: "1:24", date: "2014-02-28"},
		{genre: "Action", title: "Wildfood", time: "3:47", date: "2014-07-16"},
		{genre: "Horror", title: "The scary movie", time: "5:00", date: "2007-07-12"},
		{genre: "Action", title: "Wildfood", time: "7:47", date: "2014-07-18"},
		{genre: "Epic", title: "The Ghost", time: "9:40", date: "2012-04-10"},
		{genre: "Adventure", title: "Animals", time: "11:40", date: "2005-12-21"},
		{genre: "Action", title: "Need for speed", time: "13:00", date: "2007-04-21"},		
		{genre: "Epic", title: "Wagons", time: "15:40", date: "2007-04-12"},
		{genre: "Horror", title: "Wagons", time: "17:40", date: "2007-04-12"},
		{genre: "Adventure", title: "Animals", time: "19:20", date: "2019-12-21"},
	];

	function add () {
		for (var i = 0; i < films.length; i++) {
			$('table').append(`
				<tr>
				<td class="le">${films[i].genre}</td>
				<td class="le">${films[i].title}</td>
				<td>${films[i].date}</td>
				<td>${films[i].time}</td>
				</tr>
				`);
		};
	}
	add();

	
	// $('#genre').on('click', function() {
	// 	let rows = $('table').find('tr').toArray();
	// 	let shouldSwitch = true, dem = 0,i,x,y;
	// 	let switching = true;
	// 	let chieu = "xuoi";
	// 	while (switching) {
	// 		switching = false;
	// 		for( i = 1; i < rows.length; i++) {
	// 			shouldSwitch = false;
	// 			 x = rows[i].getElementsByTagName("td")[0];
	// 			 y = rows[i + 1].getElementsByTagName("td")[0];
	// 			if (chieu == "xuoi") {
	// 				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
	// 					shouldSwitch= true;
	// 					rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	// 					break;
	// 				}
	// 			} else if (chieu == "nguoc") {
	// 				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
	// 					shouldSwitch = true;
	// 					rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	// 					break;
	// 				}
	// 			};
			
	// 		};
	// 		if (shouldSwitch) {
	// 			switching = true;
	// 			dem++;
	// 		} else {
	// 			if (dem == 0 && chieu == "xuoi") {
	// 				chieu = "nguoc";
	// 				switching = true;
	// 			}
	// 		};
	// 	};



	// });

	$('#genre').on('click', function() {
		event.preventDefault();
		/* Act on the event */
		let rows = $('table').find('tr').toArray();
		for (var i = 1; i < rows.length; i++) {
			

		}
	});


});