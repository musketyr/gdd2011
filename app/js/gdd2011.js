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
