var Aparesse = {
		init: function(){
			this.canvas = document.getElementById('aparesse');
			this.context = this.canvas.getContext('2d');
			this.focallength = 250;
			this.dots = this.getimgData('Frank Dai');
			this.pause = false;
			this.lastTime;
        	this.derection = true;
			this.initAnimate();
		},

		initAnimate : function () {
			var _self = this;
            this.dots.forEach(function () {
                this.x = Math.random() * _self.canvas.width;
                this.y = Math.random() * _self.canvas.height;
                this.z = Math.random() * _self.focallength * 2 - _self.focallength;

                this.tx = Math.random() * _self.canvas.width;
                this.ty = Math.random() * _self.canvas.height;
                this.tz = Math.random() * _self.focallength * 2 - _self.focallength;
                this.paint();
            });
            this.animate();
        },

		getimgData: function (text) {
			this.drawText(text);
			var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			var dots = [];
			for (var x = 0; x < imgData.width; x += 5) {
				for (var y = 0; y < imgData.height; y += 5) {
					var i = (y * imgData.width + x) * 4;
					if (imgData.data[i] >= 128) {
						var dot = new Dot(x - 3, y - 3, 0, 3);
						dots.push(dot);
					}
				}
			}
			return dots;
		},

		drawText: function (text) {
			this.context.save();
			this.context.font = "200px 微软雅黑 bold";
			this.context.fillStyle = "rgba(168,168,168,1)";
			this.context.textAlign = "center";
			this.context.textBaseline = "middle";
			this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
			this.context.restore();
		},

		//计算帧速率
        animate: function () {
			var _self = Aparesse;
            _self.animateRunning = true;
            var thisTime = +new Date();
            _self.context.clearRect(0, 0, _self.canvas.width, _self.canvas.height);
            _self.dots.forEach(function () {
                var dot = this;
                if (_self.derection) {
                    if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z) < 0.1) {
                        dot.x = dot.dx;
                        dot.y = dot.dy;
                        dot.z = dot.dz;
                        if (thisTime - _self.lastTime > 300) _self.derection = false;
                    } else {
                        dot.x = dot.x + (dot.dx - dot.x) * 0.1;
                        dot.y = dot.y + (dot.dy - dot.y) * 0.1;
                        dot.z = dot.z + (dot.dz - dot.z) * 0.1;
                        _self.lastTime = +new Date()
                    }
                }
                // else {
                //     if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z) < 0.1) {
                //         dot.x = dot.tx;
                //         dot.y = dot.ty;
                //         dot.z = dot.tz;
                //         _self.pause = true;
                //     } else {
                //         dot.x = dot.x + (dot.tx - dot.x) * 0.1;
                //         dot.y = dot.y + (dot.ty - dot.y) * 0.1;
                //         dot.z = dot.z + (dot.tz - dot.z) * 0.1;
                //         _self.pause = false;
                //     }
                // }
                dot.paint();
            });
            if (!_self.pause) {
                if ("requestAnimationFrame" in window) {
                    window.requestAnimationFrame(Aparesse.animate); 
                }
                else if ("webkitRequestAnimationFrame" in window) {
                    window.webkitRequestAnimationFrame(Aparesse.animate); 
                }
                else if ("msRequestAnimationFrame" in window) {
                    window.msRequestAnimationFrame(Aparesse.animate); 
                }
                else if ("mozRequestAnimationFrame" in window) {
                    window.mozRequestAnimationFrame(Aparesse.animate); 
                }
            }
        },

		forEach: function (callback) {
			for (var i = 0; i < this.length; i++) {
				callback.call(this[i]);
			}
		}
	}

	Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i]);
        }
    }
    
	function Dot(centerX, centerY, centerZ, radius) {
        this.dx = centerX;
        this.dy = centerY;
        this.dz = centerZ;
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;
        this.z = centerZ;
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
    }

    Dot.prototype = {
        paint: function () {
            Aparesse.context.save();
            Aparesse.context.beginPath();
            var scale = Aparesse.focallength / (Aparesse.focallength + this.z);
            Aparesse.context.arc(Aparesse.canvas.width / 2 + (this.x - Aparesse.canvas.width / 2) * scale, Aparesse.canvas.height / 2 + (this.y - Aparesse.canvas.height / 2) * scale, this.radius * scale, 0, 2 * Math.PI);
            Aparesse.context.fillStyle = "rgba(50,50,50," + scale + ")";
            Aparesse.context.fill();
            Aparesse.context.restore();
        }
    }

	window.onload = function () {

		Aparesse.init();
        
    }