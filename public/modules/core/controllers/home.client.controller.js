'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        var path;
        var drawing = false;

        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.mouseDown = function(ev) {
            path = new paper.Path();
            path.strokeColor = 'black';
            path.add(new paper.Point(ev.offsetX, ev.offsetY));
            drawing = true;
        };

        $scope.mouseUp = function(ev) {
            path.simplify();
            console.log(path);
            drawing = false;
        };

        $scope.mouseMove = function(ev) {
            if (drawing === true) {
                path.add(new paper.Point(ev.offsetX, ev.offsetY));
                path.smooth();
            }
        };
        init();
        function init() {
            paper.install(window);

            paper.setup('draw-area');
        }
    }
]);