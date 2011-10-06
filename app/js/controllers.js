/* App Controllers */


function GddBoardCtrl(twitterWatcher, $log, $location, $defer) {
	var self = this, 
		canvas, 
		loc = ($location || {search: {magic: false, q: '@gddwall'}}), lastQuery = 0;
	
	this.canvasWidth = 481;
	this.canvasHeight = 481;
	this.clockTick = 50;
	this.step = 2000;
	this.minQueryStep = 30000;
	this.maxQueued = 100;
	this.queue = [];
	
	this.initBoard = function(){
		self.clock = new eu.appsatori.gdd2011.Clock();
		
		self.boardCanvas = new eu.appsatori.gdd2011.BoardCanvas(self.clock);
		self.boardCanvas.initBoard();
		
		self.canvasWidth  = self.boardCanvas.getCanvasSize();
		self.canvasHeight = self.boardCanvas.getCanvasSize();
		
		
		self.board = new eu.appsatori.gdd2011.Board();
		
		self.board.addListener(function(event) {
			if (event.type === "gain") {
				self.boardCanvas.placeIcon(event.x, event.y, event.player.getImage(), event.originalDirection);
				self.$root.$eval();
			}
		});

		self.watcher = twitterWatcher.watch(loc.search.q || '@gddwall');
		
		self.parser = new eu.appsatori.gdd2011.TwitterParser(loc.search.magic);
		
		self.watcher.onTweet(function(tweet){
			var coor = self.parser.parseCoordinates(tweet.text, self.boardCanvas.getSize());
			if(!coor.invalid){
				queueMovement(self.board.getPlayer(tweet.from_user, tweet.profile_image_url), coor.row, coor.col, tweet.text);
			}
		});
		
		self.watcher.query();
		nextMovement();
		runClock();
	};
	
	
	this.itExists = function(it){
		if(it == undefined || it == null){
			return false;
		}
		return true;
	};
	
	this.getPlayerPoints = function(player){
		return player.getPoints();
	};
	
	this.getShortPlayerName = function(player){
		return player.getName().substring(0, Math.min(3, player.getName().length - 1));
	};
	
	
	
	$defer(this.initBoard, 1000);
	return this;
	
	function queueMovement(player, row, col, text){
		return self.queue.push({player: player, row: row, col: col, text: text});
	}
	
	function dequeueMovement(){
		if(self.queue.length == 0){
			return null;
		}
		return self.queue.shift();
	}
	
	function nextMovement(){
		var movement = dequeueMovement();
		if(movement){
			self.board.play(movement.player, movement.row, movement.col);
		}
		lastQuery += self.step;
		if(lastQuery >= self.minQueryStep && self.queue.length <= self.maxQueued){
			lastQuery = 0;
			self.watcher.query();
			$log.info("Quering for more tweets.");
		}
		$defer(nextMovement, self.step);
	}
	
	function runClock(){
		self.clock.tick();
		//self.$root.$eval();
		$defer(runClock, self.clockTick);
	}
	
}
GddBoardCtrl.$inject = ['twitterWatcher', '$log', '$location', '$defer'];