'use strict';


angular.module('core')
    .controller('HomeController', ['$scope',
        function($scope) {
            /*
             * Models
             */
            var RainDrop = Backbone.Model.extend({
                url: "/raindrop"
            });
            var RainCollection = Backbone.Collection.extend({
                model: RainDrop,
                url: "/raindrop/list"
            });

            /*
             * Setting variables
             */
            var zoomFactor = 0.3;
            var headerHeight = 50;
            var drawRate = 20;
            $scope.cursorRate = 1;

            $scope.color = '#000000';
            $scope.size = 20;

            /*
             * Runtime variables
             */
            var path;
            var drawing = false;
            var rainCollection = new RainCollection();
            $scope.position = {
                x: 0,
                y: 0
            }

            /* Show existing paths */
            rainCollection.once("sync", function () {
                showRainCollection(this);
            });
            rainCollection.fetch();


            function getCoordinates(ev) {
                var x = ev.x ? ev.x : ev.gesture.center.clientX;
                var y = ev.y ? ev.y : ev.gesture.center.clientY;
                return [
                    (x + $scope.position.x) * 1 / paper.view.zoom,
                    (y - headerHeight + $scope.position.y) * 1 / paper.view.zoom
                    ];
            }

            var drawPath = _.throttle(function (ev) {
                if (drawing === true) {
                    path.add(new paper.Point(getCoordinates(ev)));
                }
            }, drawRate);

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
                console.log(rainDrop);
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

            function panView(x, y) {
                var target = new paper.Point(x, y);
                var direction = (y < 0) ? 1 : -1;

                var angle = Math.acos(-x / Math.sqrt(x*x + y*y)) * 180 * direction / Math.PI;
                var distance = Math.sqrt(x*x + y*y);

                paper.view.scrollBy(new paper.Point({
                    angle: angle,
                    length: distance
                }));

                $scope.position.x -= x;
                $scope.position.y -= y;
            }

            $scope.dragStart = function(ev) {
                if (!ev.which) {
                    console.log("drag start");
                    path = new paper.Path({
                        strokeColor: this.color,
                        strokeWidth: this.size,
                        strokeCap: "round",
                        strokeJoin: "round"
                    });

                    path.add(new paper.Point(getCoordinates(ev)));
                    paper.view.update();
                    drawing = true;
                }
            };

            $scope.dragFinish = function(ev) {
                if (ev.which === 1) {
                    console.log("drag finish");
                    path.add(new paper.Point(getCoordinates(ev)));
                    path.simplify(1);
                    path.smooth();
                    drawing = false;
                    savePath();
                }
            };

            $scope.dragPath = function(ev) {
                drawPath(ev);
            };

            $scope.mouseMove = function(ev) {
                var x = ev.movementX | ev.webkitMovementX | ev.mozMovementX;
                var y = ev.movementY | ev.webkitMovementY | ev.mozMovementY;

                if (ev.which === 2) {
                    panView(x, y);
                }
            }

            $scope.mouseClick = function(ev) {
                if (ev.which === 1) {
                    $scope.dragStart(ev);

                    var coord = getCoordinates(ev);
                    coord[0] += 1;
                    coord[1] += 1;
                    path.add(new paper.Point(coord));
                    drawing = false;
                    savePath();
                }
            }

            $scope.mouseScroll = function(ev, delta) {
                console.log(ev);
                console.log(paper.view.zoom);
                var zoomChange = 1 + (ev.wheelDeltaY / 1000) * zoomFactor;

                paper.view.zoom *= zoomChange;

                var fixFactor = 0.2;
                var dX = ($(document).width() / 2 - ev.clientX)
                    * (1 / paper.view.zoom) * zoomFactor * fixFactor;
                var dY = ($(document).height() / 2 - ev.clientY)
                    * (1 / paper.view.zoom) * zoomFactor * fixFactor;

                if (ev.wheelDeltaY < 0) {
                    dX *= -1;
                    dY *= -1;
                }
                console.log(dX, dY, paper.view.zoom);
                panView(dX, dY);
            };
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
            link: function(scope, element) {
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

                $(element).find('.minicolors-swatch').on('mouseover', function () {
                    $(element).css({
                        width: '201px !important',
                        height: '178px !important'
                    });
                });
                scope.color = color;
            }
        };
    })
    .directive('sizeSlider', function($parse) {
        return {
            restrict: "A",
            link: function(scope, element) {
                $(element).noUiSlider({
                    range: {
                        min: 1,
                        max: 50
                    },
                    start: scope.size,
                    orientation: "vertical"
                });
                $(element).on('set', function(el, size) {
                    scope.size = size;

                });
            }
        };
    })
    .directive('paintCursor', function() {
        return {
            restrict: "A",
            link: function(scope, element) {
                var cursor = new paper.Shape.Circle({
                    position: new paper.Point(30, 30),
                    size: scope.size/2,
                    strokeColor: new paper.Color(0, 0),
                    fillColor: scope.color
                });

                var moveCursor = _.throttle(function (ev) {
                    var x = ev.x + scope.position.x;
                    var y = ev.y - 50 + scope.position.y;
                    cursor.set({
                        position: new Point(x, y),
                        fillColor: scope.color,
                        size: scope.size
                    });
                    cursor.bringToFront();
                }, scope.cursorRate);

                element.on('mousemove', function (ev) {
                    moveCursor(ev);
                });
            }
        };
    });
