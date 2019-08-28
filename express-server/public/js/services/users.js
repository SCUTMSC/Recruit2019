angular.module('userService', [])
	.factory('Users', ['$http', function($http) {
		return {
			get : function() {
				return $http.get('/api/users');
			},
			create : function(userBody) {
				return $http.post('/api/users', userBody);
			},
			put : function(_id, accountData) {
				return $http.put('/api/users/' + _id, userBody);
			},
			delete : function(_id) {
				return $http.delete('/api/users/' + _id);
			}
		}
	}]);
