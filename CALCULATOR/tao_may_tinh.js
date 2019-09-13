var ham = "";
// var ketqua = document.getElementById("ketqua");
var mangrong1 = new Array();
var mangrong2 = new Array();
var manhinh = document.getElementById("display")

function press (str) {
	ham += str;
	manhinh.textContent = ham;
	mangrong1.push(str);
}

function pressac () {
	ham = "";
	manhinh.textContent = ham;
}

var num1st = Number(mangrong1.join(""));
var num2nd = Number(mangrong2.join(""));
var ketqua = num1st + num2nd
function pressmath (str) {
	if (str == '+' ) {
		num2nd = num1st;
		num1st = num2nd;
		
		manhinh.textContent = ketqua;
	}
}
