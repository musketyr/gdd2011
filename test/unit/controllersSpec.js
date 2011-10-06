/* jasmine specs for controllers go here */

describe('GddBoardCtrl', function(){
  var gddBoardCtrl, scope, log, location, defer;

  beforeEach(function(){
	  scope = angular.scope();
	  log  = scope.$service('$log');
	  location  = scope.$service('$location');
	  defer  = scope.$service('$defer');
	  gddBoardCtrl = new GddBoardCtrl({
		  watch: function(){ return { onTweet: function(){}, query: function () {} }; }
	  }, log, location, defer);
  });

});
