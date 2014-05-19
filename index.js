var app = angular.module('app',['ngRoute','infinite-scroll']);

app.config(['$routeProvider',Router]);
app.controller('PostsController',PostsController);
app.factory('BlogFactory',BlogFactory);

var Posts = {
	templateUrl: 'views/posts.html'
};

var Otherwise = {
	redirectTo: '/'
};

function Router ($routeProvider) {
	$routeProvider.when('/',Posts);
	$routeProvider.otherwise(Otherwise);
}

function PostsController ($scope,BlogFactory) {
	$scope.blog = new BlogFactory();
}

function BlogFactory ($http) {
	var f = function () {
		this.posts = [];
		this.busy = false;
		this.after = 'ok';
	}
	f.prototype.nextPost = function () {
		if (this.busy) {
			return;
		} else {
			this.busy = true;
			var url = 'http://api.braunswebblog.com/posts?after='+this.after;
			$http
				.get({method:'GET',url:url})
				.success(function(data){
					var posts = data.posts;
					for (var p in posts) {
						this.posts.push(posts[p]);
					}
					this.after = this.items[this.items.length-1].id;
					this.busy = false;
				}.bind(this))
				.error(function(e){
					console.log(e);
				});
		}
	}
	return f;
}
