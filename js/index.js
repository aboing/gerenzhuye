$(function () {
    $(".container").fullpage({
        verticalCentered: true,
        // fixedElements:".top",
        // sectionsColor: ["#1d4fdd", "blue", "yellow", "green"],
        anchors: ["p1", "p2", "p3", "p4"],
        // navigation:true,
        // slidesNavigation:true,
        navigationTooltips: ["自我介绍", "技能介绍", "项目介绍", "联系方式"],
        // continuousVertical:false,
        // resize:true,
        menu: '#menu',
        afterLoad: function (anchorLink, index) {
            if (index !== index) {
                $.fn.fullpage.setAllowScrolling(true, 'up');
            } else {
                $.fn.fullpage.setAllowScrolling(false, 'up');
            }
        }
    })
})

//第二屏  进度条

let canvas1 = document.querySelector(".bj2container .box1");
let canvas2 = document.querySelector(".bj2container .box2");
let canvas3 = document.querySelector(".bj2container .box3");
function circle(canvas, max, color) {
    let cobj = canvas.getContext("2d");
    cobj.lineWidth = 20;
    cobj.strokeStyle = color;
    cobj.textAlign = "center";
    cobj.textBaseline = "middle";
    cobj.font = "20px 微软雅黑";
    let num = 0;

    function progress() {
        num++;
        cobj.save();
        cobj.translate(100, 100);
        cobj.clearRect(-100, -100, 200, 200);
        cobj.save();
        let angle = num * Math.PI / 50;
        cobj.rotate(-Math.PI / 2);
        cobj.beginPath();
        cobj.arc(0, 0, 70, 0, angle);
        cobj.lineCap = "round";
        cobj.stroke();
        cobj.restore();
        cobj.fillText(num + "%", 0, 0);
        if (num < max) {
            requestAnimationFrame(progress);
        }
        cobj.restore();
    }

    progress();
};
let bj2 = document.querySelector(".bj2container");
let flag = true;
$("#menu li:nth-child(2)").click(function () {
    circle(canvas1, 80, "#6DFF12");
    circle(canvas2, 70, "#FF6E4A");
    circle(canvas3, 90, "#0035FF");
});

$("#menu li:nth-child(3)").click(function () {
    $(".top").addClass("show")
    $(".bottom").addClass("show")
});
// window.onscroll = function () {
//     console.log(bj2.offsetTop);
//     let st = document.body.scrollTop === 0 ? document.documentElement : document.body;
//     let stt = st.scrollTop;
//     if (stt > bj2.offsetTop /*- window.innerHeight*/ && flag) {
//         flag = false;
//         circle(canvas1, 80, "red");
//         circle(canvas2, 70, "green");
//         circle(canvas3, 90, "blue");
//     }
//     if (stt < bj2.offsetTop/*-window.innerHeight*/) {
//         flag=true;
//     }
// };
//第三屏背景图片
var Library = {};
Library.ease = function () {
    this.target = 0;
    this.position = 0;
    this.move = function (target, speed) {
        this.position += (target - this.position) * speed;
    }
}
var tv = {
    /* ==== variables ==== */
    O: [],
    screen: {},
    grid: {
        size: 4,  // 4x4 grid
        borderSize: 6,  // borders size
        zoomed: false
    },
    angle: {
        x: new Library.ease(),
        y: new Library.ease()
    },
    camera: {
        x: new Library.ease(),
        y: new Library.ease(),
        zoom: new Library.ease(),
        focalLength: 750 // camera Focal Length
    },

    /* ==== init script ==== */
    init: function () {
        this.screen.obj = document.getElementById('screen');
        var img = document.getElementById('bankImages').getElementsByTagName('img');
        this.screen.obj.onselectstart = function () {
            return false;
        }
        this.screen.obj.ondrag = function () {
            return false;
        }
        /* ==== create images grid ==== */
        var ni = 0;
        var n = (tv.grid.size / 2) - .5;
        for (var y = -n; y <= n; y++) {
            for (var x = -n; x <= n; x++) {
                /* ==== create HTML image element ==== */
                var o = document.createElement('img');
                var i = img[(ni++) % img.length];
                o.className = 'tvout';
                o.src = i.src;
                tv.screen.obj.appendChild(o);
                /* ==== 3D coordinates ==== */
                o.point3D = {
                    x: x,
                    y: y,
                    z: new Library.ease()
                };
                /* ==== push object ==== */
                o.point2D = {};
                o.ratioImage = 1;
                tv.O.push(o);
                /* ==== on mouse over event ==== */
                o.onmouseover = function () {
                    if (!tv.grid.zoomed) {
                        if (tv.o) {
                            /* ==== mouse out ==== */
                            tv.o.point3D.z.target = 0;
                            tv.o.className = 'tvout';
                        }
                        /* ==== mouse over ==== */
                        this.className = 'tvover';
                        this.point3D.z.target = -.5;
                        tv.o = this;
                    }
                }
                /* ==== on click event ==== */
                o.onclick = function () {
                    if (!tv.grid.zoomed) {
                        /* ==== zoom in ==== */
                        tv.camera.x.target = this.point3D.x;
                        tv.camera.y.target = this.point3D.y;
                        tv.camera.zoom.target = tv.screen.w * 1.25;
                        tv.grid.zoomed = this;
                    } else {
                        if (this == tv.grid.zoomed) {
                            /* ==== zoom out ==== */
                            tv.camera.x.target = 0;
                            tv.camera.y.target = 0;
                            tv.camera.zoom.target = tv.screen.w / (tv.grid.size + .1);
                            tv.grid.zoomed = false;
                        }
                    }
                }
                /* ==== 3D transform function ==== */
                o.calc = function () {
                    /* ==== ease mouseover ==== */
                    this.point3D.z.move(this.point3D.z.target, .5);
                    /* ==== assign 3D coords ==== */
                    var x = (this.point3D.x - tv.camera.x.position) * tv.camera.zoom.position;
                    var y = (this.point3D.y - tv.camera.y.position) * tv.camera.zoom.position;
                    var z = this.point3D.z.position * tv.camera.zoom.position;
                    /* ==== perform rotations ==== */
                    var xy = tv.angle.cx * y - tv.angle.sx * z;
                    var xz = tv.angle.sx * y + tv.angle.cx * z;
                    var yz = tv.angle.cy * xz - tv.angle.sy * x;
                    var yx = tv.angle.sy * xz + tv.angle.cy * x;
                    /* ==== 2D transformation ==== */
                    this.point2D.scale = tv.camera.focalLength / (tv.camera.focalLength + yz);
                    this.point2D.x = yx * this.point2D.scale;
                    this.point2D.y = xy * this.point2D.scale;
                    this.point2D.w = Math.round(
                        Math.max(
                            0,
                            this.point2D.scale * tv.camera.zoom.position * .8
                        )
                    );
                    /* ==== image size ratio ==== */
                    if (this.ratioImage > 1)
                        this.point2D.h = Math.round(this.point2D.w / this.ratioImage);
                    else {
                        this.point2D.h = this.point2D.w;
                        this.point2D.w = Math.round(this.point2D.h * this.ratioImage);
                    }
                }
                /* ==== rendering ==== */
                o.draw = function () {
                    if (this.complete) {
                        /* ==== paranoid image load ==== */
                        if (!this.loaded) {
                            if (!this.img) {
                                /* ==== create internal image ==== */
                                this.img = new Image();
                                this.img.src = this.src;
                            }
                            if (this.img.complete) {
                                /* ==== get width / height ratio ==== */
                                this.style.visibility = 'visible';
                                this.ratioImage = this.img.width / this.img.height;
                                this.loaded = true;
                                this.img = false;
                            }
                        }
                        /* ==== HTML rendering ==== */
                        this.style.left = Math.round(
                                this.point2D.x * this.point2D.scale +
                                tv.screen.w - this.point2D.w * .5
                            ) + 'px';
                        this.style.top = Math.round(
                                this.point2D.y * this.point2D.scale +
                                tv.screen.h - this.point2D.h * .5
                            ) + 'px';
                        this.style.width = this.point2D.w + 'px';
                        this.style.height = this.point2D.h + 'px';
                        this.style.borderWidth = Math.round(
                                Math.max(
                                    this.point2D.w,
                                    this.point2D.h
                                ) * tv.grid.borderSize * .01
                            ) + 'px';
                        this.style.zIndex = Math.floor(this.point2D.scale * 100);
                    }
                }
            }
        }
        /* ==== start script ==== */
        tv.resize();
        mouse.y = tv.screen.y + tv.screen.h;
        mouse.x = tv.screen.x + tv.screen.w;
        tv.run();
    },

    /* ==== resize window ==== */
    resize: function () {
        var o = tv.screen.obj;
        tv.screen.w = o.offsetWidth / 2;
        tv.screen.h = o.offsetHeight / 2;
        tv.camera.zoom.target = tv.screen.w / (tv.grid.size + .1);
        for (tv.screen.x = 0, tv.screen.y = 0; o != null; o = o.offsetParent) {
            tv.screen.x += o.offsetLeft;
            tv.screen.y += o.offsetTop;
        }
    },

    /* ==== main loop ==== */
    run: function () {
        /* ==== motion ease ==== */
        tv.angle.x.move(-(mouse.y - tv.screen.h - tv.screen.y) * .0025, .1);
        tv.angle.y.move((mouse.x - tv.screen.w - tv.screen.x) * .0025, .1);
        tv.camera.x.move(tv.camera.x.target, tv.grid.zoomed ? .25 : .025);
        tv.camera.y.move(tv.camera.y.target, tv.grid.zoomed ? .25 : .025);
        tv.camera.zoom.move(tv.camera.zoom.target, .05);
        /* ==== angles sin and cos ==== */
        tv.angle.cx = Math.cos(tv.angle.x.position);
        tv.angle.sx = Math.sin(tv.angle.x.position);
        tv.angle.cy = Math.cos(tv.angle.y.position);
        tv.angle.sy = Math.sin(tv.angle.y.position);
        /* ==== loop through all images ==== */
        for (var i = 0, o; o = tv.O[i]; i++) {
            o.calc();
            o.draw();
        }
        /* ==== loop ==== */
        setTimeout(tv.run, 32);
    }
}

/* ==== global mouse position ==== */
var mouse = {
    x: 0,
    y: 0
}
document.onmousemove = function (e) {
    if (window.event) e = window.event;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    return false;
}

