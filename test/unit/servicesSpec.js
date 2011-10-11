/* jasmine specs for services go here */


describe('Twitter watcher', function(){
  var scope, $browser, twitter, dummyQueryData;

  dummyQueryData 		= {"completed_in":0.073,"max_id":120231035274412032,"max_id_str":"120231035274412032","page":1,"query":"%40musketyr","refresh_url":"?since_id=120231035274412032&q=%40musketyr","results":[{"created_at":"Sat, 01 Oct 2011 20:18:07 +0000","from_user":"littleli","from_user_id":606456,"from_user_id_str":"606456","geo":null,"id":120231035274412032,"id_str":"120231035274412032","iso_language_code":"pl","metadata":{"result_type":"recent"},"profile_image_url":"http://a3.twimg.com/profile_images/55201271/LITTLELI_normal.gif","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"@musketyr nj, ot\u00E1zka je co z toho, kdy\u017E je jin\u00FDch X zaj\u00EDmav\u011Bj\u0161\u00EDch v\u011Bc\u00ED na psan\u00ED aplikac\u00ED. J\u00E1 JS respektuju, ale prost\u011B jsou lep\u0161\u00ED v\u011Bci.","to_user":"musketyr","to_user_id":81680719,"to_user_id_str":"81680719"},{"created_at":"Fri, 30 Sep 2011 13:49:31 +0000","from_user":"bmuschko","from_user_id":175594688,"from_user_id_str":"175594688","geo":null,"id":119770852169494528,"id_str":"119770852169494528","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1194994698/twitter_profile_normal.jpg","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;","text":"@musketyr Oh yeah, bring on the plugin goodness!","to_user":"musketyr","to_user_id":81680719,"to_user_id_str":"81680719"},{"created_at":"Fri, 30 Sep 2011 13:31:21 +0000","from_user":"glaforge","from_user_id":251231,"from_user_id_str":"251231","geo":null,"id":119766280675934209,"id_str":"119766280675934209","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a1.twimg.com/profile_images/347708182/twitterProfilePhoto_normal.jpg","source":"&lt;a href=&quot;http://www.nambu.com/&quot; rel=&quot;nofollow&quot;&gt;Nambu&lt;/a&gt;","text":"@musketyr a good idea considering that the datastore ops end up being quite expensive","to_user":"musketyr","to_user_id":81680719,"to_user_id_str":"81680719"}],"results_per_page":15,"since_id":0,"since_id_str":"0"};	  
  dummyQueryDifData 	= {"completed_in":0.075,"max_id":121207315096539136,"max_id_str":"121207315096539136","page":1,"query":"%40musketyr","refresh_url":"?since_id=121207315096539136&q=%40musketyr","results":[{"created_at":"Tue, 04 Oct 2011 12:57:30 +0000","from_user":"pre_mysl","from_user_id":92741025,"from_user_id_str":"92741025","geo":null,"id":121207315096539136,"id_str":"121207315096539136","iso_language_code":"no","metadata":{"result_type":"recent"},"profile_image_url":"http://a1.twimg.com/profile_images/846350956/pb_normal.jpg","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;","text":"@musketyr json test :)","to_user":"musketyr","to_user_id":81680719,"to_user_id_str":"81680719"}],"results_per_page":15,"since_id":120231035274412032,"since_id_str":"120231035274412032"};
  dummyQueryEmptyData   = {"completed_in":0.07,"max_id":121217767285338112,"max_id_str":"121217767285338112","page":1,"query":"%40musketyr","refresh_url":"?since_id=121217767285338112&q=%40musketyr","results":[],"results_per_page":15,"since_id":121207315096539136,"since_id_str":"121207315096539136"};

  dummyPage1Data = {"completed_in":0.228,"max_id":121223280270114816,"max_id_str":"121223280270114816","next_page":"?page=2&max_id=121223280270114816&q=google","page":1,"query":"google","refresh_url":"?since_id=121223280270114816&q=google","results":[{"created_at":"Tue, 04 Oct 2011 14:00:56 +0000","from_user":"grantdain","from_user_id":5205420,"from_user_id_str":"5205420","geo":null,"id":121223280270114816,"id_str":"121223280270114816","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1326172812/pr_Dennis_Menace_normal.gif","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"@ollygosling @JorgenSundberg Already dropped MS Office.. working very well - 1 reservation: do I really want my whole life on Google?","to_user":"ollygosling","to_user_id":3853815,"to_user_id_str":"3853815"},{"created_at":"Tue, 04 Oct 2011 14:00:56 +0000","from_user":"SanjayGG2G","from_user_id":408604282,"from_user_id_str":"408604282","geo":null,"id":121223278160388096,"id_str":"121223278160388096","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1560621734/imagesCAIHSSBN_normal.jpg","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"RT @MyQuotesBook: A boy's eye is faster than Google when searching for a girl in a crowd.","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:55 +0000","from_user":"DreamerPhactory","from_user_id":291053150,"from_user_id_str":"291053150","geo":null,"id":121223275874484224,"id_str":"121223275874484224","iso_language_code":"in","metadata":{"result_type":"recent"},"profile_image_url":"http://a3.twimg.com/profile_images/1540922164/avatar_normal","source":"&lt;a href=&quot;http://www.echofon.com/&quot; rel=&quot;nofollow&quot;&gt;Echofon&lt;/a&gt;","text":"RT @fachriyafachri: dengan perbekalan bahasa inggris yang pas-pasan dan google translate. mencoba membuat hootsuite ke server indonesia berbahasa indonesia :D","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:55 +0000","from_user":"thebahraini","from_user_id":259620331,"from_user_id_str":"259620331","geo":null,"id":121223274502955008,"id_str":"121223274502955008","iso_language_code":"in","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1416878691/king_normal.jpg","source":"&lt;a href=&quot;http://ubersocial.com&quot; rel=&quot;nofollow&quot;&gt;\u00DCberSocial for BlackBerry&lt;/a&gt;","text":"RT @MohdZayani: RT @Paddideh: RT Lebanese Hezbollah deeply hated. Farsi: http://t.co/U6vP5j7W #Iran #Bahrain ... http://t.co/p51svExB","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:55 +0000","from_user":"ullohjobs","from_user_id":219179404,"from_user_id_str":"219179404","geo":null,"id":121223273714429952,"id_str":"121223273714429952","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1224572298/Copy_of_untitled_normal.JPG","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"#linkbuilding SEO for web development website - top 10 in google.co.uk by davesmall: I own website www.web-devel... http://t.co/Qs1m63aB","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:55 +0000","from_user":"jeremyfranklin","from_user_id":50501,"from_user_id_str":"50501","geo":null,"id":121223273701851137,"id_str":"121223273701851137","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1385996642/IMG1466small_normal.jpg","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;","text":"RT @RyanLizza: Christie 1 pm announcement to be sponsored by Google Android.","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:54 +0000","from_user":"jorgemaloo","from_user_id":80509109,"from_user_id_str":"80509109","geo":null,"id":121223272275775490,"id_str":"121223272275775490","iso_language_code":"es","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1561542296/327102851_normal.jpg","source":"&lt;a href=&quot;http://ubersocial.com&quot; rel=&quot;nofollow&quot;&gt;\u00DCberSocial for BlackBerry&lt;/a&gt;","text":"Google Maps me gasta la bateria de forma absurda al menos ya no me pierdo en ninguna parte :D http://t.co/mI05RTj4","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:54 +0000","from_user":"mensajesdeamor","from_user_id":415203831,"from_user_id_str":"415203831","geo":null,"id":121223270598062081,"id_str":"121223270598062081","iso_language_code":"es","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/315557090/corazon1pq3_normal.jpg","source":"&lt;a href=&quot;http://192.168.0.10/friends/&quot; rel=&quot;nofollow&quot;&gt;Amigos por siempre&lt;/a&gt;","text":"CARTAS DE AMISTAD: No puedo ocultar lo incomoda que me siento http://t.co/yM1IB7pc","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:54 +0000","from_user":"misterrjones","from_user_id":95363356,"from_user_id_str":"95363356","geo":null,"id":121223269260066817,"id_str":"121223269260066817","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a1.twimg.com/profile_images/682010912/rob_from_above_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Local SEO Services | Local Search Marketing | Internet Marketing ...: EPIC Evaluations LLC is an incorporated we... http://t.co/nwFqDHsm","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:54 +0000","from_user":"cnewburystudios","from_user_id":135746102,"from_user_id_str":"135746102","geo":null,"id":121223268974858241,"id_str":"121223268974858241","iso_language_code":"es","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1079811337/curt_profile_pic_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Author Interview: Vizion-Studios | Envato Notes http://t.co/iNv2QlmT studios","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:53 +0000","from_user":"advantone","from_user_id":399097250,"from_user_id_str":"399097250","geo":null,"id":121223267913707521,"id_str":"121223267913707521","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1571441024/logo_normal.png","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"RT @Social_Olga: 10 negative things that could hurt your SEO\nhttp://t.co/ZeessHdK\n@FabienLamaison  @bh2nn2hb","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:53 +0000","from_user":"Kidclueserious","from_user_id":28553001,"from_user_id_str":"28553001","geo":null,"id":121223266781233152,"id_str":"121223266781233152","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1532854605/profile_image_1315401990675_normal.jpg","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;","text":"@MissPrecious_C Get back to this Google chat ma'am..","to_user":"MissPrecious_C","to_user_id":139340120,"to_user_id_str":"139340120"},{"created_at":"Tue, 04 Oct 2011 14:00:53 +0000","from_user":"Esaga1984","from_user_id":205159900,"from_user_id_str":"205159900","geo":null,"id":121223266370191360,"id_str":"121223266370191360","iso_language_code":"es","metadata":{"result_type":"recent"},"profile_image_url":"http://a1.twimg.com/profile_images/1314874658/GAMERMANIA_normal.jpg","source":"&lt;a href=&quot;http://twitter.com/#!/download/iphone&quot; rel=&quot;nofollow&quot;&gt;Twitter for iPhone&lt;/a&gt;","text":"RT @WikiWakeham: Apoyen a est Psic\u00F3logo y Gamer con su tesis-Encuesta acerca de videojuegos! Dura solo 5 min! Retweet pls! http://t.co/4EZcq37s @MasConsolas","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:53 +0000","from_user":"recifeemfoco","from_user_id":26350011,"from_user_id_str":"26350011","geo":null,"id":121223265699110912,"id_str":"121223265699110912","iso_language_code":"pt","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/295822657/simbolo-alagoasemfoco_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"BNDES aprova garantias da PDVSA em refinaria da Petrobras: A participa\u00E7\u00E3o brasileira era uma das contrapartidas ... http://t.co/5pFRc63j","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:53 +0000","from_user":"recifeemfoco","from_user_id":26350011,"from_user_id_str":"26350011","geo":null,"id":121223264453410816,"id_str":"121223264453410816","iso_language_code":"pt","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/295822657/simbolo-alagoasemfoco_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Pol\u00EDcia prende um dos 20 criminosos mais procurados em Pernambuco: A Pol\u00EDcia Militar do Estado prendeu, por volt... http://t.co/9J131NvK","to_user_id":null,"to_user_id_str":null}],"results_per_page":15,"since_id":0,"since_id_str":"0"};
  dummyPage2Data = {"completed_in":0.159,"max_id":121223280270114816,"max_id_str":"121223280270114816","previous_page":"?page=1&max_id=121223280270114816&q=google","page":2,"query":"google","refresh_url":"?since_id=121223280270114816&q=google","results":[{"created_at":"Tue, 04 Oct 2011 14:00:52 +0000","from_user":"RajwinAravind","from_user_id":221320767,"from_user_id_str":"221320767","geo":null,"id":121223262670827520,"id_str":"121223262670827520","iso_language_code":"it","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1227880459/vlcsnap-61192_normal.png","source":"&lt;a href=&quot;http://www.google.com/&quot; rel=&quot;nofollow&quot;&gt;Google&lt;/a&gt;","text":"Microsoft Anti-Virus Erasing Google Chrome http://t.co/ubVNGBmk","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:52 +0000","from_user":"JamieDedes","from_user_id":80321810,"from_user_id_str":"80321810","geo":null,"id":121223261907468288,"id_str":"121223261907468288","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1233760568/iPhoto_Library_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"RT @JohnHamptonK: Lit Preview: National Poetry Day Events: Southbank Centre's resident poet Simon Armitage spends the afternoon in... http://t.co/8Iy4Ru7e","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:52 +0000","from_user":"yamazatotaiken","from_user_id":126562894,"from_user_id_str":"126562894","geo":null,"id":121223261290905600,"id_str":"121223261290905600","iso_language_code":"ja","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1514166110/inago_normal.gif","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"@ashi_tsubo \u5834\u6240\u306F\u3053\u3061\u3089\u306E\u5730\u56F3\u3092\u53C2\u7167\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n\u767D\u3044\u5EFA\u7269\u306E\u96A3\u306B\u30CF\u30A6\u30B9\u304C\u4E26\u3093\u3067\u3044\u307E\u3059\u3002http://t.co/DKUOB1Px\n\u3088\u3057\u3060\u8FB2\u5712\u3067\u3059\u3002","to_user":"ashi_tsubo","to_user_id":100986919,"to_user_id_str":"100986919"},{"created_at":"Tue, 04 Oct 2011 14:00:52 +0000","from_user":"Royal7Casinos","from_user_id":107007509,"from_user_id_str":"107007509","geo":null,"id":121223260615618561,"id_str":"121223260615618561","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/941888166/royal-7-square_normal.png","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Saint Index: Americans Say Best Local Development Project is 'None': Landfills, casinos and quarries are the mos... http://t.co/Wpi7IRim","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:52 +0000","from_user":"firmaaanir","from_user_id":181781867,"from_user_id_str":"181781867","geo":null,"id":121223259944534018,"id_str":"121223259944534018","iso_language_code":"in","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1538411695/DSC01855_normal.JPG","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"aku tanya om google, pasti tau! hahahhaRT @ridwanrawksome:Gimana yah? Kasih tau jangan yah? HahahaRT @firmaaanir hmm siapa yaa?","to_user":"ridwanrawksome","to_user_id":153720096,"to_user_id_str":"153720096"},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"WrittenREALITY","from_user_id":415745177,"from_user_id_str":"415745177","geo":null,"id":121223258812055552,"id_str":"121223258812055552","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a1.twimg.com/profile_images/1557970571/youLIKE_normal.jpg","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"that tweet you just tweeted..yeah that shit was from google . we are all hip .","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"BusinessCrayon","from_user_id":274338229,"from_user_id_str":"274338229","geo":null,"id":121223258078068736,"id_str":"121223258078068736","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1571334121/Twitter_Avatar_normal.png","source":"&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;","text":"Get a \u00A350 voucher for Google AdWords when you sign up for free. Our partners will even set up your campaign http://t.co/N15RKn9a","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"gabrielvegas","from_user_id":92697116,"from_user_id_str":"92697116","geo":null,"id":121223257696370689,"id_str":"121223257696370689","iso_language_code":"es","metadata":{"result_type":"recent"},"profile_image_url":"http://a0.twimg.com/profile_images/1429411304/gabo_normal.png","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"RT @tuexperto: Google Maps, ahora a vista de helic\u00F3ptero http://t.co/hAAGaTsp","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"ReframeLife","from_user_id":239168206,"from_user_id_str":"239168206","geo":null,"id":121223257448919040,"id_str":"121223257448919040","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a3.twimg.com/profile_images/1503203322/TJB_Photo3_normal.jpg","source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;","text":"Weight Management Hypnotherapy Mp3 audio for less than a pint of beer - why not? - http://ow.ly/6KlYd","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"SteveNanai","from_user_id":150302530,"from_user_id_str":"150302530","geo":null,"id":121223257356640256,"id_str":"121223257356640256","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1128392539/file_photo_3_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Captain D's Appoints Margo Mize as Senior Director of Local Store Marketing: In her new position with Captai... http://t.co/Ndj0yGQx #in","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"FunGh0ul","from_user_id":166982175,"from_user_id_str":"166982175","geo":null,"id":121223257306308608,"id_str":"121223257306308608","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1570899196/jhgfds_normal.jpeg","source":"&lt;a href=&quot;http://twitter.com/#!/download/ipad&quot; rel=&quot;nofollow&quot;&gt;Twitter for iPad&lt;/a&gt;","text":"omg niice &lt;3 xP thaxx lol \u201C@QueenSuperfreak: @FunGh0ul http://t.co/dAv0LNmS FELL BETTER ? ;)\u201D","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"vangdas","from_user_id":171363149,"from_user_id_str":"171363149","geo":null,"id":121223257205641216,"id_str":"121223257205641216","iso_language_code":"th","metadata":{"result_type":"recent"},"profile_image_url":"http://a3.twimg.com/profile_images/1562161992/kaystreet_normal.png","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;","text":"www.google.com \u0E2B\u0E32\u0E17\u0E35\u0E48\u0E42\u0E2B\u0E25\u0E14\u0E40\u0E2D\u0E47\u0E21\u0E44\u0E21\u0E48\u0E40\u0E08\u0E2D\u0E19\u0E30 \u0E44\u0E2B\u0E19\u0E1A\u0E2D\u0E01\u0E21\u0E35\u0E17\u0E38\u0E01\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E07 = =;;","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"quteconsulting","from_user_id":285136705,"from_user_id_str":"285136705","geo":null,"id":121223256421310464,"id_str":"121223256421310464","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1392215120/Cute_Consulting_QR_Code_normal.gif","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Virgin Mobile and Whooznxt Book Show Using SocMed: \u201CThese days, emerging bands live or die by their social follo... http://t.co/7Kvd26Ja","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"lindacooking8","from_user_id":401308827,"from_user_id_str":"401308827","geo":null,"id":121223256215793664,"id_str":"121223256215793664","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a3.twimg.com/sticky/default_profile_images/default_profile_4_normal.png","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"Blog: Apple iPhone launch big moment for Cook: But it is also the debut launch of Tim Cook as CEO at such an eve... http://t.co/Rvgx2t16","to_user_id":null,"to_user_id_str":null},{"created_at":"Tue, 04 Oct 2011 14:00:51 +0000","from_user":"SteveNanai","from_user_id":150302530,"from_user_id_str":"150302530","geo":null,"id":121223256182239232,"id_str":"121223256182239232","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http://a2.twimg.com/profile_images/1128392539/file_photo_3_normal.jpg","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;","text":"iContact Outlines Tactics for Email and Social Media Marketing Success at NYC ...: Together, email and socia... http://t.co/cO12WleG #in","to_user_id":null,"to_user_id_str":null}],"results_per_page":15,"since_id":0,"since_id_str":"0"};
  
  beforeEach(function(){
	  scope = angular.scope();
      $browser = scope.$service('$browser');
 
      $browser.xhr.expectJSON('phones/phones.json')
      .respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
      
      twitter = scope.$service('twitterWatcher');
  });


  it('should be defined', function() {
	  expect(twitter).toBeDefined();
	  expect(twitter.watch).toBeDefined();
  });
  
  it('should be defined', function() {
	  var w1, w2;
	  w1 = twitter.watch("a", {noCache: true});
	  w2 = twitter.watch("b", {noCache: true});
	  
	  expect(w1.getQuery()).toBe("a");
	  expect(w2.getQuery()).toBe("b");
  });
  
  it('should query properly', function() {
	  var results = [], watcher, tweets;
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?q=@musketyr&callback=JSON_CALLBACK').respond(dummyQueryData);
	  
	  tweets = 0;
	  watcher = twitter.watch('@musketyr', {noCache: true});
	  watcher.clearCache();
	  
	  watcher.onTweet(function(tweet){
		  tweets++;
	  });
	  
	  watcher.query(function(tweets){
		  results = tweets;
	  });
	  
	  expect(tweets).toBe(0);
	  expect(results.length).toBe(0);
	  
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(3);
	  expect(results).toBeDefined();
	  expect(results.length).toBe(3);
	  expect((results[0] || {id: -1}).id).toBe(120231035274412032);
	  
	  
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?since_id=120231035274412032&q=%40musketyr&callback=JSON_CALLBACK').respond(dummyQueryDifData);
	  
	  watcher.query(function(tweets){
		  results = tweets;
	  });
	  
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(4);
	  expect(results.length).toBe(4);
	  expect(results[0].id).toBe(121207315096539136);
	  
	  
	  
	  
	  
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?since_id=121207315096539136&q=%40musketyr&callback=JSON_CALLBACK').respond(dummyQueryEmptyData);
	  
	  watcher.query(function(tweets){
		  results = tweets;
	  });
	  
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(4);
	  expect(results.length).toBe(4);
	  expect(results[0].id).toBe(121207315096539136);
	  
	  
//	  // from/to watcher, cached
//	  var fromToWatcher, ftwTweets = 0, ftwResult = [];
//	  fromToWatcher = twitter.watch('@musketyr', {from: new Date(Date.parse('Fri, 30 Sep 2011 13:49:31 +0000')), to: new Date(Date.parse('Sat, 01 Oct 2011 20:18:07 +0000'))});
//	  fromToWatcher.onTweet(function(tweet){
//		  ftwTweets++;
//	  });
//	  
//	  fromToWatcher.query(function(tweets){
//		  ftwResult = tweets;
//	  });
//	  
//	  expect(ftwTweets).toBe(2);
//	  expect(ftwResult.length).toBe(2);
//	  expect(ftwResult[0].id).toBe(120231035274412032);
//	  
//	  // from watcher, cached
//	  var fromWatcher, fwTweets = 0, fwResult = [];
//	  fromWatcher = twitter.watch('@musketyr', {from: new Date(Date.parse('Fri, 30 Sep 2011 13:49:31 +0000'))});
//	  fromWatcher.onTweet(function(tweet){
//		  fwTweets++;
//	  });
//	  fromWatcher.query(function(tweets){
//		  fwResult = tweets;
//	  });
//	  
//	  expect(fwTweets).toBe(3);
//	  expect(fwResult.length).toBe(3);
//	  expect(fwResult[0].id).toBe(121207315096539136);
//	  
//	  // to watcher, cached
//	  var toWatcher, twTweets = 0, twResult = [];
//	  toWatcher = twitter.watch('@musketyr', {to: new Date(Date.parse('Sat, 01 Oct 2011 20:18:07 +0000'))});
//	  toWatcher.onTweet(function(tweet){
//		  twTweets++;
//	  });
//	  toWatcher.query(function(tweets){
//		  twResult = tweets;
//	  });
//	  
//	  expect(twTweets).toBe(3);
//	  expect(twResult.length).toBe(3);
//	  expect(twResult[0].id).toBe(120231035274412032);
	  
  });
  
  it('should query listener based only', function() {
	  var watcher, tweets;
	  
	  tweets = 0;
	  watcher = twitter.watch('@musketyr', {noCache: true});
	 
	  watcher.onTweet(function(tweet){
		  tweets++;
	  });
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?q=@musketyr&callback=JSON_CALLBACK').respond(dummyQueryData);
	  watcher.query();
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(3);
	  
	  
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?since_id=120231035274412032&q=%40musketyr&callback=JSON_CALLBACK').respond(dummyQueryDifData);
	  watcher.query();
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(4);
	  
	  
	  
	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?since_id=121207315096539136&q=%40musketyr&callback=JSON_CALLBACK').respond(dummyQueryEmptyData);
	  watcher.query();
	  $browser.xhr.flush();
	  
	  expect(tweets).toBe(4);
	  
  });
  
//  it('should page properly', function(){
//	  var results = [], watcher;
//	  
//	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?q=google&callback=JSON_CALLBACK').respond(dummyPage1Data);
//	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?page=2&max_id=121223280270114816&q=google&callback=JSON_CALLBACK').respond(dummyPage2Data);
//	  
//	  watcher = twitter.watch('google');
//	  
//	  watcher.query(function(tweets){
//		  results = tweets;
//	  });
//	  
//	  watcher.query(function(tweets){
//		  results = tweets;
//	  });
//	  
//	  expect(results.length).toBe(0);
//	  
//	  $browser.xhr.flush();
//	  
//	  expect(results.length).toBe(30);
//  });
//  
//  
//  it('should handle pending queries gracefully', function(){
//	  var results = [], otherResults = [], watcher;
//	  
//	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?q=google&callback=JSON_CALLBACK').respond(dummyPage1Data);
//	  $browser.xhr.expectJSON('http://search.twitter.com/search.json?page=2&max_id=121223280270114816&q=google&callback=JSON_CALLBACK').respond(dummyPage2Data);
//	  
//	  watcher = twitter.watch('google');
//	  
//	  expect(watcher.isPending()).toBeFalsy();
//	  
//	  watcher.query(function(tweets){
//		  results = tweets;
//	  });
//	  
//	  expect(watcher.isPending()).toBeTruthy();
//	  expect(results.length).toBe(0);
//	  expect(otherResults.length).toBe(0);
//	  
//	  watcher.query(function(tweets){
//		  otherResults = tweets;
//	  });
//	  
//	  expect(watcher.isPending()).toBeTruthy();
//	  expect(results.length).toBe(0);
//	  expect(otherResults.length).toBe(0);
//	  
//	  $browser.xhr.flush();
//	  
//	  expect(watcher.isPending()).toBeFalsy();
//	  expect(results.length).toBe(30);
//	  expect(otherResults.length).toBe(30);
//	  
//  });
  
});
