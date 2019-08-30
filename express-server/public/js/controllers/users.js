angular.module('userController', [])
	.controller('mainController', ['$scope', 'Users', function($scope, Users) {
		
		$scope.userBody = {};
		
		$scope.enroll = function() {
			var msg = JSON.stringify($scope.userBody);
			console.log("前端上传：\n" + msg);
			Users.create($scope.userBody).success(function(data) {				
					$scope.userBody = {};
			});
			alert("您已成功报名！");
			Users.get().success(function(data) {
				var msg = JSON.stringify(data);
				console.log("后端返回：\n" + msg);
			});
		};

	}]);
