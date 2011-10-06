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
            if(other){
                board[otherIndex] = player;
              player.gainPoint();
              other.loosePoint();
              
              notifyListeners("gain", player, newX, newY);
              notifyListeners("loose", other, newX, newY);
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
      
      this.addListener = function(listener){
        listeners.push(listener);
      };
     
      function assertSize(x, variableName){
        if(x > size - 1 || x < 0) {
          throw variableName + " must be between 0 and " + (size - 1) + " but was " + x;
        }
      }
      
      function notifyListeners(type, player, x, y){
        for(var i = 0; i < listeners.length; i++){
          listeners[i]({type: type, player: player, x: x, y: y});
        }
      }
      
      return this;
    };
    
    // BoardCanvas
    eu.appsatori.gdd2011.BoardCanvas = function(config) {
    	var self = this, c = config || {}, icon, size, background, line, canvas;
    	
    	id = c.id || 'board';
    	
    	icon = c.icon || 30;
    	size = c.size || 16;
    	
    	background = c.background || 'whiteSmoke';
    	line = c.line || {color: "#ccc", stroke:  0.5 };
    	
    	this.getCanvasSize = function(){ return icon * size + 1; };
    	this.getSize = function(){ return size; };
    	this.getIcon = function(){ return icon; };
    	 
    	this.placeIcon = function(x, y, url){
    		var row, col;
    		
    		row = x * icon;
    		col = y * icon;

    		var img = new Image();
    		img.src = url;

    		canvas.drawImage(img, col, row, icon, icon);
    	};
    	
    	this.initBoard = function(){
    		canvas = getCanvas();
    		initCanvas();
    		drawLines();
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
    		canvas.fillRect(0, 0, self.getCanvasSize(), self.getCanvasSize());
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
    

})(window);
