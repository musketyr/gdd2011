describe("Player", function(){
  var player, other;
  
  beforeEach(function(){
    player = new eu.appsatori.gdd2011.Player("codeas", "http://example.com/codeas.png");
    other = new eu.appsatori.gdd2011.Player("other", "http://example.com/other.png");
  });
  
 it("Player should be defined", function() {
    expect(player).toBeDefined();
    expect(player.getName()).toBe("codeas");
    expect(player.getImage()).toBe("http://example.com/codeas.png");
  });
  
  
it("Player should loose and gain points gracefully", function() {
    expect(player).toBeDefined();
    expect(player.loosePoint).toBeDefined();
    expect(player.gainPoint).toBeDefined();
    expect(player.getPoints).toBeDefined();
  
  expect(function() { player.loosePoint(); }).toThrow("Player has no points to loose");
  expect(player.getPoints()).toBe(0);
  
  player.gainPoint();
  
  expect(player.getPoints()).toBe(1);
  
  other.gainPoint();
  
  expect(player.getPoints()).toBe(1);
  
  player.gainPoint();
  player.gainPoint();
  
  expect(player.getPoints()).toBe(3);
  
  player.loosePoint();
  
  expect(player.getPoints()).toBe(2);
  
  player.loosePoint();
  player.loosePoint();
  
  expect(function() { player.loosePoint(); }).toThrow("Player has no points to loose");
  expect(player.getPoints()).toBe(0);
});
  
});

describe("Board", function(){
  var board, player, other;
  
  beforeEach(function(){
    board = new eu.appsatori.gdd2011.Board();
    player = new eu.appsatori.gdd2011.Player("codeas", "http://example.com/codeas.png");
    other = new eu.appsatori.gdd2011.Player("other", "http://example.com/other.png");
  });
  
 it("Board should defined", function() {
    expect(board).toBeDefined();
 });
  
  it("Should be able to play", function() {   
    expect(board.play).toBeDefined();
    expect(board.get).toBeDefined();
    
    expect(function(){ board.play(player, 16, 0); }).toThrow("X must be between 0 and 15 but was 16");
    expect(function(){ board.play(player, 0, 18); }).toThrow("Y must be between 0 and 15 but was 18");
    
    board.play(player, 5,5);
    
    
    expect(function(){ board.get(20, 0); }).toThrow("X must be between 0 and 15 but was 20");
    expect(function(){ board.get(0, 17); }).toThrow("Y must be between 0 and 15 but was 17");
    
    expect(board.get(5, 5).getName()).toBe(player.getName());
   
 });
  
 it("Should turn left upper player", function() {   
   board.play(other, 0, 0);
   board.play(other, 1, 1);
   board.play(other, 2, 2);
   board.play(player, 3, 3);
   
   expect(board.get(0, 0).getName()).toBe(other.getName());
   expect(board.get(1, 1).getName()).toBe(other.getName());
   expect(board.get(2, 2).getName()).toBe(player.getName());
   expect(board.get(3, 3).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
  
 it("Should turn upper player", function() {   
   board.play(other, 3, 0);
   board.play(other, 3, 1);
   board.play(other, 3, 2);
   board.play(player, 3, 3);
   
   expect(board.get(3, 0).getName()).toBe(other.getName());
   expect(board.get(3, 1).getName()).toBe(other.getName());
   expect(board.get(3, 2).getName()).toBe(player.getName());
   expect(board.get(3, 3).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
    
 it("Should turn right upper player", function() {   
   board.play(other, 15, 0);
   board.play(other, 14, 1);
   board.play(other, 13, 2);
   board.play(player, 12, 3);
   
   expect(board.get(15, 0).getName()).toBe(other.getName());
   expect(board.get(14, 1).getName()).toBe(other.getName());
   expect(board.get(13, 2).getName()).toBe(player.getName());
   expect(board.get(12, 3).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });  
  
  
 it("Should turn left player", function() {   
   board.play(other, 0, 0);
   board.play(other, 1, 0);
   board.play(other, 2, 0);
   board.play(player, 3, 0);
   
   expect(board.get(0, 0).getName()).toBe(other.getName());
   expect(board.get(1, 0).getName()).toBe(other.getName());
   expect(board.get(2, 0).getName()).toBe(player.getName());
   expect(board.get(3, 0).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
    
 it("Should turn right player", function() {   
   board.play(other, 15, 0);
   board.play(other, 14, 0);
   board.play(other, 13, 0);
   board.play(player, 12, 0);
   
   expect(board.get(15, 0).getName()).toBe(other.getName());
   expect(board.get(14, 0).getName()).toBe(other.getName());
   expect(board.get(13, 0).getName()).toBe(player.getName());
   expect(board.get(12, 0).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });  
  
 it("Should turn left lower player", function() {   
   board.play(other, 0, 15);
   board.play(other, 1, 14);
   board.play(other, 2, 13);
   board.play(player, 3, 12);
   
   expect(board.get(0, 15).getName()).toBe(other.getName());
   expect(board.get(1, 14).getName()).toBe(other.getName());
   expect(board.get(2, 13).getName()).toBe(player.getName());
   expect(board.get(3, 12).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
  
 it("Should turn lower player", function() {   
   board.play(other, 3, 15);
   board.play(other, 3, 14);
   board.play(other, 3, 13);
   board.play(player, 3, 12);
   
   expect(board.get(3, 15).getName()).toBe(other.getName());
   expect(board.get(3, 14).getName()).toBe(other.getName());
   expect(board.get(3, 13).getName()).toBe(player.getName());
   expect(board.get(3, 12).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
    
 it("Should turn right lower player", function() {   
   board.play(other, 15, 15);
   board.play(other, 14, 14);
   board.play(other, 13, 13);
   board.play(player, 12, 12);
   
   expect(board.get(15, 15).getName()).toBe(other.getName());
   expect(board.get(14, 14).getName()).toBe(other.getName());
   expect(board.get(13, 13).getName()).toBe(player.getName());
   expect(board.get(12, 12).getName()).toBe(player.getName());
   
   expect(player.getPoints()).toBe(2);
   expect(other.getPoints()).toBe(2);
 });
  
  
  it("Should create and pool players", function(){
    
    var xyz = board.getPlayer("xyz", "http://example.com/xyz.png");
    expect(board.getPlayer("xyz", "http://example.com/xyz.png")).toBe(xyz);
    expect(board.getPlayer("xyz", "http://example.com/xyz.png").getName()).toBe("xyz");
    expect(board.getPlayer("xyz", "http://example.com/xyz.png").getImage()).toBe("http://example.com/xyz.png");
    expect(board.getPlayers()[0]).toBe(xyz);
    
  });
  
  
  it("should have working gain listeners", function(){
    var x, y, eventPlayer;
    board.addListener(function(event){
      if(event.type === "gain"){
        x = event.x;
        y = event.y;
        eventPlayer = event.player;
      }
    });
    
    board.play(other, 5, 7);
    expect(eventPlayer).toBe(other);
    expect(x).toBe(5);
    expect(y).toBe(7);
    
    
  });
  
  it("should have working invalid listeners", function(){
	    var x, y, eventPlayer;
	    
	    board.addListener(function(event){
	        if(event.type === "invalid"){
	          x = event.x;
	          y = event.y;
	          eventPlayer = event.player;
	        }
	    });
	    
	    board.play(other, 5, 7);
	    board.play(player, 5, 7);
	    expect(eventPlayer).toBe(player);
	    expect(x).toBe(5);
	    expect(y).toBe(7);
	    
	    
	  });
  
  it("should have working  listeners", function(){
	    var x, y, eventPlayer;
	    
	    board.addListener(function(event){
	        if(event.type === "loose"){
	          x = event.x;
	          y = event.y;
	          eventPlayer = event.player;
	        }
	    });
	    
	    board.play(player, 6, 7);
	    board.play(other, 5, 7);
	    expect(eventPlayer).toBe(player);
	    expect(x).toBe(6);
	    expect(y).toBe(7);
   });
  
  it("should have working end game listeners", function(){
	    var end = false;
	    
	    board.addListener(function(event){
	        if(event.type === "end"){
	          end = true;
	        }
	    });
	    
	   for(var i = 0; i < board.getSize() ; i++){
		   for(var j = 0; j < board.getSize() ; j++){
			   expect(end).toBeFalsy();
			   board.play((i + j) % 2 == 0 ? player : other, i, j);
		   }
	   }
	   expect(end).toBeTruthy();
 }); 
  
  
});


describe("TwitterParser", function(){
	  var parser;
	
	
	it('should parse coordinates properly', function() {
		parser = new eu.appsatori.gdd2011.TwitterParser();
		expect(parser).toBeDefined();
		
		expect(parser.parseCoordinates("", 16)).toEqual({invalid: true});
		expect(parser.parseCoordinates("@gddwall #15", 16)).toEqual({row: 1, col: 5});
		expect(parser.parseCoordinates("@gddwall #ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #Ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #aB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #AB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #gh rules!!!!", 16)).toEqual({invalid: true});
		expect(parser.parseCoordinates("@gddwall #ghxx I want to hack you!", 16)).toEqual({invalid: true});
		  
		parser.magic = true;
		  
		expect(parser.parseCoordinates("@gddwall #gh rules!!!!", 16)).toEqual({row: 0, col: 0});
		expect(parser.parseCoordinates("@gddwall #ghxx I want to hack you!", 16)).toEqual({row: 11, col: 12});
		
		
		  
	});
	
	it('should parse coordinates magically', function() {
		parser = new eu.appsatori.gdd2011.TwitterParser(true);
		expect(parser).toBeDefined();
		
		expect(parser.parseCoordinates("", 16)).toEqual({invalid: true});
		expect(parser.parseCoordinates("@gddwall #15", 16)).toEqual({row: 1, col: 5});
		expect(parser.parseCoordinates("@gddwall #ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #Ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #aB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #AB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		
		expect(parser.parseCoordinates("@gddwall #gh rules!!!!", 16)).toEqual({row: 0, col: 0});
		expect(parser.parseCoordinates("@gddwall #ghxx I want to hack you!", 16)).toEqual({row: 11, col: 12});
		  
	});
	
	it('should parse coordinates magically "magic"', function() {
		parser = new eu.appsatori.gdd2011.TwitterParser(true);
		expect(parser).toBeDefined();
		
		expect(parser.parseCoordinates("", 16)).toEqual({invalid: true});
		expect(parser.parseCoordinates("@gddwall #15", 16)).toEqual({row: 1, col: 5});
		expect(parser.parseCoordinates("@gddwall #ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #Ab #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #aB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		expect(parser.parseCoordinates("@gddwall #AB #00 rules!!!!", 16)).toEqual({row: 10, col: 11});
		
		expect(parser.parseCoordinates("@gddwall #gh rules!!!!", 16)).toEqual({row: 0, col: 0});
		expect(parser.parseCoordinates("@gddwall #ghxx I want to hack you!", 16)).toEqual({row: 11, col: 12});
		  
	});
	
});


describe("BoardCanvas", function(){
	  var canvas;
	  
	  beforeEach(function(){
		  canvas = new eu.appsatori.gdd2011.BoardCanvas(new eu.appsatori.gdd2011.Clock());
	  });
	
	
	it('should count size properly', function() {
		expect(canvas).toBeDefined();
		expect(canvas.getCanvasSize()).toBe(481);
		  
	});
	
});


describe("Clock", function(){
	var clock;
	
	
	beforeEach(function(){
		clock = new eu.appsatori.gdd2011.Clock();
	});
	
	
	it('should count size properly', function() {
		var over = false, counter = 0, clockCounter = 0;
		
		expect(clock).toBeDefined();
		
		clock.onTick(function(suppliedCounter){
			counter++;
			clockCounter = suppliedCounter;
			return !over;
		});
		
		expect(counter).toBe(0);
		expect(clockCounter).toBe(0);
		
		clock.tick();
		expect(counter).toBe(1);
		expect(clockCounter).toBe(1);
		
		clock.tick();
		expect(counter).toBe(2);
		expect(clockCounter).toBe(2);
		
		over = true;
		
		clock.tick();
		expect(counter).toBe(3);
		expect(clockCounter).toBe(3);
		
		clock.tick();
		expect(counter).toBe(3);
		expect(clockCounter).toBe(3);
		
		over = false;
		
		clock.onTick(function(suppliedCounter){
			counter++;
			clockCounter = suppliedCounter;
			return !over;
		});
		
		clock.tick();
		expect(counter).toBe(4);
		expect(clockCounter).toBe(1);
		
		clock.tick();
		expect(counter).toBe(5);
		expect(clockCounter).toBe(2);
		
		over = true;
		
		clock.tick();
		expect(counter).toBe(6);
		expect(clockCounter).toBe(3);
		
		clock.tick();
		expect(counter).toBe(6);
		expect(clockCounter).toBe(3);
		  
	});
	
	
});
