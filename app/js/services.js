angular.service('twitterWatcher', function($xhr, $log){
	
	this.watch = function(q){
		self = this;
		
		var tweets = [], queryString = getDefaultQueryString(), onTweetListners = [], pending = [];
		
		this.query = function(callback, internal){
			var execute = internal || pending.length == 0;
			
			if(pending){
				pending.push(callback);
			}
			if(execute){
				var url = 'http://search.twitter.com/search.json' + queryString;
				$log.info('Quering twitter: ' + url);
				$xhr('JSON', url, function(code, response){
					if(code != 200){
						$log.error("Reading tweets failed, Code: " + code);
						notifyPending(tweets);
						return [];
					}
					notifyListeners(response.results || []);
					tweets = (response.results || []).concat(tweets);
					if(response.next_page == undefined){
						queryString = withCallback(response.refresh_url)|| getDefaultQueryString();
						notifyPending(tweets);
					} else {
						queryString = withCallback(response.next_page);
						self.query(callback, true);
					}
					
				}, function(code, response){
					$log.error("Reading tweets failed, Code: " + code);
					notifyPending(tweets);
				});
			}
			return tweets;
		};
		
		this.onTweet = function(listener){
			onTweetListners.push(listener);
		};
		
		this.isPending = function(){
			return pending.length > 0;
		};
		
		this.getQuery = function(){
			return q;
		};
		
		return this;
		
		function notifyListeners(tweets){
			 for(var i = 0; i < onTweetListners.length; i++){
				 for(var j = 0; j < tweets.length; j++){
					 onTweetListners[i](tweets[j]);				 
				 }
		     }
		}
		
		function notifyPending(tweets){
			 for(var i = 0; i < pending.length; i++){
				 (pending[i] || function(){})(tweets);				 
		     }
			 pending = [];
		}
		
		function escape(q){
			if(q && q != undefined){
				return q.replace('#', '%23');
			}
			return q;
		}

		function withCallback(url){
			return url + "&callback=JSON_CALLBACK";
		}
		
		function getDefaultQueryString(){
			return withCallback("?q=" + escape(q));
		}
		
		
	};
	
	return this;
}, {$inject: ['$xhr', '$log']});
