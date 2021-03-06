angular.module('cutlist')
.directive('rzEditableInput', ['$timeout', ($timeout) => {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=',
            callback: '=',
            askPreventEdit: '=',
            rowidx: '='
        },
        link: ($scope, el) => {
            $scope.click = () => {
                if (!$scope.askPreventEdit()) {
                    $scope.hasFocus = true;
                    $timeout(() => {
                        el.find('input')[0].focus(true);
                    }, 100);
                }
            };

            el.find('input').on('blur', () => {
                $scope.hasFocus = false;
            });

            el.on('keypress', function (ev) {
                if (ev.keyCode === 13) {
                    if (!$scope.askPreventEdit()) {
                        $scope.$apply(function () {
                            $scope.hasFocus = !$scope.hasFocus;
                        });
                    }
                }
            });

            $scope.change = () => {
                $scope.callback($scope.rowidx);
            };

            $scope.setFocus = () => {
//                $scope.click();
            };
        },
        templateUrl: '/views/partials/editable-input.html'
    };
}]);
