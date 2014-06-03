'use strict';


angular.module('core')
        .controller('HomeController', ['$scope', 'Authentication',
            function($scope, Authentication) {
                var path;
                var drawing = false;

                function getCoordinates(ev) {
                    return [ev.gesture.center.clientX, ev.gesture.center.clientY - 50];
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

                $scope.drawPath = _.throttle(function(ev) {
                    if (drawing === true) {
                        path.add(new paper.Point(getCoordinates(ev)));
                    }
                }, 20);
            }])
        .directive('drawingInit', function() {
            var w = $("html").width();
            var h = $("html").height() - 50;

            $('#draw-area').height(h);
            $('#draw-area').width(w);

            paper.install(window);
            paper.setup('draw-area');

            return {template: ""};
        });