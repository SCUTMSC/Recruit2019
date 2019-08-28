angular.module('userController', [])
	.controller('mainController', ['$scope', 'Users', function($scope, Users) {
		$scope.userBody = {
			id: 'test',
			name: 'test'
		},
		
		$scope.customerData = {}; // 绑定前端的客户数据
		$scope.accountData = {}; // 绑定前端的账户数据
		$scope.transactionData = {}; // 绑定前端的交易记录数据
		$scope.financeData = {
			type: "Yu'E Bao",
			rate: 0.233,
			interest: 0,
			amount: null,
		}; // 绑定前端的理财产品数据

		$scope.currCustomer = {}; // 绑定数据库的客户数据
		$scope.currAccount = {}; // 绑定数据库的账户数据
		$scope.currTransaction = {}; // 绑定数据库的交易记录数据
		$scope.currFinance = {}; // 绑定数据库的理财产品数据

		$scope.selectedAccount = {}; // 选中的账号

		$scope.operationAmount; // 操作的金额

		$scope.cardId = 100000; // 随机的卡号

		$scope.amount; //用于更新
		$scope.balance; // 用于更新balance
		$scope.income; // 用于更新income
		$scope.outcome; // 用于更新outcome
		
		var tempAccounts = new Array(); // 用于更新account[]
		$scope.newaccount; // 用于更新account[]

		$scope.loading = true; // 控制账户加载显示
		$scope.isLogin = false; // 控制页面跳转显示

		// 客户注册
		$scope.signUp = function() {
			
			// 重置余额、收入、支出
			$scope.balance = 0;
			$scope.income = 0;
			$scope.outcome = 0;

			if ($scope.customerData.username != undefined && $scope.customerData.password != undefined) {
				console.log('客户昵称：' + $scope.customerData.username);
				console.log('客户密码：' + $scope.customerData.password);

				// 更新上次注册时间
				var dateTime = new Date();
				$scope.customerData.lastSuccessfulLogin = dateTime.toLocaleString();

				console.log('当前customerData对象：');
				var msg = JSON.stringify($scope.customerData);
				console.log(msg);

				// 错误处理：重复用户名
				Customers.get().success(function(data) {
					console.log("获取到data");
					for(var usernamex in data){
						if(data[usernamex]["username"]==$scope.customerData.username){
							console.log("重复用户名");
							alert("customer has already existed");
							$scope.customerData = {};
						}
					}

				// 正常流程：创建新客户
				Customers.create($scope.customerData).success(function(data) {
						console.log('当前customers对象：');
						var msg = JSON.stringify(data);
						console.log(msg);

						console.log("创建新客户");
					
						$scope.customers = data;
						$scope.currCustomer = $scope.customerData;
						$scope.customerData = {};
					});
				})
			}

		};

		// 客户登录
		$scope.signIn = function() {
			
			// 重置账户、交易记录、余额、收入、支出
			$scope.accounts = {};
			$scope.transactions={};
			$scope.balance = 0;
			$scope.income = 0;
			$scope.outcome = 0;

			// 更新上次登录时间
			var dateTime = new Date();
			$scope.customerData.lastSuccessfulLogin = dateTime.toLocaleString();

			// 错误处理布尔变量
			var userexist=false;
			var pwdcorrect=true;

			Customers.get().success(function(data){
				console.log("获取到data");
				for(var usernamex in data){
					if(data[usernamex]["username"]==$scope.customerData.username){
						console.log("找到名字");
						userexist=true;
						// 错误处理：密码不正确
						if(data[usernamex]["password"]!=$scope.customerData.password){
							alert("please input correct password!");
							pwdcorrect=false;
							$scope.customerData={};
						}
					}
				}
				// 错误处理：客户不存在
				if(userexist==false){
					alert("customer does not exist!");
					$scope.customerData={};
				}
				if(userexist==true&&pwdcorrect==true){
					$scope.isLogin = true; // 页面跳转

					$scope.currCustomer=$scope.customerData;
					$scope.customerData={};
				}
			})
			
			// 已有账户显示
			Accounts.get()
			.success(function(data) {
				console.log("accounts get");
				var i=0;
				for(var accountx in data){
					console.log("data中的数据"+data[accountx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					// 筛选存在账户
					if(data[accountx]["customerName"]==$scope.currCustomer.username)
					{
						$scope.balance = $scope.balance + data[accountx]["balance"];
						$scope.income = $scope.income + data[accountx]["income"];
						$scope.outcome = $scope.outcome + data[accountx]["outcome"];
						console.log("找到账户");
						$scope.accounts[i++]=data[accountx];
						console.log("账户信息");
						var msg = JSON.stringify($scope.accounts);
						console.log(msg);
					}
				}
				$scope.loading = false;
			});

			// 已有交易显示
			Transactions.get()
			.success(function(data){
				console.log("transactions get");
				var i=0;
				for(var transactionx in data){
					console.log("data中的数据"+data[transactionx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					// 筛选交易记录
					if(data[transactionx]["from"]==$scope.currCustomer.username||data[transactionx]["to"]==$scope.currCustomer.username)
					{
						console.log("找到账户");
						$scope.transactions[i++]=data[transactionx];
						console.log("交易记录");
						var msg = JSON.stringify($scope.transactions);
						console.log(msg);
					}
				}
			})

		};

		// 客户登出
		$scope.signOut = function() {
			// 重置登录、客户、账户、交易记录
			$scope.isLogin = false;
			$scope.customerData = {};
			$scope.accountData = {};
			$scope.transactionData = {};
		};

		// 取消转账
		$scope.cancelTransfer = function() {
		    $scope.transactionData.amount = "";
		    $scope.transactionData.to = "";
		};
		
		// 确认转账
		$scope.confirmTransfer = function() {

		    Accounts.get().success(function (data) {
		        console.log("成功获取信息");
		        var msg = JSON.stringify(data);
		        console.log(msg);
		        var flag = 0;

		        for (var accountx in data) {
		            if (data[accountx]["accountId"] == $scope.currAccount.accountId) {
		                console.log("找到对应的账户");
		                console.log($scope.currAccount.accountId);
		                if (data[accountx]["balance"] < parseFloat($scope.transactionData.amount)) {
		                    alert("账户余额不足")
		                    $scope.transactionData.amount = "";
		                }
		                else {
		                    flag = 1;
		                    Accounts.put(data[accountx]["_id"], { balance: data[accountx]["balance"] - parseFloat($scope.transactionData.amount), income: data[accountx]["income"], outcome: data[accountx]["outcome"] + parseFloat($scope.transactionData.amount) })
                            .success(function (data) {
                                var msg = JSON.stringify(data);
                                console.log(msg);
                                $scope.balance = $scope.balance - parseFloat($scope.transactionData.amount);
                                $scope.outcome = $scope.outcome + parseFloat($scope.transactionData.amount);

                                $scope.operationAmount = "";
                                console.log("accounts get");
																/*var i=0;
																for(var accountx in data){
																	console.log("data中的数据"+data[accountx]["customerName"]);
																	console.log("currCustomer:"+$scope.currCustomer.username);
																	// 筛选存在账户
																	if(data[accountx]["customerName"]==$scope.currCustomer.username)
																	{
																		$scope.balance = $scope.balance + data[accountx]["balance"];
																		$scope.income = $scope.income + data[accountx]["income"];
																		$scope.outcome = $scope.outcome + data[accountx]["outcome"];
																		console.log("找到账户");
																		$scope.accounts[i++]=data[accountx];
																		console.log("账户信息");
																		var msg = JSON.stringify($scope.accounts);
																		console.log(msg);
																	}
																}*/
                            })
		                }
		                break;
		            }

		        }
		        // 更新对方的余额和收入
		        // ......
		        if (flag == 1) {
		            for (var accountx in data) {
		                //console.log($scope.transactionData.to);
		                console.log("true" + data[accountx]["accountId"]);
		                var msg = JSON.stringify(data);
										console.log(msg);
										console.log("!!!!!!!" + data[accountx]["accountId"]);
										console.log("!!!!!!!" + $scope.transactionData.to);
		                if (data[accountx]["accountId"] != $scope.transactionData.to) {
											continue;
		                }
		                else {
											console.log("找到对方的账户");
											flag = 2;
											//console.log($scope.currAccount.accountId);
											Accounts.put(data[accountx]["_id"], { balance: data[accountx]["balance"] + parseFloat($scope.transactionData.amount), income: data[accountx]["income"] + parseFloat($scope.transactionData.amount), outcome: data[accountx]["outcome"] })
											.success(function (data) {
													var msg = JSON.stringify(data);
													console.log(msg);
											})
											break;
										}
										console.log("找不到对方的账户");

		                alert("没有该账户！");
		            }
		        }
                //更新表单
		        console.log("flag" + flag);
		        if (flag == 2) {
		            var dateTime = new Date();
		            $scope.transactionData.time = dateTime.toLocaleString();
		            $scope.transactionData.account = $scope.currAccount.accountId;
		            $scope.transactionData.operation = 'Transfer'; 
		            $scope.transactionData.from = $scope.currAccount.accountId;

		            for (var accountx in data) {
		                if (data[accountx]["accountId"] == $scope.currAccount.accountId) {
		                    $scope.transactionData.from = data[accountx]["customerName"];
		                }
		            }
		            for (var accountx in data) {
		                if (data[accountx]["accountId"] == $scope.transactionData.to) {
		                    $scope.transactionData.to = data[accountx]["customerName"];
		                }
		            }
		         
		            Transactions.create($scope.transactionData).success(function (data) {
									var msg = JSON.stringify(data);
									console.log(msg);


		                $scope.currTransaction = $scope.transactionData;
		                $scope.transactionData = {};
		                var i = 0;
		                for (var transactionx in data) {
		                    console.log("data中的数据" + data[transactionx]["customerName"]);
		                    console.log("currCustomer:" + $scope.currCustomer.username);
		                    //筛选交易记录
		                    if (data[transactionx]["from"] == $scope.currCustomer.username || data[transactionx]["to"] == $scope.currCustomer.username) {

		                        console.log("找到账户");
		                        $scope.transactions[i++] = data[transactionx];
		                        var msg = JSON.stringify($scope.transactions);
		                        console.log(msg);
		                    }
		                }
		            })

		        }
		    }
		    )
		};


		// 选中账户
		$scope.selectAccount = function(id) {
			Accounts.get().success(function(data){
				for(var idx in data){
					if(data[idx]["_id"]==id){
						console.log("获取到当前账户信息！");
						console.log("matching id:"+data[idx]["_id"]);
						$scope.currAccount=data[idx];
						var msg = JSON.stringify($scope.currAccount);
						console.log(msg);
					}
				}
			})
		};

		// 随机开户
		$scope.createRandomAccount = function() {

			console.log("it is a new account");
			$scope.accountData.customerName = $scope.currCustomer.username;
			$scope.accountData.accountId = ($scope.cardId++).toString();
			console.log("客户名：" + $scope.accountData.customerName);
			console.log("账户名：" + $scope.accountData.accountId);

			// 更新Customers的accounts数组
			Customers.get().success(function(data){
				for(var customerx in data){
					console.log("新建account的账户名为："+data[customerx]["username"]);
					if(data[customerx]["username"]==$scope.currCustomer.username){
						console.log("创建新卡时找到对应账户");
						var length=data[customerx]["accounts"].length;
						console.log("customer的账户有："+length+"个");
						for(var i=0; i<length; ++i){
							tempAccounts[i]=data[customerx]["accounts"][i];
							console.log("customer可以有账户："+tempAccounts[i]);
						}
						tempAccounts[length]=$scope.accountData.accountId;
						Customers.put(data[customerx]["_id"],{newaccount:tempAccounts}).success(function(data){
							var msg=JSON.stringify(data);
							console.log(msg);
						})
					}
				}
			});

			Accounts.create($scope.accountData).success(function(data) {				
				var msg = JSON.stringify(data);
				console.log(msg);

				//筛选当前客户的账户
				var i=0;
				for(var accountx in data){
					console.log("data中的数据"+data[accountx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					if(data[accountx]["customerName"]==$scope.currCustomer.username)
					{

						console.log("找到账户");
						$scope.accounts[i++]=data[accountx];
						var msg = JSON.stringify($scope.accounts);
						console.log(msg);
					}
				}

				$scope.loading = false;
				$scope.currAccount = $scope.accountData;
				$scope.accountData = {};
				// $scope.accounts = data;
			});

			// 更新当前交易记录的数据库数据
			var dateTime = new Date();
			$scope.transactionData.account = $scope.currAccount.accountId;
			$scope.transactionData.operation = 'Create';
			$scope.transactionData.from = $scope.currCustomer.username;
			$scope.transactionData.to = $scope.currCustomer.username;
			$scope.transactionData.time = dateTime.toLocaleString();

			var msg = JSON.stringify($scope.transactionData);
			console.log(msg);

			Transactions.create($scope.transactionData).success(function(data) {
				var msg = JSON.stringify(data);
				console.log(msg);

				$scope.currTransaction = $scope.transactionData;
				$scope.transactionData = {};
				var i=0;
				for(var transactionx in data){
					console.log("data中的数据"+data[transactionx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					
					//筛选交易记录
					if(data[transactionx]["from"]==$scope.currCustomer.username||data[transactionx]["to"]==$scope.currCustomer.username)
					{

						console.log("找到账户");
						$scope.transactions[i++]=data[transactionx];
						var msg = JSON.stringify($scope.transactions);
						console.log(msg);
					}
				}
			});

			// 更新当前客户的数据库账户数据
		};

		// 存款
		$scope.deposit = function() {
			// 注意更新交易记录
			// ......
			Accounts.get().success(function(data){
				console.log("成功获取信息");
				var msg=JSON.stringify(data);
				console.log(msg);
				for(var accountx in data){
					if(data[accountx]["accountId"]==$scope.currAccount.accountId){
						console.log("找到对应的账户");
						console.log($scope.currAccount.accountId);
						Accounts.put(data[accountx]["_id"], { balance: data[accountx]["balance"] + parseFloat($scope.operationAmount), income: data[accountx]["income"] + parseFloat($scope.operationAmount), outcome: data[accountx]["outcome"] })
                           .success(function (data) {
                               var msg = JSON.stringify(data);
                               console.log(msg);
                               $scope.balance = $scope.balance + parseFloat($scope.operationAmount);
							   $scope.income = $scope.income + parseFloat($scope.operationAmount);
							   
							   var i=0;
								for(var accountx in data){
									console.log("data中的数据"+data[accountx]["customerName"]);
									console.log("currCustomer:"+$scope.currCustomer.username);
									if(data[accountx]["customerName"]==$scope.currCustomer.username)
									{

										console.log("找到账户");
										$scope.accounts[i++]=data[accountx];
										var msg = JSON.stringify($scope.accounts);
										console.log(msg);
									}
								}

                               $scope.operationAmount = "";
                            //    $scope.accounts = data;
                           })
					}
				}
			})

			var dateTime = new Date();
			$scope.transactionData.account = $scope.currAccount.accountId;
			$scope.transactionData.operation = 'Deposit';
			$scope.transactionData.from = $scope.currCustomer.username;
			$scope.transactionData.to = $scope.currCustomer.username;
			$scope.transactionData.time = dateTime.toLocaleString();
			$scope.transactionData.amount=$scope.operationAmount;

			var msg = JSON.stringify($scope.transactionData);
			console.log(msg);

			Transactions.create($scope.transactionData).success(function(data) {
				var msg = JSON.stringify(data);
				console.log(msg);

				$scope.currTransaction = $scope.transactionData;
				$scope.transactionData = {};
				var i=0;
				for(var transactionx in data){
					console.log("data中的数据"+data[transactionx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					//筛选交易记录
					if(data[transactionx]["from"]==$scope.currCustomer.username||data[transactionx]["to"]==$scope.currCustomer.username)
					{

						console.log("找到账户");
						$scope.transactions[i++]=data[transactionx];
						var msg = JSON.stringify($scope.transactions);
						console.log(msg);
					}
				}
			});

			// 更新当前交易记录的数据库数据
			// ......
		};

		// 取款
		$scope.withdraw = function() {
			// 注意更新交易记录
			// 注意不够钱取款的错误处理
			// ......
			Accounts.get().success(function(data){
				console.log("成功获取信息");
				var msg=JSON.stringify(data);
				console.log(msg);
				for(var accountx in data){
					if(data[accountx]["accountId"]==$scope.currAccount.accountId){
						console.log("找到对应的账户");
						console.log($scope.currAccount.accountId);
						if(data[accountx]["balance"]<parseFloat($scope.operationAmount)){
							alert("账户余额不足");
							$scope.operationAmount="";
						}
						else{
						    Accounts.put(data[accountx]["_id"], { balance: data[accountx]["balance"] - parseFloat($scope.operationAmount), income: data[accountx]["income"], outcome: data[accountx]["outcome"] + parseFloat($scope.operationAmount) }).success(function (data) {
						        var msg = JSON.stringify(data);
						        console.log(msg);
						        $scope.balance = $scope.balance - parseFloat($scope.operationAmount);
								$scope.outcome = $scope.outcome + parseFloat($scope.operationAmount);
								
								var i=0;
								for(var accountx in data){
									console.log("data中的数据"+data[accountx]["customerName"]);
									console.log("currCustomer:"+$scope.currCustomer.username);
									if(data[accountx]["customerName"]==$scope.currCustomer.username)
									{

										console.log("找到账户");
										$scope.accounts[i++]=data[accountx];
										var msg = JSON.stringify($scope.accounts);
										console.log(msg);
									}
								}
						        $scope.operationAmount = "";
						        // $scope.accounts = data;
						    })
						}
					}
				}
			})

			var dateTime = new Date();
			$scope.transactionData.account = $scope.currAccount.accountId;
			$scope.transactionData.operation = 'Withdraw';
			$scope.transactionData.from = $scope.currCustomer.username;
			$scope.transactionData.to = $scope.currCustomer.username;
			$scope.transactionData.time = dateTime.toLocaleString();
			$scope.transactionData.amount=$scope.operationAmount;

			var msg = JSON.stringify($scope.transactionData);
			console.log(msg);

			Transactions.create($scope.transactionData).success(function(data) {
				var msg = JSON.stringify(data);
				console.log(msg);

				$scope.currTransaction = $scope.transactionData;
				$scope.transactionData = {};
				var i=0;
				for(var transactionx in data){
					console.log("data中的数据"+data[transactionx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					//筛选交易记录
					if(data[transactionx]["from"]==$scope.currCustomer.username||data[transactionx]["to"]==$scope.currCustomer.username)
					{

						console.log("找到账户");
						$scope.transactions[i++]=data[transactionx];
						var msg = JSON.stringify($scope.transactions);
						console.log(msg);
					}
				}
			});

			// 更新当前交易记录的数据库数据
			// ......
		};

		// 购买理财产品的预计收益
		// 公式 = 持有月数 / 12 * 年利率
		$scope.purchaseFinanceProduct = function(month) {
			$scope.financeData.interest+=month/12*$scope.financeData.rate*$scope.financeData.amount;

			Accounts.get().success(function(data){
				console.log("成功获取信息");
				var msg=JSON.stringify(data);
				console.log(msg);
				for(var accountx in data){
					if(data[accountx]["accountId"]==$scope.currAccount.accountId){
						console.log("找到对应的账户");
						console.log($scope.currAccount.accountId);
						Accounts.put(data[accountx]["_id"],{balance:data[accountx]["balance"]-parseFloat($scope.financeData.amount), income: data[accountx]["income"], outcome: data[accountx]["outcome"] + parseFloat($scope.financeData.amount)}).success(function(data){
							var msg=JSON.stringify(data);
							console.log(msg);

							$scope.balance = $scope.balance - parseFloat($scope.financeData.amount);
              $scope.outcome = $scope.outcome + parseFloat($scope.financeData.amount);

							var i=0;
								for(var accountx in data){
									console.log("data中的数据"+data[accountx]["customerName"]);
									console.log("currCustomer:"+$scope.currCustomer.username);
									if(data[accountx]["customerName"]==$scope.currCustomer.username)
									{

										console.log("找到账户");
										$scope.accounts[i++]=data[accountx];
										var msg = JSON.stringify($scope.accounts);
										console.log(msg);
									}
								}
							$scope.financeData.amount="";
							// $scope.accounts=data;
						})
					}
				}
			})

			var dateTime = new Date();
			$scope.transactionData.account = $scope.currAccount.accountId;
			$scope.transactionData.operation = 'Invest';
			$scope.transactionData.from = $scope.currCustomer.username;
			$scope.transactionData.to = $scope.currCustomer.username;
			$scope.transactionData.time = dateTime.toLocaleString();
			$scope.transactionData.amount=parseFloat($scope.financeData.amount);
			console.log("投资金额："+$scope.financeData.amount);
			

			var msg = JSON.stringify($scope.transactionData);
			console.log(msg);

			Transactions.create($scope.transactionData).success(function(data) {
				var msg = JSON.stringify(data);
				console.log(msg);

				$scope.currTransaction = $scope.transactionData;
				$scope.transactionData = {};
				var i=0;
				for(var transactionx in data){
					console.log("data中的数据"+data[transactionx]["customerName"]);
					console.log("currCustomer:"+$scope.currCustomer.username);
					//筛选交易记录
					if(data[transactionx]["from"]==$scope.currCustomer.username||data[transactionx]["to"]==$scope.currCustomer.username)
					{

						
						console.log("找到账户");
						$scope.transactions[i++]=data[transactionx];
						var msg = JSON.stringify($scope.transactions);
						console.log(msg);
					}
				}
			});
		}

	}]);
