'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        var path;
        var drawing = false;

        function init() {
            paper.install(window);

            paper.setup('draw-area');
        }

        function getCoordinates(ev) {
            if (ev.gesture) {
                return [ev.gesture.center.clientX, ev.gesture.center.clientY];
            } else {
                return [ev.offsetX, ev.offsetY];
            }
        }

        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.drawStart = function(ev) {
            path = new paper.Path();
            path.strokeColor = 'black';

            path.add(new paper.Point(getCoordinates(ev)));
            drawing = true;
        };

        $scope.drawFinish = function() {
            path.simplify();
            drawing = false;
        };

        $scope.drawPath = function(ev) {
            if (drawing === true) {
                path.add(new paper.Point(getCoordinates(ev)));
                path.smooth();
            }
        };

        init();
    }
]);