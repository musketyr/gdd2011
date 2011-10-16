/* App Controllers */


function GddBoardCtrl(twitterWatcher, $log, $location, $defer) {
	var self = this, 
		canvas, 
		loc = ($location || {search: {magic: false, q: '@gddwall', m: '@gddwall', w: '#gddcz', id: 'tw2011'}}), lastQuery = 0;
	
	this.canvasWidth = 481;
	this.canvasHeight = 481;
	this.clockTick = 50;
	this.step = 2000;
	this.minQueryStep = 15000;
	this.maxQueued = 100;
	this.wallStep = 150;
	this.queue = [];
	this.master = loc.search.m || '@gddwall';
	this.id = loc.search.id || 'tw2011';
	this.wallTweetsMaxCount = 5;
	this.wallQuery = loc.search.w || '#gddcz';
	this.wallTweets = [];
	this.winner = null;
	this.startDate =  loc.search.magic ? new Date(0) : new Date();
	
	this.normal = function(){
		self.clockTick = 50;
		self.step = 2000;
		self.minQueryStep = 15000;
	};
	
	this.slow = function(){
		self.clockTick = 250;
		self.step = 10000;
		self.minQueryStep = 60000;
	};
	
	this.quick = function(){
		self.clockTick = 10;
		self.step = 400;
		self.minQueryStep = 3000;
	};
	
	this.turbo = function(){
		self.clockTick = 10;
		self.step = 80;
		self.minQueryStep = 1000;
	};
	
	this.restart = function(){
		var winners = angular.Array.orderBy(self.board.getPlayers(), self.getPlayerPoints, true);
		if(winners.length > 0){
			$log.info(winners);
			self.winner = winners[0];
			$log.info(self.winner);
		}
		if(self.queue.length > 0){
			self.startDate = self.queue[self.queue.length - 1].time;
		} else {
			self.startDate = new Date();
		}
		self.initBoard();
	};
	
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
				//self.$root.$eval();
			}
			if (event.type === "end"){
				self.restart();

			}
		});
		
		// hack to init a few players on the left side
		self.board.getPlayer('appsatori', 'https://si0.twimg.com/profile_images/1133886792/miniico.png');
		self.board.getPlayer('inmite', 'https://si0.twimg.com/profile_images/107147982/inmite.png');
		self.board.getPlayer('google', 'https://si0.twimg.com/profile_images/77186109/favicon.png');
		self.board.getPlayer('android', 'https://si0.twimg.com/profile_images/1565848902/android_logo__1_.gif');
		self.board.getPlayer('angularjs', 'https://si0.twimg.com/profile_images/1143997916/ng-logo.png');
		self.board.getPlayer('app_engine', 'https://si0.twimg.com/profile_images/58079916/appengine_lowres.jpg');
		self.board.getPlayer('googledocs', 'https://si0.twimg.com/profile_images/1157545737/docs-128.png');
		self.board.getPlayer('googlemaps', 'https://si0.twimg.com/profile_images/1565887810/MapsPin.png');
		
		

		self.watcher = twitterWatcher.watch(loc.search.q || '@gddwall', {from: self.startDate, noCache: !loc.search.magic});
		self.watcher.clearCache();
		
		self.parser = new eu.appsatori.gdd2011.TwitterParser(loc.search.magic);
		
		self.watcher.onTweet(function(tweet){
			var coor = self.parser.parseCoordinates(tweet.text, self.boardCanvas.getSize());
			if(!coor.invalid){
				queueMovement(self.board.getPlayer(tweet.from_user, tweet.profile_image_url), coor.row, coor.col, tweet.text, tweet.created_at);
			}
		});
		
		self.masterWatcher = twitterWatcher.watch('from:' + self.master + ' ' + self.id, {from: new Date(), noCache: true});
		self.masterWatcher.clearCache();
		
		self.masterWatcher.onTweet(function(tweet){
			var command = tweet.text.replace(self.id, '');
			$log.info("Command from master: " + command);
			try {
				self.$eval(command);
			} catch (e){
				$log.error(e);
			}
		});
		
		if(self.wallQuery == self.watcher.getQuery()){
			self.wallWatcher = self.watcher;
		} else {
			self.wallWatcher = twitterWatcher.watch(self.wallQuery);
		}
		
		self.wallWatcher.onTweet(function(tweet){
			self.wallTweets.push(tweet);
		});
		
		self.clock.onTick(function(counter){
			if(counter % self.wallStep == 0){
				if(self.wallTweets.length > self.wallTweetsMaxCount){
					self.wallTweets.shift();
				} else {
					self.wallTweets.push(self.wallTweets.shift());
				}
			}
			return true;
		});

		self.clock.onTick(function(counter){
			if((counter * self.clockTick) %  self.minQueryStep <= self.clockTick){
				self.masterWatcher.query();
				self.wallWatcher.query();
			}
			return true;
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
	
	function queueMovement(player, row, col, text, time){
		return self.queue.push({player: player, row: row, col: col, text: text, time: new Date(time)});
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
		$defer(runClock, self.clockTick);
	}
	
}
GddBoardCtrl.$inject = ['twitterWatcher', '$log', '$location', '$defer'];
