'use strict';


angular.module('core')
    .controller('HomeController', ['$scope', 'Authentication',
        function($scope, Authentication) {
            var RainDrop = Backbone.Model.extend({
                url: "/raindrop"
            });
            var RainCollection = Backbone.Collection.extend({
                model: RainDrop,
                url: "/raindrop/list"
            });

            var path;
            var drawing = false;
            var rainCollection = new RainCollection();

            /* Show existing paths */
            rainCollection.once("sync", function () {
                showRainCollection(this);
            });
            rainCollection.fetch();

            $scope.color = '#000000';
            $scope.size = 2;

            function getCoordinates(ev) {
                return [ev.gesture.center.clientX, ev.gesture.center.clientY - 50];
            }

            function savePath() {
                var rainDrop = new RainDrop({
                    color: $scope.color,
                    size: $scope.size
                });

                var pointList = [];
                _.each(path.segments, function (segment) {
                    var point = segment.point;
                    pointList.push({
                        x: point.x,
                        y: point.y
                    });
                });

                rainDrop.set("points", pointList);
                rainDrop.save();
            }

            function showRainCollection(rainCollection) {
                rainCollection.each(function (rainDrop) {
                    var path = new paper.Path({
                        strokeColor: rainDrop.get("color"),
                        strokeWidth: rainDrop.get("size"),
                        strokeCap: "round"
                    });

                    _.each(rainDrop.get("points"), function (point) {
                        path.add(new paper.Point(point.x, point.y));
                    });

                    path.smooth();
                    paper.view.update();
                });
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
                savePath();
            };

            $scope.drawPath = _.throttle(function(ev) {
                if (drawing === true) {
                    path.add(new paper.Point(getCoordinates(ev)));
                }
            }, 20);
        }
    ])
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
