angular.service('twitterWatcher', function($xhr, $log, $window, $defer){
	
	var Watcher = function(q, config){
		var self = this;
		
		var c = config || {};
		
		c.from = c.from || new Date(0);
		c.to = c.to || new Date(new Date().getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
		
		var tweets = c.noCache ? [] : getCachedTweets(), queryString = c.noCache ? getDefaultQueryStringNoCache() : getDefaultQueryString(), onTweetListners = [], pending = [];
		
		var firstFromCache = !c.noCache && tweets.length > 0;
		
		this.query = function(callback){
			var execute = pending.length == 0;

			pending.push(callback);
			
			if(execute){
				if(firstFromCache){
					notifyListeners(tweets);
					notifyPending(tweets);
					firstFromCache = false;
					return tweets;
				}
				
				var url = 'http://search.twitter.com/search.json' + queryString;
				$log.info('Quering twitter: ' + url);
				$xhr('JSON', url, function(code, response){
					if(code != 200){
						$log.error("Reading tweets failed, Code: " + code);
						
						notifyPending(tweets);
						return [];
					}
					notifyListeners(response.results || []);
					updateTweets(response.results);
					if(response.next_page == undefined){
						updateQueryString(withCallback(response.refresh_url) || getDefaultQueryString());
					} else {
						updateQueryString(withCallback(response.next_page));
					}
					notifyPending(tweets);
					
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
		
		this.clearCache = function(){
			if(!$window || !$window.localStorage){
				return true;
			}
			
			$window.localStorage[getCachedQueryStringKey()] = getDefaultQueryStringNoCache();
			$window.localStorage[getCachedTweetsKey()] = [];
			return true;
		};
		
		return this;
		
		function notifyListeners(tweets){
			 for(var j = 0; j < tweets.length; j++){
				 var tweet = tweets[j];
				 var createdAt = Date.parse(tweet.created_at);
				 if(c.from.getTime() <= createdAt && c.to.getTime() >= createdAt){
					 for(var i = 0; i < onTweetListners.length; i++){
						 onTweetListners[i](tweet);				 
					 }
				 }
			 }
		}
		
		function notifyPending(tweets){
			 for(var i = 0; i < pending.length; i++){
				 (pending[i] || function(){})(angular.Array.filter(tweets, function(tweet){
					 var createdAt = Date.parse(tweet.created_at);
					 return c.from.getTime() <= createdAt && c.to.getTime() >= createdAt;
				 }));				 
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
			var ret = url.replace(/&calback=angular.*/i, '') + "&callback=JSON_CALLBACK";
			return ret;
		}
		
		function getCachedTweetsKey(){
			return 'gdd2011.twitterWatcher.cache.' + q;
		}
		
		function getCachedTweets(){
			if(!$window || !$window.localStorage){
				return [];
			}
			
			return angular.fromJson($window.localStorage[getCachedTweetsKey()]) || [];
		}
		
		function cacheTweets(tweets){
			if(!$window || !$window.localStorage){
				return false;
			}
			
			$window.localStorage[getCachedTweetsKey()] = angular.toJson(tweets);
			return true;
		}
		
		function updateTweets(newOnes){
			tweets = (newOnes || []).concat(tweets);
			cacheTweets(tweets);
		}
		
		function getCachedQueryStringKey(){
			return 'gdd2011.twitterWatcher.queryString.' + q;
		}
		
		function getCachedQueryString(){
			if(!$window || !$window.localStorage){
				return ;
			}
			
			return $window.localStorage[getCachedQueryStringKey()] || getDefaultQueryStringNoCache();
		}
		
		function cacheQueryString(qs){
			if(!$window || !$window.localStorage){
				return false;
			}
			
			$window.localStorage[getCachedQueryStringKey()] = qs;
			return true;
		}
		
		function updateQueryString(qs){
			queryString = qs;
			cacheQueryString(qs);
		}
		
		function getDefaultQueryStringNoCache(){
			return withCallback("?q=" + escape(q));
		}
		
		function getDefaultQueryString(){
			return getCachedQueryString() || getDefaultQueryStringNoCache();
		}
	};
	
	this.watch = function(q, config){
		return new Watcher(q, config);
	};
	
	return this;
}, {$inject: ['$xhr', '$log', '$window', '$defer']});
