'use strict';


angular.module('core')
        .controller('HomeController', ['$scope', 'Authentication',
            function($scope, Authentication) {
                var path;
                var drawing = false;

                $scope.color = "#000000";
                $scope.size = 2;

                function getCoordinates(ev) {
                    return [ev.gesture.center.clientX, ev.gesture.center.clientY - 50];
                }

                // This provides Authentication context.
                $scope.authentication = Authentication;

                $scope.drawStart = function(ev) {
                    path = new paper.Path({
                        strokeColor: this.color,
                        strokeWidth: this.size,
                        strokeCap: "round"
                    });

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
            return {
                restrict: "A",
                compile: function(element) {
                    var w = $("html").width();
                    var h = $("html").height() - 50;

                    $(element).height(h);
                    $(element).width(w);

                    paper.install(window);
                    paper.setup(element.attr('id'));
                }
            };
        })
        .directive('colorPicker', function($parse) {
            return {
                restrict: "A",
                compile: function(element, attrs) {
                    return function(scope, element) {
                        // Generate random color :)
                        var color = "";
                        for (var i = 0; i < 6; i++) {
                            color += Math.floor(Math.random() * 16).toString(16);
                        }
                        $(element).minicolors({
                            defaultValue: color,
                            change: function(color) {
                                scope.color = color;
                            }
                        });
                        scope.color = color;
                    };
                }
            };
        })
        .directive('sizeSlider', function($parse) {
            return {
                restrict: "A",
                compile: function(element, attrs) {
                    return function(scope, element) {
                        $(element).noUiSlider({
                            range: {
                                min: 1,
                                max: 50
                            },
                            start: 2, 
                            orientation: "vertical"
                        });
                        $(element).on('set', function(el, size) {
                            scope.size = size;
                        });
                        scope.size = 2;
                    };
                }
            };
        });