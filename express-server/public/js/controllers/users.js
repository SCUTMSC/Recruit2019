angular.module('userController', [])
	.controller('mainController', ['$scope', 'Users', function($scope, Users) {
		alert("经部分同学反馈，使用微信内置浏览器无法成功报名。请同学们点击右上角选择使用浏览器打开本报名链接，以免由于兼容问题造成数据丢失。给大家带来不便，十分抱歉！");
		
		$scope.userBody = {};
		
		$scope.enroll = function() {
			// var msg = JSON.stringify($scope.userBody);
			// console.log("前端上传：\n" + msg);

			Users.getById($scope.userBody).success(function(data) {				
				if(data.status) {		
					if(data.result.length === 0) {
						// console.log("首次填写");
						Users.create($scope.userBody).success(function(data) { $scope.userBody = {}; });
					}
					else { 
						// console.log("重复填写");
						Users.putById($scope.userBody).success(function(data) { $scope.userBody = {}; })
					}
					alert(data.msg);
				}
				else {
					alert(data.msg);
					$scope.userBody = {};
				}
			});
			
			// Users.get().success(function(data) {
			// 	var msg = JSON.stringify(data);
			// 	console.log("后端返回：\n" + msg);
			// });
		};

	}]);
