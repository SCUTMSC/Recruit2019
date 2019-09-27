angular.module('userService', [])
	.factory('Users', ['$http', function($http) {
		return {
			get : function() {
				return $http.get('/api/users');
			},
			getById : function(userBody) {
				return $http.post('/api/query_user', userBody);
			},
			create : function(userBody) {
				return $http.post('/api/users', userBody);
			},
			putById: function(userBody) {
				return $http.post('/api/update_user', userBody);
			},
			put : function(_id, userBody) {
				return $http.put('/api/users/' + _id, userBody);
			},
			delete : function(_id) {
				return $http.delete('/api/users/' + _id);
			}
		}
	}]);
