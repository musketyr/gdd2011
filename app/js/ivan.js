var users = [];
users["null"] = "http://a3.twimg.com/sticky/default_profile_images/default_profile_4_reasonably_small.png";
users[2] = "http://a2.twimg.com/profile_images/1252138461/ja_keynote_full_reasonably_small.png";
users[0] = "http://a0.twimg.com/profile_images/839895991/ikonka_codeas_twitter_reasonably_small.JPG";
users[1] = "http://a3.twimg.com/profile_images/1353051894/musketyr-2nd-big_reasonably_small.png";

users[3] = "http://a3.twimg.com/profile_images/673255109/recent_photo_2009_reasonably_small.jpg";

users[4] = "https://lh3.googleusercontent.com/-SsHpPJdyPnI/AAAAAAAAAAI/AAAAAAAAIcY/Qp1SX2g97fA/photo.jpg?sz=200";

users[5] = "http://a1.twimg.com/profile_images/846350956/pb_reasonably_small.jpg";

var settings = {
	icon : 30,
	canvas : {
		width : 480,
		height : 480
	}
};

var canvas;
var user;
var timeout;
var c = 0;
var board;

$(document).ready(function() {
	load();

	board = new eu.appsatori.gdd2011.Board();
	renderCanvas();

	lines();
	// addUser(users[0],18)
	// interval();

});

function load() {

	$("#player").change(function() {
		user = $('#player option:selected').val();
		$("#icon").attr("src", users[user]);
	});

	$("#fire").click(function() {
		var target = $("#target").val();
		var hexa = parseInt(target, 16);
		addUser(hexa);
	});

	$("#demo").click(function() {

		var state = $(this).text();

		if (state == "START") {
			interval();
			// alert(users[1]);
			$("#demo").text("STOP");
		} else {
			window.clearInterval(timeout);
			$("#demo").text("START");
		}

	});

};

// interval pro demostest
function interval() {

	timeout = window.setInterval(function() {
		var rnd = Math.round(Math.random() * 255);

		user = c;
		addUser(rnd);
		c++;
		if (c >= users.length)
			c = 0;
	}, 100);
}

// vykreseli linie (horizon, vertical)
function lines() {

	canvas.beginPath();
	for ( var x = 0; x <= settings.canvas.width; x += settings.icon) {
		canvas.moveTo(0.5 + x, 0);
		canvas.lineTo(0.5 + x, settings.canvas.height);
	}

	for ( var y = 0; y <= settings.canvas.height; y += settings.icon) {
		canvas.moveTo(0, 0.5 + y);
		canvas.lineTo(settings.canvas.width, 0.5 + y);
	}

	canvas.strokeStyle = "#ccc";
	canvas.stroke();
}

function renderText() {
	canvas.font = 'bold italic 12px Arial';
	canvas.fillText("12", 20, 0);
}

// vykreseli canvas
function renderCanvas() {
	canvas = document.getElementById('canvas').getContext('2d');
	canvas.fillStyle = 'white';
	canvas.fillRect(0, 0, settings.canvas.width, settings.canvas.height);
};

// přidá ikonku (url) uživatele na dané políčko (num <0;255>
function addUser(num) {
	var row = parseInt(num / 16);
	var col = num % 16;
	board.play(board.getPlayer(user), row, col);
}

board.addListener(function(event) {

	if (event.type === "gain") {
		// event.x;
		// event.y;
		// event.player;
		var img = new Image();
		img.src = users[event.player.getName()];

		row = event.x * settings.icon;
		col = event.y * settings.icon;

		canvas.drawImage(img, col, row, settings.icon, settings.icon);
	}
});