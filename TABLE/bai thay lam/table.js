$(function() {
	let films = [
		{genre: "Animation", title: "Wildfood", duration: "3:47", date: "2014-07-16"},
		{genre: "Film", title: "The Deer", duration: "6:24", date: "2014-02-28"},
		{genre: "Animation", title: "The Ghost", duration: "11:40", date: "2012-04-10"},
		{genre: "Film", title: "Animals", duration: "6:40", date: "2005-12-21"},
		{genre: "Animation", title: "Wagons", duration: "21:40", date: "2007-04-12"},
	];
	let results = [];
	let compare = {
		name: function(a,b) {
			if (a < b) return -1;
			else if (a > b) return 1;
			else return 0;
		},
		duration: function(a,b) {
			a = a.replace(":", "");
			b = b.replace(":", "");
			return a - b;
		},
		date: function(a,b) {
			a = new Date(a);
			b = new Date(b);
			return a - b;
		}
	}

	function renderContent(array) {
		// xoá hết cái ban đầu đi render lại
		$('tbody').empty();
		//lặp object films để đổ dữ liệu
		array.forEach( function(element) {
			$('tbody').append(`
				<tr>
					<td>${element.genre}</td>
					<td>${element.title}</td>
					<td>${element.duration}</td>
					<td>${element.date}</td>
				</tr>
			`);
		});
	}
	renderContent(films);



	//Sort - Sort cái table đang được show ngoài HTML
	$('th').on('click', function() {
		let column = $('th').index(this);
		let order = $(this).data('sort');
		let rows = $('tbody tr').toArray(); //lấy các <tr> hiện tại lưu vào 1 mảng

		if ($(this).is('.ascending') || $(this).is('.descending')) {
			$(this).toggleClass('ascending descending');
			$('tbody').append(rows.reverse());
		} else {
			$(this).siblings().attr('class', 'normal'); //Khi sort sang <th> khác thì các <th> còn lại về normal
			$(this).attr('class', 'ascending');

			rows.sort(function(a, b) {
				a = $(a).find('td').eq(column).text();
				b = $(b).find('td').eq(column).text();
				return compare[order](a,b);
			});
			//không cần $('tbody').empty()
			$('tbody').append(rows);
		}
	});


	//Search
	$('[type="search"]').on('input', function() { 
		if ($(this).val() == '') {//Luôn show hết data lên bảng khi input rỗng
			renderContent(films);
			$('#no_result').text('');
			$('th').attr('class', 'normal');
		}
	});

	$(document).on('keypress', function(event) {		
		if (event.key == 'Enter') { //User ấn Enter mới bắt đầu search
			results = [];
			$('th').attr('class', 'normal');

			let input = $('[type="search"]').val().trim().toLowerCase();
			if (input == '') renderContent(films);
			else {
				films.forEach( function(element, index) {
					for (let prop in element) {
						//Nếu data có chứa input
						if (element[prop].toLowerCase().indexOf(input) != -1) {
							results.push(element);
							break; //prop nào chứa input thì push element (object) của prop đó vào array results, sau đó BREAK luôn để thoát khỏi element hiện tại, tiếp tục với element tiếp theo
						}
					}
				});

				if (!results[0]) $('#no_result').text(`No results`);
				else $('#no_result').text(``);
				renderContent(results);
			}
			console.log(results);
		}
	});
});