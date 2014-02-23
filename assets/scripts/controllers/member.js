function MemberCtrl($scope, $http) {
  $http.get(document.URL).success(function (data) {
    $scope.department = data;
    $scope.arrangement = arrange($scope.department.members);
  });

  $('#arrangement').on('show.bs.modal', function () {
    $('.label', this).tooltip({
      placement: 'auto',
      html: true
    }).each(function (i) {
      $(this).css({backgroundColor: colors[i % colors.length]});
    });
  });

  var colors = [
    '#1abc9c',
    '#f1c40f',
    '#2ecc71',
    '#e67e22',
    '#3498db',
    '#e74c3c',
    '#9b59b6',
    '#16a085',
    '#f39c12',
    '#27ae60',
    '#d35400',
    '#2980b9',
    '#c0392b',
    '#8e44ad'];

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

function arrange(members) {
  var best  = {},
      count = 10000;

  members = members.map(function (member, index) {
    member.series = member.times.map(function (time) {
      return time.lessons.split(',').map(function (lesson) {
        return lesson + time.week;
      });
    }).reduce(function (array, current) {
      return _.union(array, current);
    }, []);
    return member;
  });

  recursion(0, {});

  for (var key in best) {
    best[key] = best[key].map(function (i) {
      return members[i];
    });
  }

  return best;

  function recursion(i, result) {
    if (i == members.length) {
      best = better(result);

      if (count-- > 0) {
        return true;
      } else {
        return false;
      }
    }

    if (members[i].series.length) {
      return members[i].series.every(function (serie) {
        var _result = $.extend(true, {}, result);
        _result[serie] = _result[serie] || [];
        _result[serie].push(i);
        return recursion(i + 1, _result);
      });
    } else {
      return recursion(i + 1, result);
    }
  }

  function better(result) {
    var result_length = _.keys(result).length,
        best_length   = _.keys(best).length;

    if (result_length > best_length) {
      return result;
    } else if (
      result_length == best_length &&
        getVariance(_.map(result, function (val) { return val.length })) >
        getVariance(_.map(best, function (val) { return val.length }))
    ) {
      return result;
    } else {
      return best;
    }
  }
}

// Programmer: Larry Battle 
// Date: Mar 06, 2011
// Purpose: Calculate standard deviation, variance, and average among an array of numbers.
var isArray = function (obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
},
getNumWithSetDec = function( num, numOfDec ){
	var pow10s = Math.pow( 10, numOfDec || 0 );
	return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
},
getAverageFromNumArr = function( numArr, numOfDec ){
	if( !isArray( numArr ) ){ return false;	}
	var i = numArr.length, 
		sum = 0;
	while( i-- ){
		sum += numArr[ i ];
	}
	return getNumWithSetDec( (sum / numArr.length ), numOfDec );
},
getVariance = function( numArr, numOfDec ){
	if( !isArray(numArr) ){ return false; }
	var avg = getAverageFromNumArr( numArr, numOfDec ), 
		i = numArr.length,
		v = 0;
 
	while( i-- ){
		v += Math.pow( (numArr[ i ] - avg), 2 );
	}
	v /= numArr.length;
	return getNumWithSetDec( v, numOfDec );
},
getStandardDeviation = function( numArr, numOfDec ){
	if( !isArray(numArr) ){ return false; }
	var stdDev = Math.sqrt( getVariance( numArr, numOfDec ) );
	return getNumWithSetDec( stdDev, numOfDec );
};
