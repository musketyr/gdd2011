/* App Controllers */


function GddBoardCtrl(twitterWatcher, $log, $location, $defer) {
	var self = this, 
		canvas, 
		loc = ($location || {search: {magic: false, q: '@gddwall', m: 'gddwall', w: '#gdd2011', id: 'tw2011', h: 'gddcz', g: 'gdd2011'}}), lastQuery = 0;
	
	this.canvasWidth = 481;
	this.canvasHeight = 481;
	this.clockTick = 50;
	this.step = 2000;
	this.minQueryStep = 15000;
	this.maxQueued = 100;
	this.wallStep = 150;
	this.queue = [];
	this.master = loc.search.m || 'gddwall';
	this.id = loc.search.id || 'tw2011';
	this.wallTweetsMaxCount = 7;
	this.wallQuery = loc.search.w || '#gddcz';
	this.gplusQuery = loc.search.g || 'gdd2011';
	this.wallTweets = [];
	this.winner = null;
	this.startDate =  loc.search.magic ? new Date(0) : new Date();
	this.finished = false;
	this.highlight = loc.search.h || 'gddcz';
	this.lastTweetTime = 0;
	
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
		self.finished = true;
		var winners = angular.Array.orderBy(self.board.getPlayers(), self.getPlayerPoints, true);
		if(winners.length > 0){
			self.winner = winners[0];
		}
		if(self.queue.length > 0){
			self.startDate = self.queue[self.queue.length - 1].time;
		} else {
			self.startDate = new Date();
		}
		self.boardCanvas.gameOver();
		$defer(self.initBoard, self.boardCanvas.getFinalAnimationDuration());
	};
	
	this.initBoard = function(){
		self.clock = new eu.appsatori.gdd2011.Clock();
		
		self.boardCanvas = new eu.appsatori.gdd2011.CakeBoardCanvas(self.clock);
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
			self.wallWatcher = twitterWatcher.watch(self.wallQuery, {gplusQuery: self.gplusQuery/*, from: new Date(new Date.getTime() - 1000 * 60 * 30)*/});
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
		
		runClock();

		$defer(function(){ 
			self.watcher.query(); 
			nextMovement();
			self.finished = false;
		},self.boardCanvas.getStartAnimationDuration()) ;
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
		return player.getName().substring(0, Math.min(15, player.getName().length));
	};
	
	this.tweetClasses = function(tweet){
		var classes = ['tweet'];
		if(tweet != undefined){
			classes.push(tweet.service + '-logo');
		}
		if(tweet != undefined && tweet.from_user === self.highlight){
			classes.push('gdd');
		}
		if(tweet != undefined && tweet.from_user === (self.winner || {getName: function(){return '';}}).getName()){
			classes.push('king');
		}
		return classes.join(' ');
	};
	
	this.gameDelay = function(){
		if(self.lastTweetTime == 0){
			return '';
		}
		var deltaSec  = Math.floor((new Date().getTime() - self.lastTweetTime) / 1000);
		var seconds = deltaSec % 60;
		var minutes = Math.floor(deltaSec / 60);
		// translate this if needed
		if(seconds == 1 && minutes == 0){
			return "Last movement tweeted 1 second ago";
		} else if(seconds > 1 && minutes == 0){
			return "Last movement tweeted " + seconds + " seconds ago";
		}  else if(minutes == 1){
			return "Last movement tweeted 1 minute ago";
		} else if(minutes > 1){
			return "Last movement tweeted " + minutes + " minutes ago";
		}
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
		if(movement && !self.finished){
			self.lastTweetTime = movement.time;
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
		$defer(runClock, self.clockTick );
	}
	
}
GddBoardCtrl.$inject = ['twitterWatcher', '$log', '$location', '$defer'];
