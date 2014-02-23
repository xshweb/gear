function MemberCtrl($scope, $http) {
  $http.get(document.URL).success(function (data) {
    $scope.department = data;
  });

  $scope.addTime = function (times) {
    times.push({week: '', lessons: ''});
  };

  $scope.removeTime = function (times, time) {
    times.splice(times.indexOf(time), 1);
  };

  $scope.addMember = function () {
    $scope.department.members.push({
      name: $scope.memberName,
      phone: $scope.memberPhone,
      times: [],
    });
    $scope.memberName = '';
    $scope.memberPhone = '';
  };

  $scope.putData = function () {
    $http.put(document.URL, $scope.department).success(function (data, status) {
      if (!data && status == 200) {
        alert('保存成功');
      } else {
        alert('保存失败');
      }
    });
  };

  $scope.removeDepartment = function () {
    $http.delete(document.URL).success(function (data, status) {
      location = '/department';
    });
  };

  $scope.removeMember = function (members, member) {
    members.splice(members.indexOf(member), 1);
  };
}

$('[data-tooltip]').tooltip();
