//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new CakesCanvas();
            canvas.prepareCanvas($content.find(".explanation")[0]);
            canvas.createCanvas(checkioInput, explanation);

            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
        var tCanvas;

        ext.set_console_process_ret(function (this_e, ret) {
            try {
                ret = JSON.parse(ret);
            }
            catch (err) {
            }
            $tryit.find(".checkio-result").html("Result:<br>" + JSON.stringify(ret));
        });

        ext.set_generate_animation_panel(function (this_e) {

            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
            tCanvas = new CakesCanvas({cell: 20, x0: 10, y0: 10});
            tCanvas.prepareCanvas($tryit.find(".tryit-canvas")[0]);
            tCanvas.createCanvasTryit([
                [2, 2],
                [8, 8],
                [2, 8],
                [8, 2],
                [5, 5]
            ]);
            tCanvas.createFeedback();

            $tryit.find(".bn-clear").click(function (e) {
                tCanvas.clearCanvas();
                e.stopPropagation();
                return false;
            });
            $tryit.find(".bn-random").click(function (e) {
                tCanvas.randomCanvas();
                e.stopPropagation();
                return false;
            });

            $tryit.find(".bn-check").click(function (e) {

                this_e.sendToConsoleCheckiO(tCanvas.gatherData());
                e.stopPropagation();
                return false;
            });
        });

        function CakesCanvas(options) {
            var format = Raphael.format;

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            options = options || {};

            var x0 = options.x0 || 20,
                y0 = options.y0 || 20;

            var cell = options.cell || 30;

            var sizeX = cell * 10 + 2 * x0,
                sizeY = cell * 10 + 2 * y0;

            var rCake = cell * 3 / 8;

            var paper;
            var cakeSet;

            var attrBackLine = {"stroke": colorBlue3, "stroke-width": 0.5, "stroke-dasharray": "- "};
            var attrLine = {"stroke": colorOrange4, "stroke-width": 3};
            var attrCake = {"stroke": colorBlue3, "fill": colorBlue3};
            var obj = this;
            var active;

            this.prepareCanvas = function (dom) {
                paper = Raphael(dom, sizeX, sizeY);
                for (var i = 1; i < 10; i++) {
                    paper.path(format("M{0},{1}H{2}",
                        x0, y0 + i * cell, sizeX - x0)).attr(attrBackLine);
                    paper.path(format("M{0},{1}V{2}",
                        x0 + cell * i, y0, sizeY - y0)).attr(attrBackLine);

                }

            };

            this.createCanvas = function (cakes, lines) {
                cakeSet = paper.set();
                for (var i = 0; i < cakes.length; i++) {
                    cakeSet.push(paper.circle(x0, y0, rCake).attr(attrCake));
                    cakeSet[i].animate({cx: x0 + cakes[i][0] * cell, cy: y0 + cakes[i][1] * cell}, 200
//                        , function() {this.glow({width: 5, color: colorBlue3});}
                    );

                }
                setTimeout(function () {
                    for (var j = 0; j < lines.length; j++) {
                        var cl = lines[j];
                        var line = paper.path(format(
                            "M{0},{1}L{0},{1}",
                            x0 + cl[0] * cell,
                            y0 + cl[1] * cell)).attr(attrLine);
                        line.insertBefore(cakeSet);
                        line.animate({path: format(
                            "M{0},{1}L{2},{3}",
                            x0 + cl[0] * cell,
                            y0 + cl[1] * cell,
                            x0 + cl[2] * cell,
                            y0 + cl[3] * cell)}, 200);
                    }
                }, 200);
            };


            this.createCanvasTryit = function (defLayout) {
                cakeSet = paper.set();

                for (var i = 0; i < defLayout.length; i++) {
                    var c = paper.circle(x0 + defLayout[i][0] * cell, y0 + defLayout[i][1] * cell, rCake).attr(attrCake).attr({"fill-opacity": 0, "opacity": 0});
                    c.animate({"fill-opacity": 1, "opacity": 1}, 100);
                    c.x = defLayout[i][0];
                    c.y = defLayout[i][1];
                    cakeSet.push(c);
                }
            };


            this.createFeedback = function () {

                var removeCircle = function () {
                    cakeSet.exclude(this);
                    this.animate({"fill-opacity": 0, "opacity": 0}, 100, function () {
                        this.remove();
                    });
                };
                cakeSet.click(removeCircle);
                if (!active) {
                    active = paper.rect(x0, y0, cell * 10, cell * 10).attr({"fill": colorWhite, "fill-opacity": 0, "stroke-width": 0});

                    active.click(function (e) {
                        var x = Math.round((e.offsetX - x0) / cell);
                        var y = Math.round((e.offsetY - y0) / cell);
                        var c = paper.circle(x0 + x * cell, y0 + y * cell, rCake).attr(attrCake)
                        c.animate({"fill-opacity": 1, "opacity": 1}, 100);
                        c.click(removeCircle);
                        c.x = x;
                        c.y = y;
                        cakeSet.push(c);
                    });
                }
                cakeSet.toFront();

            };

            this.gatherData = function () {
                var res = [];
                for (var i = 0; i < cakeSet.length; i++) {
                    res.push([cakeSet[i].x, cakeSet[i].y]);
                }
                return res;
            };

            this.clearCanvas = function () {
                cakeSet.forEach(function (c) {
                    c.animate({"fill-opacity": 0, "opacity": 0}, 100, function () {
                        this.remove();
                    });
                });
                cakeSet.clear();
            };

            this.randomCanvas = function () {
                var quant = Math.floor(Math.random() * 15 + 5);
                var cakes = [];
                for (var i = 0; i < quant; i++) {
                    var x = Math.floor(Math.random() * 9 + 1);
                    var y = Math.floor(Math.random() * 9 + 1);
                    if (cakes.join(";").indexOf(x + "," + y) === -1) {
                        cakes.push([x, y]);
                    }
                }
                obj.clearCanvas();
                obj.createCanvasTryit(cakes);
                obj.createFeedback();

            }


        }

    }
);
