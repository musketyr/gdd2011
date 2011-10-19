(function(window) {
    // namespace
    var eu;
    eu = window.eu || {};
    eu.appsatori = eu.appsatori || {};
    eu.appsatori.gdd2011 = eu.appsatori.gdd2011 || {};
    window.eu = eu;

    // Player
    eu.appsatori.gdd2011.Player = function(name, image) {
        var points = 0;
      
      
        this.getName = function() {
            return name;
        };
        
        this.getImage = function() {
            return image;
        };
      
      this.loosePoint = function(){
        if(!points){
          throw "Player has no points to loose";
        }
        points = points - 1;
      };
      
      
      this.gainPoint = function(){
        points = points + 1; 
      };
      
      this.getPoints = function(){
        return points;
      };
      
        return this;
    };
  
    // RegularMatrix
    eu.appsatori.gdd2011.RegularMatrix = function(dimension) {
      var self = this;
    	
      var size = dimension;
      var table = [];
    
      this.eachItem = function(iter){
      	for (var i = 0; i < table.length; i++) {
			var item = table[i];
			if(item == 0 || item == undefined){
				continue;
			}
			iter(item);
		}
      };
      
      this.put = function(item, x, y){
        assertSize(x, "X");
        assertSize(y, "Y");
        
        var oldOne = self.get(x,y);
        
        table[computeIndex(x,y)] = item;

        return oldOne;
      };
      
      this.get = function(x, y){
        assertSize(x, "X");
        assertSize(y, "Y");
        return table[computeIndex(x,y)];
      };
      
      this.getSize = function(){
    	  return size;
      };
      
      return this;
      
      function computeIndex(x, y){
    	  return y * size + x;
      }
      
      function assertSize(x, variableName){
    	  if(x > size - 1 || x < 0) {
    		  throw variableName + " must be between 0 and " + (size - 1) + " but was " + x;
    	  }
      }
    };
    
    
    // Board
    eu.appsatori.gdd2011.Board = function() {
      var size = 16;
      var board = [];
      var indexes = {};
      var players = [];
      var listeners = [];
      var occupied = 0;
      
      var directions = {
        left_upper:  {x: -1,  y: -1, test: function(x,y){ return x > 0       && y > 0      ; } },
        upper:       {x:  0,  y: -1, test: function(x,y){ return                y > 0      ; } },
        right_upper: {x:  1,  y: -1, test: function(x,y){ return x < size -1 && y > 0      ; } },
        left:        {x: -1,  y:  0, test: function(x,y){ return x > 0                     ; } },
        right:       {x:  1,  y:  0, test: function(x,y){ return x < size -1               ; } },
        left_lower:  {x: -1,  y:  1, test: function(x,y){ return x > 0       && y < size -1; } },
        lower:       {x:  0,  y:  1, test: function(x,y){ return                y < size -1; } },
        right_lower: {x:  1,  y:  1, test: function(x,y){ return x < size -1 && y < size -1; } }
        
      };
      
      this.play = function(player, x, y){
        assertSize(x, "X");
        assertSize(y, "Y");
        
        var index = y * size + x;
        var oldOne = board[index];
        
        if(oldOne != undefined){
        	notifyListeners("invalid", player, x, y);
        	return;
        	
        }
        
        board[index] = player;
        
        
        if(oldOne != player){
          player.gainPoint();
          notifyListeners("gain", player, x, y);
          
          if(oldOne){
            oldOne.loosePoint();
            notifyListeners("loose", oldOne, x, y);
          }
        }
        
        for(var dirName in directions){
          var dir = directions[dirName];
          
          if(dir.test(x,y)){
            var newX = x + dir.x;
            var newY = y + dir.y;
            var otherIndex = (newY) * size + newX;
            var other = board[otherIndex];
            if(other && other != player){
                board[otherIndex] = player;
              player.gainPoint();
              other.loosePoint();
              
              notifyListeners("gain", player, newX, newY, dir);
              notifyListeners("loose", other, newX, newY, dir);
            }
          }
        }
      };
      
      this.get = function(x, y){
        assertSize(x, "X");
        assertSize(y, "Y");
        return board[y * size + x];
      };
      
      this.getPlayer = function(name, image){
    	var index = indexes[name];
    	if(index != undefined){
    		return players[index];
    	}

        var ret = new eu.appsatori.gdd2011.Player(name, image);
        indexes[name] = players.push(ret) - 1;
        return ret;
      };
      
      this.getPlayers = function(){
    	  return players;
      };
      
      this.getSize = function(){
    	  return size;
      };
      
      this.addListener = function(listener){
        listeners.push(listener);
      };
      
      this.addListener(function(event){
	      if(event.type === "gain" && event.originalDirection == undefined){
	    	  occupied++;
	    	  if(occupied == size * size){
	    		  notifyListeners("end", event.player, event.x, event.y, event.originalDirection);
	    	  }
		  }
      });
     
      return this;
      
      function assertSize(x, variableName){
    	  if(x > size - 1 || x < 0) {
    		  throw variableName + " must be between 0 and " + (size - 1) + " but was " + x;
    	  }
      }
      
      function notifyListeners(type, player, x, y, originalDirection){
    	  for(var i = 0; i < listeners.length; i++){
    		  listeners[i]({type: type, player: player, x: x, y: y, originalDirection: originalDirection});
    	  }
      }
    };
    
    // BoardCanvas
    eu.appsatori.gdd2011.BoardCanvas = function(clock, config) {
    	var self = this, c = config || {}, icon, size, background, line, canvas;
    	
    	id = c.id || 'board';
    	
    	icon = c.icon || 30;
    	size = c.size || 16;
    	
    	background = c.background || 'whiteSmoke';
    	line = c.line || {color: "#ccc", stroke:  0.5 };
    	
    	this.getCanvasSize = function(){ return icon * size + 1; };
    	this.getSize = function(){ return size; };
    	this.getIcon = function(){ return icon; };
    	 
    	this.placeIcon = function(x, y, url, direction){
    		var row, col;
    		
    		row = x * icon;
    		col = y * icon;

    		var img = new Image();
    		img.src = url;
    		
    		var initialized = false;
    		
    		clock.onTick(function(counter){
    			var helper = (counter + 4);
    			var imageSize = helper % icon + 1;
    			if(direction != undefined && helper <= icon){
    				return true;
    			}
    			
    			if(direction == undefined && helper >= icon || direction != undefined && helper >= 2 * icon){
    				return false;
    			}
    			var colDif, rowDif, height, width;
    			
    			colDif = rowDif = 0;
    			height = width = imageSize;
    			
    			if(direction != undefined){
    				if(direction.x < 0/* && direction.y != 0*/){
    					rowDif = icon - imageSize;
    				}
    				if(direction.y < 0 /*&& direction.x != 0*/){
    					colDif = icon - imageSize;
    				}
    				if(direction.x == 0 && direction.y != 0){
    					height = icon;
    				}
    				if(direction.x != 0 && direction.y == 0){
    					width = icon;
    				}
    				
    			} else {
    				colDif = rowDif = ((icon - imageSize ) / 2);
    			}
    			
    			
    			fillWithBackground(col + colDif, row + rowDif, width, height);
    			canvas.drawImage(img, col + colDif, row + rowDif, width, height);
    			return true;
    			
    		});
    	};
    	
    	this.initBoard = function(){
    		canvas = getCanvas();
    		initCanvas();
    		drawLines();
    		drawPositions();
    	};
    	
    	this.gameOver = function(){
    		self.initBoard();
    	};
    	
    	this.getFinalAnimationDuration = function(){
    		return 0;
    	};
    	
    	this.getStartAnimationDuration = function(){
    		return 0;
    	};
    	
    	
    	return this;
    	
    	function getCanvas(){
    		var board = document.getElementById(id);
    		if(!board){
    			throw "Canvas with id " + id + " is not present. Cannot draw board!";
    		}
    		return board.getContext('2d');
    	}
    	
    	function initCanvas(){
    		canvas.fillStyle = background;
    		fillWithBackground(0, 0, self.getCanvasSize(), self.getCanvasSize());
    	}
    	
    	function fillWithBackground(col, row, width, height){
    		canvas.fillStyle = background;
    		canvas.fillRect(col, row, width, height);
    	}
    	
    	
    	function drawPositions(){
    		var hunagryConstant = Math.round(icon / 10);
    		for(var row = 0; row < size; row++){
    			for(var col = 0; col < size; col++){
    				drawText(row.toString(size) + col.toString(size), Math.round((col + 0.2) * icon), Math.round((row + 0.8) * icon) , icon / 2);
    			}
    		}
    	}
    	
    	function drawText(text, col, row, height){
    		canvas.font = height + "pt Arial sans-serif ";
    		canvas.fillStyle = "grey";
    		canvas.fillText(text, col, row);
    	}
    	
    	function drawLines() {
    		canvas.beginPath();
    		for ( var x = 0; x <= self.getCanvasSize(); x += icon) {
    			canvas.moveTo(line.stroke + x, 0);
    			canvas.lineTo(line.stroke + x, self.getCanvasSize());
    		}

    		for ( var y = 0; y <= self.getCanvasSize(); y += icon) {
    			canvas.moveTo(0, line.stroke + y);
    			canvas.lineTo(self.getCanvasSize(), line.stroke + y);
    		}

    		canvas.strokeStyle = line.color;
    		canvas.stroke();
    	}
    	
    };
    
    // CakeBoardCanvas
    eu.appsatori.gdd2011.CakeBoardCanvas = function(clock, config) {
    	var self = this, c = config || {}, icon, size, background, line, canvas, matrix;
    	
    	id = c.id || 'board';
    	
    	icon = c.icon || 31;
    	size = c.size || 16;
    	
    	background = c.background || 'whiteSmoke';
    	line = c.line || {color: "#ccc", stroke:  0.5 };
    	matrix = new eu.appsatori.gdd2011.RegularMatrix(size);
    	
    	this.getCanvasSize = function(){ return icon * size ; };
    	this.getSize = function(){ return size; };
    	this.getIcon = function(){ return icon; };
    	
    	// x,y is switched in here :/
    	this.placeIcon = function(y, x, url, direction){
    		var img = new Image();
    		img.src = url;
    		
    		var imgIcon = new ImageNode(img,{
    			dX: x * icon,
    			dY: y * icon,
    			dWidth: icon,
    			dHeight: icon,
    			opacity: 1
    		});
    		
    		if(direction == undefined){
    			direction = {x: 0,  y: 0 };
    		}
    		
    		var tween = 'sproing', time = 1000 + (Math.random() * 0.3 + 0.7) *  1000 * (Math.abs(direction.x) + Math.abs(direction.y));
    		imgIcon.animateFrom('dWidth', 0, time, tween);
    		imgIcon.animateFrom('dHeight', 0, time, tween);
    		imgIcon.animateFrom('dX', x * icon + icon / 2 - direction.y * icon, time, tween);
    		imgIcon.animateFrom('dY', y * icon + icon / 2 - direction.x * icon, time, tween);
    		imgIcon.animateFrom('opacity', 0.5, time, 'linear');
    		canvas.append(imgIcon);
    		
    		var oldIcon = matrix.put(imgIcon, x, y);
    		if(oldIcon != undefined){
    			oldIcon.animateTo('opacity', 0, time, 'linear');
    		}
    	};
    	
    	this.initBoard = function(){
    		canvas = createCanvas();
    		createBoard();
    	};
    	
    	this.getFinalAnimationDuration = function(){
    		return 15000;
    	};

    	this.getStartAnimationDuration = function(){
    		return 5000;
    	};
    	
    	this.gameOver = function(){
    		var blurTime = self.getFinalAnimationDuration();
    		matrix.eachItem(function(img){
    			img.animateTo('opacity', 0, blurTime, 'square');
    			img.animateTo('dWidth', 4 * Math.random() * icon, blurTime, 'square');
    			img.animateTo('dHeight', 4 * Math.random() * icon, blurTime, 'square');
    			img.animateTo('dX', 4 * (Math.random() - 0.5) * self.getCanvasSize(), blurTime, 'square');
    			img.animateTo('dY', 4 * (Math.random() - 0.5) * self.getCanvasSize(), blurTime, 'square');
    		});
    	};
    	
    	
    	return this;
    	
    	function createCanvas(){
    		var board = document.getElementById('canvasDiv');
    		var children = [];
    		
    		for ( var i = 0; i < board.childNodes.length; i++) {
				children.push(board.childNodes[i]);
			}
    		
    		for ( var i = 0; i < children.length; i++) {
				board.removeChild(children[i]);
			}
    		
    		if(!board){
    			throw "Canvas with id " + id + " is not present. Cannot draw board!";
    		}
    		
    		return new Canvas(board, self.getCanvasSize(), self.getCanvasSize());
    	}
    	
    	function createBoard(){
    		var boardBg = new Rectangle(self.getCanvasSize(), self.getCanvasSize(), {fill: background});
    		canvas.append(boardBg);
    		
    		for ( var x = 0; x <= self.getCanvasSize(); x += icon) {
    			var l = new Line(x, 0, x, self.getCanvasSize(), {stroke: line.color, strokeWidth: line.stroke});
    			l.animateFrom('y1', Math.round(self.getCanvasSize() / 2), self.getStartAnimationDuration(), 'cube');
    			l.animateFrom('y2', Math.round(self.getCanvasSize() / 2), self.getStartAnimationDuration(), 'cube');
    			canvas.append(l);
    		}
    		
    		for ( var y = 0; y <= self.getCanvasSize(); y += icon) {
    			var l = new Line(0, y, self.getCanvasSize(), y, {stroke: line.color, strokeWidth: line.stroke});
    			l.animateFrom('x1', Math.round(self.getCanvasSize() / 2), self.getStartAnimationDuration(), 'cube');
    			l.animateFrom('x2', Math.round(self.getCanvasSize() / 2), self.getStartAnimationDuration(), 'cube');
    			canvas.append(l);
    		}
    		
    		for(var row = 0; row < size; row++){
    			for(var col = 0; col < size; col++){
    	    		var txNode = new TextNode(row.toString(size) + col.toString(size), {
    	    			x: col * self.getIcon() + (self.getIcon() / 2), 
    	    			y: row * self.getIcon() + (self.getIcon() / 2), 
    	    			textAlign: 'center', 
    	    			textBaseline: 'middle', 
    	    			width: self.getIcon(),
    	    			height: self.getIcon(),
    	    			fill: "grey",
    	    			opacity: 1,
    	    			font: "" + (self.getIcon() / 2) + "pt 'Open Sans', sans-serif "
    	    		});
    	    		txNode.animateFrom('x', Math.round(self.getCanvasSize() / 2 - icon / 2), self.getStartAnimationDuration(), 'sine');
    	    		txNode.animateFrom('y', Math.round(self.getCanvasSize() / 2 - icon / 2), self.getStartAnimationDuration(), 'sine');
    	    		txNode.animateFrom('opacity', 0, self.getStartAnimationDuration(), 'sine');
    	    		canvas.append(txNode);
    			}
    		}
    	}
    	
    };
    
    // TwitterParser
    eu.appsatori.gdd2011.TwitterParser = function(magic) {

    	var self = this;
    	
    	this.magic = !!magic;
    	
    	this.parseCoordinates = function(tweet, boardSize){
    		var match = (tweet || "").match(/#[0-9a-f]{2}/i);
    		
    		if(match){
    			return {row: parseInt(match[0][1], boardSize), col: parseInt(match[0][2], boardSize)};
    		}
    		
    		if(!self.magic || !tweet){
    			return {invalid: true};
    		}
    		
    		var counter = 0;
    		for(var i = 0; i < tweet.length ; i++){
    			counter += tweet.charCodeAt(i);
    		}
    		
    		var modul = Math.pow(boardSize, 2);
    		var modulatedCounter = counter % modul;
    		var row = Math.floor(modulatedCounter / boardSize);
    		var col = modulatedCounter % boardSize;
    		return {row: row, col: col};
    	};
    	
    	return this;
    };
    
    // Clock
    eu.appsatori.gdd2011.Clock = function() {
    	var self = this;
    	var onTickListeners = [];
    	var onTickListenersCoutners = [];
    	

		this.tick = function() {
			var overIndexes = [];
			for ( var i = 0; i < onTickListeners.length; i++) {
				var listener = onTickListeners[i];
				if (listener != 0) {
					var counter = onTickListenersCoutners[i];
					counter++;
					onTickListenersCoutners[i] = counter;
					var over = true;
					try{
						var over = !onTickListeners[i](counter);
					} catch(e) {
						// ok over is true
					}
					if (over) {
						overIndexes.push(i);
					}
				}

			}
			for ( var i = 0; i < overIndexes.length; i++) {
				onTickListeners[overIndexes[i]] = 0;
				onTickListenersCoutners[overIndexes[i]] = 0;
			}
		};
    	
    	this.onTick = function(listener){
    		if(listener != undefined){
    			onTickListeners.push(listener);
    			onTickListenersCoutners.push(0);
    		}
    	};
    	
    	return this;
    };
    

})(window);
