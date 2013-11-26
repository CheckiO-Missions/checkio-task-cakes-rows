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

            var attrBackLine = {"stroke": colorBlue3, "stroke-width": 1, "stroke-dasharray": "- "};
            var attrLine = {"stroke": colorOrange4, "stroke-width": 3};
            var attrCake = {"stroke": colorBlue4, "fill": colorBlue4};

            this.prepareCanvas = function(dom) {
                paper = Raphael(dom, sizeX, sizeY);
                for (var i = 1; i < 10; i++) {
                    paper.path(format("M{0},{1}H{2}",
                        x0, y0 + i * cell, sizeX - x0)).attr(attrBackLine);
                    paper.path(format("M{0},{1}V{2}",
                        x0 + cell * i, y0, sizeY - y0)).attr(attrBackLine);

                }

            };

            this.createCanvas = function(cakes, lines) {
                cakeSet = paper.set();
                for (var i = 0; i < cakes.length; i++) {
                    cakeSet.push(paper.circle(x0, y0, rCake).attr(attrCake));
                    cakeSet[i].animate({cx: x0 + cakes[i][0] * cell, cy: y0 + cakes[i][1] * cell}, 200
//                        , function() {this.glow({width: 5, color: colorBlue3});}
                    );

                }
                setTimeout(function(){
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
            }

        }

    }
);
