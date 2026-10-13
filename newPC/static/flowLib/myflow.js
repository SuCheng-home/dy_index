if (!sessionStorage.getItem('flowType')) {
    sessionStorage.setItem('flowType', 'askLeave');
}
var flowType = sessionStorage.getItem('flowType');

var condit2Dic = [];

var prefix = location.href.indexOf('weixiaojia.net') !== -1 ? 'https://www.weixiaojia.net' : 'https://www.zhxiaoyuan.cn';

if (flowType === 'askLeave') {
    $.ajax({
        type: "POST",
        url: prefix + "/wxcepClient1/common/sysDictionary/findDicsByCode?dicCode=workflowcondittw",
        error: function () {
            wxcepAlert("服务器异常！");
        },
        success: function (resultData) {
            console.log(resultData);

            if (resultData.result) {
                condit2Dic = resultData.data;
                setTimeout(function () {
                    initFunc(jQuery);
                    initFunc2(jQuery);
                    initFunc3(jQuery);
                    initFunc4(jQuery);
                }, 200);
            } else {
                wxcepAlert("服务器异常！");
            }
        }
    });
} else if (flowType === 'procure') {
    $.ajax({
        type: "POST",
        url: prefix + "/wxcepClient1/common/schoolDictionary/findSchoolDicsByCode?dicCode=procureType&schoolId=" + schoolId,
        error: function () {
            wxcepAlert("服务器异常！");
        },
        success: function (resultData) {
            console.log(resultData);
            if (resultData.result) {
                condit2Dic = resultData.data;
                setTimeout(function () {
                    initFunc(jQuery);
                    initFunc2(jQuery);
                    initFunc3(jQuery);
                    initFunc4(jQuery);
                }, 200);

            } else {
                wxcepAlert("服务器异常！");
            }
        }
    });
} else {
    setTimeout(function () {
        initFunc(jQuery);
        initFunc2(jQuery);
        initFunc3(jQuery);
        initFunc4(jQuery);
    }, 200);

}

var initFunc = function ($) {
    setTimeout(function () {
        $('#myflow').find('svg').trigger('click');
    }, 200);


    var myflow = {};
    myflow.config = {
        editable: true,
        allowStateMutiLine: false,
        moving: {
            flag: false,
            prepdot: {x: 0, y: 0},
            dots: [],
            isNewDot: false,
            temp: [],
            preRect: null
        },
        historys: [],
        lineHeight: 15,
        basePath: '',
        rect: {// 状态
            attr: {
                x: 10,
                y: 10,
                width: 100,
                height: 50,
                r: 5,
                fill: '90-#fff-#C0C0C0',
                stroke: '#000',
                "stroke-width": 1
            },
            showType: 'image&text', // image,text,image&text
            type: 'state',
            name: {
                text: 'state',
                'font-style': 'italic'
            },
            text: {
                text: '状态',
                'font-size': 13
            },
            margin: 5,
            props: [],
            img: {}
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#808080',
                    fill: "none",
                    "stroke-width": 2,
                    cursor: "pointer"
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#808080',
                    fill: "#808080",
                    "stroke-width": 2,
                    radius: 4
                },
                fromDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                toDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                bigDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                smallDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    font: '14px "Arial"',
                    cursor: "move",
                    'background': '#000'
                }
            },
            text: {
                patten: '',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                priority: {
                    name: 'priority',
                    label: '优先级',
                    value: '1',
                    editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                conditionInput: {
                    name: 'enterCondition',
                    label: '进入条件',
                    value: '[表达式]',
                    editor: function () {
                        return new myflow.editors.lineCondition();
                    }
                },
                isRole: 2,
                isCondit: 2,
                isConditTw: 2,
                adjustClass: 2,
                role: [],
                conditionType: '',
                conditionParam: '',
                linCondition: '',
                conditionTypeTw: '',
                linConditionTw: ''
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {
                    alert(data);
                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 30,
                right: 30
            },
            props: {}
        },
        restore: '',
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        }
    };

    myflow.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        // nextId: (function () {
        //     var uid = 0;
        //     return function () {
        //         return ++uid;
        //     };
        // })(),
        nextId: function () {
            return new Date().getTime();
        },
        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1, yFlag = start.x < end.x
                ? -1
                : 1, arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        }
    }

    myflow.rect = function (o, r, id) {
        var _this = this, _uid = myflow.util.nextId(), _o = $.extend(true, {},
            myflow.config.rect, o), _id = id || 'rect' + _uid, _r = r, // Raphael画笔
            _rect, _img, // 图标
            _name, // 状态名称
            _text, // 显示文本
            _ox, _oy; // 拖动时，保存起点位置;


        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
            _o.attr.r).hide().attr(_o.attr);

        _img = _r.image(myflow.config.basePath + _o.img.src,
            _o.attr.x + _o.img.width / 2,
            _o.attr.y + (_o.attr.height - _o.img.height) / 2, _o.img.width,
            _o.img.height).hide();
        _name = _r.text(
            _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
            _o.attr.y + myflow.config.lineHeight / 2, _o.name.text).hide()
            .attr(_o.name);
        _text = _r.text(
            _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
            _o.attr.y + (_o.attr.height - myflow.config.lineHeight) / 2
            + myflow.config.lineHeight, _o.text.text).hide()
            .attr(_o.text); // 文本

        // 拖动处理----------------------------------------
        _rect.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _img.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _name.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _text.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });

        var dragMove = function (dx, dy) {// 拖动中
            if (!myflow.config.editable)
                return;

            var x = (_ox + dx); // -((_ox+dx)%10);
            var y = (_oy + dy); // -((_oy+dy)%10);

            _bbox.x = x - _o.margin;
            _bbox.y = y - _o.margin;
            resize();
        };

        var dragStart = function () {// 开始拖动
            _ox = _rect.attr("x");
            _oy = _rect.attr("y");
            _rect.attr({
                opacity: 0.5
            });
            _img.attr({
                opacity: 0.5
            });
            _text.attr({
                opacity: 0.5
            });
        };

        var dragUp = function () {// 拖动结束
            _rect.attr({
                opacity: 1
            });
            _img.attr({
                opacity: 1
            });
            _text.attr({
                opacity: 1
            });
        };

        // 改变大小的边框
        var _bpath, _bdots = {}, _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        _bpath = _r.path('M0 0L1 1').hide();
        _bdots['t'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 't');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 't');
        }, function () {
        }); // 上
        _bdots['lt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'nw-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'lt');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'lt');
        }, function () {
        }); // 左上
        _bdots['l'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'l');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'l');
        }, function () {
        }); // 左
        _bdots['lb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'sw-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'lb');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'lb');
        }, function () {
        }); // 左下
        _bdots['b'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'b');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'b');
        }, function () {
        }); // 下
        _bdots['rb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'se-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'rb');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'rb');
        }, function () {
        }); // 右下
        _bdots['r'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'r');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'r')
        }, function () {
        }); // 右
        _bdots['rt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'ne-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'rt');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'rt')
        }, function () {
        }); // 右上
        $([_bdots['t'].node, _bdots['lt'].node, _bdots['l'].node, _bdots['lb'].node, _bdots['b'].node, _bdots['rb'].node, _bdots['r'].node, _bdots['rt'].node]).click(function () {
            return false;
        });

        var bdragMove = function (dx, dy, t) {
            if (!myflow.config.editable)
                return;
            var x = _bx + dx, y = _by + dy;
            switch (t) {
                case 't':
                    _bbox.height += _bbox.y - y;
                    _bbox.y = y;
                    break;
                case 'lt':
                    _bbox.width += _bbox.x - x;
                    _bbox.height += _bbox.y - y;
                    _bbox.x = x;
                    _bbox.y = y;
                    break;
                case 'l':
                    _bbox.width += _bbox.x - x;
                    _bbox.x = x;
                    break;
                case 'lb':
                    _bbox.height = y - _bbox.y;
                    _bbox.width += _bbox.x - x;
                    _bbox.x = x;
                    break;
                case 'b':
                    _bbox.height = y - _bbox.y;
                    break;
                case 'rb':
                    _bbox.height = y - _bbox.y;
                    _bbox.width = x - _bbox.x;
                    break;
                case 'r':
                    _bbox.width = x - _bbox.x;
                    break;
                case 'rt':
                    _bbox.width = x - _bbox.x;
                    _bbox.height += _bbox.y - y;
                    _bbox.y = y;
                    break;
            }
            resize();
            // $('body').append(t);
        };
        var bdragStart = function (ox, oy, t) {
            _bx = ox;
            _by = oy;
        };

        // 事件处理--------------------------------
        $([_rect.node, _text.node, _name.node, _img.node]).bind('click',
            function () {
                if (!myflow.config.editable)
                    return;
                showBox();
                myflow.config.tools.clickRect(_this.getId(), _this.toJson());
                var mod = $(_r).data('mod');
                switch (mod) {
                    case 'pointer':
                        $(_r).data('currNode', _this);
                        break;
                    case 'path':

                        var pre = $(_r).data('currNode');

                        var moving = myflow.config.moving;

                        //处理：禁止两个状态间有重复的线
                        if (myflow.config.allowStateMutiLine) {
                            var paths = myflow.config.tempData.paths, flag = false;
                            for (var k in paths) {
                                if (paths[k]) {
                                    if ((moving.preRect && moving.preRect.getId() == paths[k].from().getId()) && (_this.getId() == paths[k].to().getId())) {
                                        flag = true;
                                        break;
                                    }
                                    if ((moving.preRect && moving.preRect.getId() == paths[k].to().getId()) && (_this.getId() == paths[k].from().getId())) {
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                            if (flag) {
                                break;
                            }
                        }

                        if ((moving.preRect && moving.preRect == _this)) {
                            break;
                        }

                        moving.flag = true;
                        if (moving.preRect) {
                            $(_r).trigger('addpath', [moving.preRect, _this, moving.dots]);
                            myflow.config.moving = {
                                flag: false,
                                prepdot: {x: 0, y: 0},
                                dots: [],
                                isNewDot: false,
                                preRect: null,
                                temp: []
                            };

                            moving.temp.map(function (item, index) {
                                item.remove();
                            })
                            $(_r).data('currNode', null);
                            break;
                        }
                        if (pre && pre.getId().substring(0, 4) == 'rect') {
                            if (pre.getId() != _id) {
                                $(_r).trigger('addpath', [pre, _this]);
                            }
                        }
                        moving.preRect = _this;
                        $(_r).data('currNode', _this);
                        break;
                }
                $(_r).trigger('click', _this);
                return false;
            });

        var clickHandler = function (e, src) {
            if (!myflow.config.editable)
                return;

            if (myflow.config.moving.flag) {
                if (src.getId().substring(0, 4) == '0000') {
                    myflow.config.moving.isNewDot = true;
                }

                if (myflow.config.moving.preRect == src && myflow.config.moving.temp.length > 2) {
                    myflow.config.moving.temp.pop().remove();
                    myflow.config.moving.temp.pop().remove();
                    myflow.config.moving.isNewDot = true;
                }
            }

            if (src.getId() == _id) {
                $(_r).trigger('showprops', [_o.props, src]);
            } else {
                hideBox();
            }
        };
        $(_r).bind('click', clickHandler);

        var textchangeHandler = function (e, text, src) {
            if (src.getId() == _id) {
                _text.attr({
                    text: text
                });
            }
        };
        $(_r).bind('textchange', textchangeHandler);

        // 私有函数-----------------------
        // 边框路径
        function getBoxPathString() {
            return 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
                + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
                + ' ' + (_bbox.y + _bbox.height) + 'L'
                + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
                + ' ' + _bbox.y;
        }

        // 显示边框
        function showBox() {
            _bpath.show();
            for (var k in _bdots) {
                _bdots[k].show();
            }
        }

        // 隐藏
        function hideBox() {
            _bpath.hide();
            for (var k in _bdots) {
                _bdots[k].hide();
            }
        }

        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image':
                    _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'start_text':
                    _rect.attr({
                        fill: '#C0DBA6'
                    });
                case 'text':
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,
                        y: ry + rh / 2
                    }).show(); // 文本
                    break;
                case 'image&text':
                    _rect.show();
                    _name.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + myflow.config.lineHeight / 2
                    }).show();
                    _text.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + (rh - myflow.config.lineHeight) / 2
                            + myflow.config.lineHeight
                    }).show(); // 文本
                    _img.attr({
                        x: rx + _o.img.width / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }

            _bdots['t'].attr({
                x: _bbox.x + _bbox.width / 2 - _bw / 2,
                y: _bbox.y - _bw / 2
            }); // 上
            _bdots['lt'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2
            }); // 左上
            _bdots['l'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            }); // 左
            _bdots['lb'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 左下
            _bdots['b'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 下
            _bdots['rb'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 右下
            _bdots['r'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            }); // 右
            _bdots['rt'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2
            }); // 右上
            _bpath.attr({
                path: getBoxPathString()
            });

            $(_r).trigger('rectresize', _this);
        }

        // 函数----------------
        // 转化json字串
        this.toJsonForRelease = function () {
            var props = {};

            props.stepIdNo = this.getId();
            var typeMapping = {
                'state': 2,
                'start': 1,
                'end': 3
            };
            props.statusName = _o.props.text.value;
            props.type = typeMapping[_o.type];

            var subPropList = [
                'isCreateUser',
                'isDepartManger',
                'isEleDepartManger',
                'isFixe',
                'isRole',
                'isPidHeader'
            ];

            if (props.type !== 3) {
                if ($.trim(_o.props.name.value) === '') {
                    wxcepAlert('状态名称不能为空！');
                    return false;
                }
                props.name = _o.props.name.value;
                var propList = [
                    'isSave',
                    'isEditor',
                    'isFile',
                    'isSubmit',
                    'isCancel',
                    'isBack',
                    'isBatchContent',
                    'isAddress',
                    'isTransfer',
                    'isHerAsk',
                    'transfer',
                    'deealSelectedType',
                    'saveName',
                    'editorName',
                    'submitName',
                    'backName',
                    'cancelName',
                    'isRemind',
                    'batchType',
                    'stepBatchEffect'
                ];
                $.each(propList, function (index, prop) {
                    props[prop] = _o.props[prop];
                });
                if (
                    props.isSave === 2 &&
                    props.isSubmit === 2 &&
                    props.isBack === 2 &&
                    props.isBatchContent === 2 && props.isAddress === 2 && props.isTransfer === 2 && props.isHerAsk === 2 &&
                    props.isEditor === 2 &&
                    props.isFile === 2 &&
                    props.isCancel === 2
                ) {
                    wxcepAlert('至少选择一项操作');
                    return false;
                }

                props.dealUserJson = {};
                $.each(subPropList, function (index, prop) {
                    props.dealUserJson[prop] = _o.props.dealUser[prop];
                });
                props.dealUserJson.userSelectedType = parseInt(_o.props.dealUser.userSelectedType);

                props.dealUserJson.roleJson = _o.props.dealUser.role;
                props.dealUserJson.fixeJson = _o.props.dealUser.fixe;
                if (props.deealSelectedType === 1) {
                    if (
                        props.dealUserJson.isCreateUser === 2 &&
                        props.dealUserJson.isRole === 2 &&
                        props.dealUserJson.isDepartManger === 2 &&
                        props.dealUserJson.isPidHeader === 2 &&
                        props.dealUserJson.isFixe === 2 &&
                        props.dealUserJson.isEleDepartManger === 2
                    ) {
                        wxcepAlert('请选择处理人！');
                        return false;
                    }
                    if (props.dealUserJson.isRole === 1 && JSON.stringify(props.dealUserJson.roleJson) === '{}') {
                        wxcepAlert('请选择处理人：角色！');
                        return false;
                    }
                    if (props.dealUserJson.isFixe === 1 && props.dealUserJson.fixeJson.depart.length === 0 && props.dealUserJson.fixeJson.user.length === 0) {
                        wxcepAlert('请选择处理人：固定人员！');
                        return false;
                    }
                }

                props.remindUserJson = {};
                if (props.isRemind === 1) {
                    $.each(subPropList, function (index, prop) {
                        props.remindUserJson[prop] = _o.props.remindUser[prop];
                    });
                    props.remindUserJson.isDealUser = _o.props.remindUser.isDealUser;
                    props.remindUserJson.roleListJson = _o.props.remindUser.role;
                    props.remindUserJson.fixeJson = _o.props.remindUser.fixe;
                    if (
                        props.remindUserJson.isCreateUser === 2 &&
                        props.remindUserJson.isRole === 2 &&
                        props.remindUserJson.isDepartManger === 2 &&
                        props.remindUserJson.isFixe === 2 &&
                        props.remindUserJson.isPidHeader === 2 &&
                        props.remindUserJson.isEleDepartManger === 2 &&
                        props.remindUserJson.isDealUser === 2
                    ) {
                        wxcepAlert('请选择抄送人！');
                        return false;
                    }
                    if (props.remindUserJson.isRole === 1 && props.remindUserJson.roleListJson.length === 0) {
                        wxcepAlert('请选择抄送人：角色！');
                        return false;
                    }
                    if (props.remindUserJson.isFixe === 1 && props.remindUserJson.fixeJson.depart.length === 0 && props.remindUserJson.fixeJson.user.length === 0) {
                        wxcepAlert('请选择抄送人：固定人员！');
                        return false;
                    }
                }
            } else {
                props.isRemind = _o.props.isRemind;
                props.remindUserJson = {};
                if (props.isRemind === 1) {
                    $.each(subPropList, function (index, prop) {
                        props.remindUserJson[prop] = _o.props.remindUser[prop];
                    });
                    props.remindUserJson.isDealUser = _o.props.remindUser.isDealUser;
                    props.remindUserJson.roleListJson = _o.props.remindUser.role;
                    props.remindUserJson.fixeJson = _o.props.remindUser.fixe;
                    if (
                        props.remindUserJson.isCreateUser === 2 &&
                        props.remindUserJson.isRole === 2 &&
                        props.remindUserJson.isDepartManger === 2 &&
                        props.remindUserJson.isPidHeader === 2 &&
                        props.remindUserJson.isFixe === 2 &&
                        props.remindUserJson.isEleDepartManger === 2 &&
                        props.remindUserJson.isDealUser === 2
                    ) {
                        wxcepAlert('请选择抄送人！');
                        return false;
                    }
                    if (props.remindUserJson.isRole === 1 && props.remindUserJson.roleListJson.length === 0) {
                        wxcepAlert('请选择抄送人：角色！');
                        return false;
                    }
                    if (props.remindUserJson.isFixe === 1 && props.remindUserJson.fixeJson.depart.length === 0 && props.remindUserJson.fixeJson.user.length === 0) {
                        wxcepAlert('请选择抄送人：固定人员！');
                        return false;
                    }
                }

                props = $.extend({}, props, {
                    name: '结束',
                    statusName: '结束',
                    isBack: 2,
                    isSave: 2,
                    isSubmit: 2,
                    isEditor: 2,
                    isCancel: 2,
                    isBatchContent: 2,
                    isAddress: 2,
                    isTransfer: 2,
                    isHerAsk: 2,
                    transfer: 1,
                    deealSelectedType: 1,
                    editorName: '',
                    saveName: '',
                    submitName: '',
                    backName: '',
                    cancelName: '',
                    stepBatchEffect: 1,
                    dealUserJson: {
                        fixeJson: {},
                        isCreateUser: 2,
                        isDepartManger: 2,
                        isEleDepartManger: 2,
                        isFixe: 2,
                        isPidHeader: 2,
                        isRole: 2,
                        roleJson: {},
                        userSelectedType: 1
                    }
                });
                props.name = '结束';
            }
            return props;
        }
        this.toJson = function () {
            var data = {
                type: _o.type,
                ID: !_o.ID ? "" : _o.ID,
                text: {
                    text: !_text.node.textContent ? "" : _text.node.textContent,
                },
                attr: {
                    x: Math.round(_rect.attr('x')),
                    y: Math.round(_rect.attr('y')),
                    width: Math.round(_rect.attr('width')),
                    height: Math.round(_rect.attr('height'))
                },
                props: _o.props
            };
            return data;
        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);


            _o = $.extend(true, _o, data);

            _text.attr({
                text: obj.text.text
            });
            resize();
        };

        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.remove = function () {
            _rect.remove();
            _text.remove();
            _name.remove();
            _img.remove();
            _bpath.remove();
            for (var k in _bdots) {
                _bdots[k].remove();
            }
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };

        resize(); // 初始化位置
    };

    myflow.path = function (o, r, from, to, guid, ec, dots, id) {
        var _this = this, _r = r, _o = $.extend(true, {}, myflow.config.path), _path, _markpath, _arrow, _text,
            _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = id || 'path'
            + myflow.util.nextId(), _dotList, _autoText = true;
        _o.lineID = guid;
        oec = (ec > 0 ? (parseInt(ec) == 1 ? 25 : parseInt(ec) * 9 + 22) : 0);

        // 点
        function dot(type, pos, left, right) {
            var _this = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
                _pos = pos; // 缓存位置信息{x,y}, 注意：这是计算出中心点

            switch (_t) {
                case 'from':
                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                        pos.y - _o.attr.fromDot.height / 2,
                        _o.attr.fromDot.width, _o.attr.fromDot.height)
                        .attr(_o.attr.fromDot);
                    break;
                case 'big':
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                        pos.y - _o.attr.bigDot.height / 2,
                        _o.attr.bigDot.width, _o.attr.bigDot.height)
                        .attr(_o.attr.bigDot);
                    break;
                case 'small':
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                        pos.y - _o.attr.smallDot.height / 2,
                        _o.attr.smallDot.width, _o.attr.smallDot.height)
                        .attr(_o.attr.smallDot);
                    break;
                case 'to':
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                        pos.y - _o.attr.toDot.height / 2,
                        _o.attr.toDot.width, _o.attr.toDot.height)
                        .attr(_o.attr.toDot);

                    break;
            }
            if (_n && (_t == 'big' || _t == 'small')) {
                _n.drag(function (dx, dy) {
                    dragMove(dx, dy);
                }, function () {
                    dragStart()
                }, function () {
                    dragUp();
                }); // 初始化拖动
                var dragMove = function (dx, dy) {// 拖动中
                    var x = (_ox + dx), y = (_oy + dy);
                    _this.moveTo(x, y);
                };

                var dragStart = function () {// 开始拖动
                    if (_t == 'big') {
                        _ox = _n.attr("x") + _o.attr.bigDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.bigDot.height / 2;
                    }
                    if (_t == 'small') {
                        _ox = _n.attr("x") + _o.attr.smallDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.smallDot.height / 2;
                    }
                };

                var dragUp = function () {// 拖动结束

                };
            }
            $(_n.node).click(function () {
                return false;
            });

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {
                if (pos) {
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from':
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(myflow.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(myflow.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        break;
                    case 'big':

                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(myflow.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(myflow.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(myflow.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (myflow.util.isLine(_lt.left().pos(), pos, _rt
                            .right().pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small': // 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !myflow.util.isLine(_lt.pos(), {
                            x: _pos.x,
                            y: _pos.y
                        }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', myflow.util.center(_lt
                                .pos(), _pos), _lt, _lt
                                .right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', myflow.util.center(_rt
                                    .pos(), _pos), _rt.left(),
                                _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to':
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(myflow.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }

                refreshpath();
            };
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
                .getBBox(), _fromPos, _toPos;

            _fromPos = myflow.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = myflow.util.connPoint(_toBB, _fromPos);

            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2 + oec,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = 'M' + d.pos().x + ' ' + d.pos().y, arr = '';
                // 线的路径
                while (d.right()) {
                    d = d.right();
                    p += 'L' + d.pos().x + ' ' + d.pos().y;
                }
                // 箭头路径
                var arrPos = myflow.util.arrow(d.left().pos(), d.pos(),
                    _o.attr.arrow.radius);
                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                    + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                    + arrPos[2].y + 'z';
                return [p, arr];
            };
            this.toJson = function () {
                var data = [];
                var d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data.push({
                            x: Math.round(d.pos().x),
                            y: Math.round(d.pos().y)
                        });
                    d = d.right();
                }
                return data;
            };
            this.restore = function (data) {
                var obj = data, d = _fromDot.right();

                for (var i = 0; i < obj.length; i++) {
                    if (!d) {
                        break;
                    }
                    d.moveTo(obj[i].x, obj[i].y);
                    d.moveTo(obj[i].x, obj[i].y);
                    d = d.right();
                }

                this.hide();
            };

            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
        }

        // 初始化操作
        _o = $.extend(true, _o, o);
        _path = _r.path(_o.attr.path.path).attr(_o.attr.path);
        _markpath = _r.path(_o.attr.path.path)
            .attr({
                fill: "none",
                stroke: "BLACK",
                "stroke-miterlimit": 10,
                "stroke-width": 2,
                "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
                "visibility": "hidden",
                "pointer-events": "stroke",
                "cursor": "crosshair"
            });
        _arrow = _r.path(_o.attr.arrow.path).attr(_o.attr.arrow);

        _dotList = new dotList();
        _dotList.hide();

        _text = _r.text(0, 0, _o.text.text || _o.text.patten.replace('{from}', _from.text()).replace('{to}',
            _to.text())).attr(_o.attr.text);
        _text.drag(function (dx, dy) {
            if (!myflow.config.editable)
                return;
            _text.attr({
                x: _ox + dx,
                y: _oy + dy
            });
        }, function () {
            _ox = _text.attr('x');
            _oy = _text.attr('y');
        }, function () {
            var mid = _dotList.midDot().pos();
            _textPos = {
                x: _text.attr('x') - mid.x,
                y: _text.attr('y') - mid.y
            };
        });

        refreshpath(); // 初始化路径

        // 事件处理--------------------
        $([_path.node, _markpath.node, _arrow.node, _text.node]).bind('click', function () {
            if (!myflow.config.editable)
                return;
            $(_r).trigger('click', _this);
            $(_r).data('currNode', _this);
            myflow.config.tools.clickPath(_id);
            return false;
        });

        // 处理点击事件，线或矩形
        var clickHandler = function (e, src) {
            if (!myflow.config.editable)
                return;

            if (src && src.getId() == _id) {
                _dotList.show();
                $(_r).trigger('showprops', [_o.props, _this]);
            } else {
                _dotList.hide();
            }

            var mod = $(_r).data('mod');
            switch (mod) {
                case 'pointer':
                    break;
                case 'path':
                    break;
            }

        };
        $(_r).bind('click', clickHandler);

        // 删除事件处理
        var removerectHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src
                && (src.getId() == _from.getId() || src.getId() == _to.getId())) {
                $(_r).trigger('removepath', _this);
            }
        };
        $(_r).bind('removerect', removerectHandler);

        // 矩形移动时间处理
        var rectresizeHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (_from && _from.getId() == src.getId()) {
                var rp;
                if (_dotList.fromDot().right().right().type() == 'to') {
                    rp = {
                        x: _to.getBBox().x + _to.getBBox().width / 2,
                        y: _to.getBBox().y + _to.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.fromDot().right().right().pos();
                }
                var p = myflow.util.connPoint(_from.getBBox(), rp);
                _dotList.fromDot().moveTo(p.x, p.y);
                refreshpath();
            }
            if (_to && _to.getId() == src.getId()) {
                var rp;
                if (_dotList.toDot().left().left().type() == 'from') {
                    rp = {
                        x: _from.getBBox().x + _from.getBBox().width / 2,
                        y: _from.getBBox().y + _from.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.toDot().left().left().pos();
                }
                var p = myflow.util.connPoint(_to.getBBox(), rp);
                _dotList.toDot().moveTo(p.x, p.y);
                refreshpath();
            }
        };
        $(_r).bind('rectresize', rectresizeHandler);

        var textchangeHandler = function (e, v, src) {
            if (src.getId() == _id) {// 改变自身文本
                _text.attr({
                    text: v
                });
                _autoText = false;
            }
            //$('body').append('['+_autoText+','+_text.attr('text')+','+src.getId()+','+_to.getId()+']');
            if (_autoText) {
                if (_to.getId() == src.getId()) {
                    //$('body').append('change!!!');
                    _text.attr({
                        text: _o.text.patten.replace('{from}',
                            _from.text()).replace('{to}', v)
                    });
                } else if (_from.getId() == src.getId()) {
                    //$('body').append('change!!!');
                    _text.attr({
                        text: _o.text.patten.replace('{from}', v)
                            .replace('{to}', _to.text())
                    });
                }
            }
        };
        $(_r).bind('textchange', textchangeHandler);

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        // 转化json数据 lineline
        this.toJson = function () {
            var data = {
                lineID: !_o.lineID ? "" : _o.lineID,
                from: _from.getId(),
                to: _to.getId(),
                dots: _dotList.toJson(),
                text: {
                    text: _text.attr('text'),
                    textPos: {
                        x: Math.round(_textPos.x),
                        y: Math.round(_textPos.y)
                    }
                },
                props: _o.props
            };
            return data;
        };
        this.toJsonForRelease = function () {
            var props = {};
            if (_o.props.isCondit === 1 && _o.props.conditionParam === '') {
                wxcepAlert('条件不能为空');
                return false;
            }
            if (_o.props.isConditTw === 1 && _o.props.conditionTypeTw.length === 0) {
                wxcepAlert('请选择条件');
                return false;
            }
            if (_o.props.isRole === 1 && _o.props.role.length === 0) {
                wxcepAlert('请选择角色');
                return false;
            }
            if ($.trim(_o.props.priority.value) !== '' && !/^\s*\d+\s*$/.test(_o.props.priority.value)) {
                wxcepAlert('优先性必须是正整数！');
                return false;
            }
            props = {
                lineIdNo: this.getId(),
                fromId: this.from().getId(),
                toId: this.to().getId(),
                lineNum: _o.props.priority.value
            };
            props.linCondition = {
                isRole: _o.props.isRole,
                isCondit: _o.props.isCondit,
                isConditTw: _o.props.isConditTw,
                adjustClass: _o.props.adjustClass,
                roleJson: _o.props.role,
                conditJson: _o.props.linCondition,
                conditTwJson: _o.props.linConditionTw
            };
            return props;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;

            _o = $.extend(true, _o, data);
            //$('body').append('['+_text.attr('text')+','+_o.text.text+']');
            if (_text.attr('text') != _o.text.text) {
                //$('body').append('['+_text.attr('text')+','+_o.text.text+']');
                _text.attr({text: _o.text.text});
                _autoText = false;
            }

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
            _dotList.remove();
            _path.remove();
            _markpath.remove();
            _arrow.remove();
            _text.remove();
            try {
                $(_r).unbind('click', clickHandler);
            } catch (e) {
            }
            try {
                $(_r).unbind('removerect', removerectHandler);
            } catch (e) {
            }
            try {
                $(_r).unbind('rectresize', rectresizeHandler);
            } catch (e) {
            }
            try {
                $(_r).unbind('textchange', textchangeHandler);
            } catch (e) {
            }
        };

        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            _path.attr({
                path: p[0]
            });
            _markpath.attr({
                path: p[0]
            });
            _arrow.attr({
                path: p[1]
            });
            _text.attr({
                x: mid.x + _textPos.x,
                y: mid.y + _textPos.y
            });
            // $('body').append('refresh.');
        }

        this.getId = function () {
            return _id;
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };

        if (dots) {
            _dotList.restore(dots);
            rectresizeHandler(null, _to);
            $("#path").click();
            $(_r).data('currNode', null);
        }
    };

    myflow.props = function (o, r) {
        var _this = this, _pdiv = $('#myflow_props').hide().draggable({
            handle: '#myflow_props_handle'
        }).resizable().css(myflow.config.props.attr).bind('click',
            function (event) {
                // event.stopPropagation();
            }), _tb = _pdiv.find('table'), _r = r, _src;

        var showpropsHandler = function (e, props, src) {
            if (_src && _src.getId() == src.getId()) {// 连续点击不刷新
                return;
            }
            _src = src;
            $(_tb).find('.editor').each(function () {
                var e = $(this).data('editor');
                if (e)
                    e.destroy();
            });

            _tb.empty();
            _pdiv.show();
            for (var k in props) {
                if (!props[k].isHidden && k !== 'id' && props[k].label) {
                    _tb.append('<tr><th>' + props[k].label + '</th><td><div id="p'
                        + k + '" class="editor"></div></td></tr>');
                    if (props[k].editor)
                        props[k].editor().init(props, k, 'p' + k, src, _r);
                }
                // $('body').append(props[i].editor+'a');
            }
        };
        $(_r).bind('showprops', showpropsHandler);

    };


    // 初始化流程
    myflow.init = function (c, o) {
        $(c).width($(window).width()).height($(window).height());
        var _w = $(window).width(), _h = $(window).height(), _r = Raphael(c, _w
            * 1.5, _h * 1.5), _states = {}, _paths = {};
        $.extend(true, myflow.config, o);

        /**
         * 删除： 删除状态时，触发removerect事件，连接在这个状态上当路径监听到这个事件，触发removepath删除自身；
         * 删除路径时，触发removepath事件
         */
        $(document).keydown(function (arg) {
            if (!myflow.config.editable)
                return;
            if (arg.keyCode == 46 || (arg.originalEvent && arg.originalEvent.code == 'Backspace')) {
                var c = $(_r).data('currNode');
                if (c) {
                    if ($(arg.target).is('body')) {
                        if (c.getId().substring(0, 4) == 'rect') {
                            //添加到历史记录
                            myflow.config.historys.push({state: "removerect", object: c, data: getJson()});

                            myflow.config.tools.deleteRect(c.getId(), c.toJson());
                            $(_r).trigger('removerect', c);

                            /*清除自定义轨迹*/
                            myflow.config.moving.temp.map(function (item, index) {
                                item.remove();
                            })
                            myflow.config.moving = {
                                flag: false,
                                prepdot: {x: 0, y: 0},
                                dots: [],
                                isNewDot: false,
                                preRect: null,
                                temp: []
                            };

                        } else if (c.getId().substring(0, 4) == 'path') {
                            //添加到历史记录
                            myflow.config.historys.push({state: "removepath", object: c, data: getJson()});

                            myflow.config.tools.deletePath(c.getId());
                            $(_r).trigger('removepath', c);
                        }
                        $('svg').trigger('click');
                        $(_r).removeData('currNode');
                    }
                }
            }
        });

        $(document).click(function (event) {
            if ($(event.target).is('svg')) {
                $(_r).data('currNode', null);

                myflow.config.tempData = {
                    paths: _paths,
                    states: _states
                }

                $(_r).trigger('click', {
                    getId: function () {
                        return '00000000';
                    }
                });
                $(_r).trigger('showprops', [myflow.config.props.props, {
                    getId: function () {
                        return '00000000';
                    }
                }]);
            }

        });

        // 删除事件
        var removeHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src.getId().substring(0, 4) == 'rect') {
                _states[src.getId()] = null;
                src.remove();
            } else if (src.getId().substring(0, 4) == 'path') {
                _paths[src.getId()] = null;
                src.remove();
            }
        };
        $(_r).bind('removepath', removeHandler);
        $(_r).bind('removerect', removeHandler);

        // 添加状态
        $(_r).bind('addrect', function (e, type, o) {
            var data = getJson();
            var rect = new myflow.rect($.extend(true, {}, myflow.config.tools.states[type], o), _r);
            myflow.config.tools.addRect(rect.getId(), rect.toJson());
            _states[rect.getId()] = rect;

            //添加到历史记录
            myflow.config.historys.push({state: "addrect", object: rect, data: data});
        });


        function getNodeID(obj) {
            var json = obj.toJson();
            var str = json.split(',')[1];
            return str.substring(4, str.length - 1);
        }

        // 添加路径
        var addpathHandler = function (e, from, to, dots) {
            var data = getJson();
            var path = new myflow.path({}, _r, from, to, null, null, dots, null);
            myflow.config.tools.addPath(path.getId(), path.toJson());
            _paths[path.getId()] = path;

            //添加到历史记录
            myflow.config.historys.push({state: "addpath", object: path, data: data});
        };
        $(_r).bind('addpath', addpathHandler);


        var path, rect, circle;
        $("#myflow").mousemove(function (e) {
            var moving = myflow.config.moving;
            if (moving.flag) {
                var pre = $(_r).data('currNode');

                if (path && !moving.isNewDot) {
                    path.remove();
                    circle.remove();
                } else {
                    moving.isNewDot = false;
                }

                var dot = moving.prepdot;

                if (pre && pre.getBBox()) {
                    dot = myflow.util.connPoint(pre.getBBox(), {x: e.pageX, y: e.pageY});
                }
                var x = e.pageX - 10 - 230, y = e.pageY - 10 - 80;
                circle = _r.circle(x, y, 6).attr({fill: 'red', stroke: '#000', cursor: 'move'});

                path = _r.path('M' + dot.x + ' ' + dot.y + 'L' + x + ' ' + y + 'z')
                    .attr({stroke: '#808080', fill: "none", "stroke-width": 2, cursor: "pointer"});

                moving.temp.push(circle);
                moving.temp.push(path);
            }

        })

        // 取消描点
        document.oncontextmenu = function () {
            $("#pointer").click();
            // $("#path").click();
            return false;
        }

        $("#myflow").click(function (e) {
            if (myflow.config.moving.flag) {
                var dot = {
                    x: e.pageX - 10,
                    y: e.pageY - 10
                };
                myflow.config.moving.prepdot = dot;
                myflow.config.moving.dots.push(dot);
            }
        })

        // 模式
        $(_r).data('mod', 'pointer');
        if (myflow.config.editable) {
            // 工具栏
            $("#myflow_tools").css(myflow.config.tools.attr);

            $('#myflow_tools .node').hover(function () {
                $(this).addClass('mover');
            }, function () {
                $(this).removeClass('mover');
            });
            $('#myflow_tools .selectable').click(function () {
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                $(_r).data('mod', this.id);

            });

            $('#myflow_tools .state').each(function () {
                $(this).draggable({
                    helper: 'clone'
                });
            });

            $(c).droppable({
                accept: '.state',
                drop: function (event, ui) {
                    var temp = ui.helper.context.innerHTML;
                    var id = temp.substring(temp.indexOf(">") + 1, temp.length).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    $(_r).trigger('addrect', [ui.helper.attr('type'), {
                        attr: {
                            x: ui.helper.offset().left - 230,
                            y: ui.helper.offset().top - 80
                        }
                    }, id]);

                }
            });

            function getJson() {
                var processInfo = {}, states = {}, paths = {};
                var processProps = myflow.config.props.props;
                processInfo.id = processProps.id;
                for (var k in processProps) {
                    if (processProps[k]) {
                        processInfo[k] = processProps[k].value
                    }
                }
                for (var k in _states) {
                    if (_states[k]) {
                        states[_states[k].getId()] = _states[k].toJson();
                    }
                }
                for (var k in _paths) {
                    if (_paths[k]) {
                        paths[_paths[k].getId()] = _paths[k].toJson();
                    }
                }
                return {
                    processInfo: processInfo,
                    states: states,
                    paths: paths
                };
            }

            function getJsonForRelease() {
                var processInfo = {}, states = [], paths = [];
                var hasState = [false, false, false];
                var isValid = true;
                for (var k in _states) {
                    if (_states[k]) {
                        var stateJsonObj = _states[k].toJsonForRelease();
                        hasState[parseInt(stateJsonObj.type) - 1] = true;
                        if (stateJsonObj) {
                            states.push(stateJsonObj);
                        } else {
                            isValid = false;
                            return false;
                        }
                    }
                }

                for (var k in _paths) {
                    if (_paths[k]) {
                        var pathJsonObj = _paths[k].toJsonForRelease();
                        if (pathJsonObj) {
                            paths.push(pathJsonObj);
                        } else {
                            isValid = false;
                            return false;
                        }
                    }
                }

                var $container = $('#myflow_props');
                if ($container.find('.select--code').length !== 0) {
                    myflow.config.props.props.code.value = $container.find('select.select--code').val();
                    myflow.config.props.props.name.value = $container.find('#pname').find('input').val().trim();
                    myflow.config.props.props.version.value = $container.find('#pversion').find('input').val().trim();
                }

                var processProps = myflow.config.props.props;

                var validateList = [{
                    prop: 'name',
                    errorMsg: '流程名称必填！'
                }, {
                    prop: 'code',
                    errorMsg: '流程标识必填！'
                }, {
                    prop: 'version',
                    errorMsg: '流程版本必填！'
                }];
                $.each(validateList, function (index, validateItem) {
                    console.log('processProps', processProps)
                    console.log('validateItem', validateItem)
                    if (!processProps[validateItem.prop] || !processProps[validateItem.prop].value) {
                        wxcepAlert(validateItem.errorMsg);
                        isValid = false;
                        return false;
                    }
                });
                $.each(hasState, function (index, state) {
                    if (!state) {
                        wxcepAlert('流程图必须具有至少一个开始节点、环节节点、结束节点！');
                        isValid = false;
                        return false;
                    }
                });

                if (isValid) {
                    var jsonObj = {
                        stepList: states,
                        lineList: paths,
                        name: processProps.name.value,
                        remark: '',
                        type: processProps.code.value,
                        version: processProps.version.value,
                        workFlowJson: getJson()
                    };
                    if(workFlowId) {
                        jsonObj.id = workFlowId;
                    }
                    console.log(jsonObj);
                    return JSON.stringify(jsonObj);
                } else {
                    return false;
                }

            }

            // $('#myflow_save').click(function () {// 保存
            //     $('svg').trigger('click');
            //     setTimeout(function() {
            //         myflow.config.tools.save(JSON.stringify(getJson()));
            //     }, 200);
            // });
            $('#myflow_publish').click(function () {// 发布
                $('svg').trigger('click');
                var workFlowStr = getJsonForRelease();
                if (workFlowStr) {
                    console.log(workFlowStr);
                    setTimeout(function () {
                        // ajax;
                        $.ajax({
                            url: cepPath + (window.workFlowId ? "/structure/workFlow/updateWorkFlow" : "/structure/workFlow/addWorkFlow") + '?token=' + window.token,// 请求地址
                            method: 'POST', // HTTP Verb
                            async: true, // 是否异步
                            dataType: 'JSON', // 返回数据格式
                            data: workFlowStr,
                            headers: {
                                'content-type': 'application/json'
                            },
                            success: function (data) { // 请求成功回调， data为请求获得数据
                                console.log(data);
                                if(data.result) {
                                    window.history.go(-1);
                                } else {
                                    wxcepAlert(data.msg);
                                }
                            },
                            error: function (error) {
                                wxcepAlert(error.msg);
                            },

                        })
                    }, 200);
                }
            });
            $('#return_page').click(function () {//返回
                $('svg').trigger('click');
                setTimeout(function () {
                    history.go(-1);
                }, 200);
            });
            $('#delete').click(function () {//删除
                if (!myflow.config.editable)
                    return;
                var c = $(_r).data('currNode');
                if (c) {
                    if (c.getId().substring(0, 4) == 'rect') {
                        //添加到历史记录
                        myflow.config.historys.push({state: "removerect", object: c, data: getJson()});

                        myflow.config.tools.deleteRect(c.getId(), c.toJson());
                        $(_r).trigger('removerect', c);

                        /*清除自定义轨迹*/
                        myflow.config.moving.temp.map(function (item, index) {
                            item.remove();
                        })
                        myflow.config.moving = {
                            flag: false,
                            prepdot: {x: 0, y: 0},
                            dots: [],
                            isNewDot: false,
                            preRect: null,
                            temp: []
                        };

                    } else if (c.getId().substring(0, 4) == 'path') {
                        //添加到历史记录
                        myflow.config.historys.push({state: "removepath", object: c, data: getJson()});

                        myflow.config.tools.deletePath(c.getId());
                        $(_r).trigger('removepath', c);
                    }
                    $("#pointer").trigger('click');
                    $('svg').trigger('click');
                    $(_r).removeData('currNode');
                }
            });
            // $('#myflow_revoke').click(function () {//撤销
            //     $('svg').trigger('click');
            //     setTimeout(function() {
            //         var temp = myflow.config.historys.pop();
            //         if (temp) {
            //             switch (temp.state) {
            //                 case "addpath":
            //                     $(_r).trigger('removepath', temp.object);
            //                     break;
            //                 case "addrect":
            //                     $(_r).trigger('removerect', temp.object);
            //                     break;
            //                 case "removepath":
            //                     restore(eval("(" + temp.data + ")"));
            //                     break;
            //                 case "removerect":
            //                     restore(eval("(" + temp.data + ")"));
            //                     break;
            //             }
            //         } else {
            //             alert("没有东西可以撤销！");
            //         }
            //     }, 200);
            // });
            //
            // $("#myflow_redraw").click(function () { //重绘
            //     if (_states) {
            //         for (var k in _states) {
            //             _states[k].remove();
            //         }
            //     }
            //     if (_paths) {
            //         for (var k in _paths) {
            //             _paths[k].remove();
            //         }
            //     }
            //     _states = {};
            //     _paths = {};
            //     myflow.config.moving.temp.map(function (item, index) {
            //         item.remove();
            //     })
            //     myflow.config.moving = {
            //         flag: false,
            //         prepdot: {x: 0, y: 0},
            //         dots: [],
            //         isNewDot: false,
            //         preRect: null,
            //         temp: []
            //     };
            // });
            $('#path').click(function () {
                $('#myflow').find('svg').trigger('click');
            })
            $("#pointer").click(function () { //重绘
                myflow.config.moving.temp.map(function (item, index) {
                    item.remove();
                })
                myflow.config.moving = {
                    flag: false,
                    prepdot: {x: 0, y: 0},
                    dots: [],
                    isNewDot: false,
                    preRect: null,
                    temp: []
                };
            })

            // 属性框
            new myflow.props({}, _r);
        }
        // 恢复
        if (o.restore) {
            restore(o.restore);
        }

        function restore(data) {
            var rmap = {};
            if (data.states) {
                for (var k in data.states) {
                    if (!_states[k]) {
                        var rect = new myflow.rect(
                            $
                                .extend(
                                    true,
                                    {},
                                    myflow.config.tools.states[data.states[k].type],
                                    data.states[k]), _r, k);
                        rect.restore(data.states[k]);
                        rmap[k] = rect;
                        _states[rect.getId()] = rect;
                    }
                }
            }
            if (data.paths) {
                for (var k in data.paths) {
                    if (!_paths[k]) {
                        var from = rmap && rmap[data.paths[k].from] || _states[data.paths[k].from];
                        var to = rmap && rmap[data.paths[k].to] || _states[data.paths[k].to];


                        var p = new myflow.path($.extend(true, {}, myflow.config.tools.path, data.paths[k]), _r, from, to, null, null, null, k);
                        p.restore(data.paths[k]);
                        _paths[p.getId()] = p;
                    }
                }
            }
        }


        // 历史状态
        var hr = myflow.config.historyRects, ar = myflow.config.activeRects;
        if (hr.rects.length || ar.rects.length) {
            var pmap = {}, rmap = {};
            for (var pid in _paths) {// 先组织MAP
                if (!rmap[_paths[pid].from().text()]) {
                    rmap[_paths[pid].from().text()] = {
                        rect: _paths[pid].from(),
                        paths: {}
                    };
                }
                rmap[_paths[pid].from().text()].paths[_paths[pid].text()] = _paths[pid];
                if (!rmap[_paths[pid].to().text()]) {
                    rmap[_paths[pid].to().text()] = {
                        rect: _paths[pid].to(),
                        paths: {}
                    };
                }
            }
            for (var i = 0; i < hr.rects.length; i++) {
                if (rmap[hr.rects[i].name]) {
                    rmap[hr.rects[i].name].rect.attr(hr.rectAttr);
                }
                for (var j = 0; j < hr.rects[i].paths.length; j++) {
                    if (rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]) {
                        rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]
                            .attr(hr.pathAttr);
                    }
                }
            }
            for (var i = 0; i < ar.rects.length; i++) {
                if (rmap[ar.rects[i].name]) {
                    rmap[ar.rects[i].name].rect.attr(ar.rectAttr);
                }
                for (var j = 0; j < ar.rects[i].paths.length; j++) {
                    if (rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]) {
                        rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]
                            .attr(ar.pathAttr);
                    }
                }
            }
        }
    }

    // 添加jquery方法
    $.fn.myflow = function (o) {
        return this.each(function () {
            myflow.init(this, o);
        });
    };

    $.myflow = myflow;
};

