(function () { "use strict";
var HxOverrides = function() { }
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
var edit = {}
edit.Editor = function() {
	this.gutterWidth = 30;
	this.content = "";
	this.fontSize = 14;
	this.caret1 = this.caret2 = 0;
	this.scale = js.Browser.window.devicePixelRatio;
	var invScale = 1 / this.scale;
	this.fontCanvas = js.Browser.document.createElement("canvas");
	this.fontCanvas.style.webkitTransformOrigin = "top left";
	this.fontCanvas.style.webkitTransform = "scale(" + invScale + "," + invScale + ")";
	this.generateFont();
	this.canvas = js.Browser.document.createElement("canvas");
	js.Browser.document.body.appendChild(this.canvas);
	this.canvas.style.webkitTransformOrigin = "top left";
	this.canvas.style.webkitTransform = "scale(" + invScale + "," + invScale + ")";
	this.canvas.width = js.Browser.window.innerWidth * this.scale | 0;
	this.canvas.height = js.Browser.window.innerHeight * this.scale | 0;
	var body = js.Browser.document.body;
	body.addEventListener("keypress",$bind(this,this.keyPress));
	body.addEventListener("keydown",$bind(this,this.keyDown));
	body.addEventListener("keyup",$bind(this,this.keyUp));
	body.addEventListener("mousedown",$bind(this,this.mouseDown));
	body.addEventListener("mouseup",$bind(this,this.mouseUp));
	js.Browser.document.addEventListener("paste",$bind(this,this.paste));
	js.Browser.document.addEventListener("copy",$bind(this,this.copy));
	js.Browser.document.addEventListener("cut",$bind(this,this.cut));
	this.content = edit.Editor.lorem;
	this.render();
};
edit.Editor.main = function() {
	new edit.Editor();
}
edit.Editor.prototype = {
	generateFont: function() {
		var context = this.fontCanvas.getContext("2d");
		context.font = "" + this.fontSize + "px Consolas";
		var nativeWidth = Math.ceil(context.measureText("X").width) + 1;
		this.charWidth = Math.ceil(nativeWidth * this.scale);
		this.charHeight = Math.ceil(this.fontSize * this.scale * 1.2);
		var totalWidth = 127 * this.charWidth;
		this.fontCanvas.width = totalWidth;
		this.fontCanvas.height = this.charHeight;
		context.scale(this.scale,this.scale);
		context.clearRect(0,0,totalWidth,this.charHeight);
		context.fillStyle = "white";
		context.textBaseline = "top";
		context.font = "" + this.fontSize + "px monospace";
		var _g = 0;
		while(_g < 127) {
			var i = _g++;
			context.fillText(String.fromCharCode(i),i * nativeWidth,0);
		}
	}
	,render: function() {
		var context = this.canvas.getContext("2d");
		context.clearRect(0,0,this.canvas.width,this.canvas.height);
		var region = new edit.Region(this.caret1,this.caret2);
		var x = 0;
		var y = 0;
		var _g1 = 0, _g = this.content.length + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var code = HxOverrides.cca(this.content,i);
			var w = 1;
			if(code == 9) w = Math.floor(x / 4) * 4 + 4 - x;
			if(!region.isEmpty() && i >= region.begin && i < region.end) {
				context.fillStyle = "orange";
				context.fillRect(this.gutterWidth + x * this.charWidth,y * this.charHeight,this.charWidth * w,this.charHeight);
			}
			if(code != 10 && code != 9) context.drawImage(this.fontCanvas,code * this.charWidth,0,this.charWidth,this.charHeight,this.gutterWidth + x * this.charWidth,y * this.charHeight,this.charWidth,this.charHeight);
			if(i == this.caret1) {
				context.fillStyle = "white";
				context.fillRect(this.gutterWidth + x * this.charWidth,y * this.charHeight,2,this.charHeight);
			}
			if(code == 10) {
				x = 0;
				y++;
			} else x += w;
		}
	}
	,mouseUp: function(e) {
		js.Browser.document.body.removeEventListener("mousemove",$bind(this,this.mouseMove));
	}
	,mouseMove: function(e) {
		this.caret1 = this.layoutToText(e.clientX,e.clientY);
		this.render();
	}
	,mouseDown: function(e) {
		this.caret1 = this.caret2 = this.layoutToText(e.clientX,e.clientY);
		this.render();
		js.Browser.document.body.addEventListener("mousemove",$bind(this,this.mouseMove));
	}
	,getLine: function(index) {
		return this.content.split("\n")[index];
	}
	,layoutToText: function(x,y) {
		x -= this.gutterWidth * (1 / this.scale);
		console.log(x);
		var row = Math.floor(y * this.scale / this.charHeight);
		var col = x * this.scale / this.charWidth;
		var line = this.getLine(row);
		var charCol = 0;
		var charX = 0;
		var _g1 = 0, _g = line.length;
		while(_g1 < _g) {
			var i = _g1++;
			var code = HxOverrides.cca(line,i);
			var w = 1;
			if(code == 9) w = Math.floor(charX / 4) * 4 + 4 - charX;
			if(charX + w / 2 >= col) break;
			charCol += 1;
			charX += w;
		}
		return this.getIndex(charCol,row);
	}
	,keyUp: function(e) {
		switch(e.keyCode) {
		case 16:
			this.shift = false;
			break;
		case 17:
			this.ctrl = false;
			break;
		case 18:
			this.alt = false;
			break;
		case 91:
			this.cmd = false;
			break;
		default:
		}
	}
	,wordBoundary: function(index,delta) {
		var wordChars = " \n./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?";
		index += delta;
		if(delta == -1) index += delta;
		while(index > -1 && index < this.content.length - 1) {
			if(wordChars.indexOf(this.content.charAt(index)) > -1) break;
			index += delta;
		}
		if(delta == -1) index += 1;
		return index;
	}
	,keyDown: function(e) {
		var region = new edit.Region(this.caret1,this.caret2);
		console.log(e.keyCode);
		switch(e.keyCode) {
		case 16:
			this.shift = true;
			break;
		case 17:
			this.ctrl = true;
			break;
		case 18:
			this.alt = true;
			break;
		case 91:
			this.cmd = true;
			break;
		case 35:
			this.setCaret(this.content.length);
			break;
		case 36:
			this.setCaret(0);
			break;
		case 190:
			this.inputChar(190);
			break;
		case 9:case 8:case 46:
			e.preventDefault();
			this.inputChar(e.keyCode);
			break;
		case 37:case 39:
			var delta = e.keyCode == 37?-1:1;
			if(this.alt) this.caret1 = this.wordBoundary(this.caret1,delta); else if(region.isEmpty() || this.shift) this.caret1 = this.caret1 + delta; else this.caret1 = delta > 0?region.end:region.begin;
			if(this.caret1 < 0) this.caret1 = 0; else if(this.caret1 > this.content.length) this.caret1 = this.content.length;
			if(!this.shift) this.caret2 = this.caret1;
			this.render();
			break;
		case 38:case 40:
			if(this.cmd) {
				this.setCaret(e.keyCode == 38?0:this.content.length);
				return;
			}
			var delta = e.keyCode == 38?-1:1;
			if(region.isEmpty() || this.shift) {
				var pos = this.getPosition(this.caret1);
				this.caret1 = this.getIndex(pos.col,pos.row + delta);
			} else {
				var pos = this.getPosition(delta > 0?region.end:region.begin);
				this.caret1 = this.getIndex(pos.col,pos.row + delta);
			}
			if(!this.shift) this.caret2 = this.caret1;
			this.render();
			break;
		default:
		}
	}
	,keyPress: function(e) {
		var code = e.keyCode;
		if(code == 46) return;
		if(code == 13) code = 10;
		this.inputChar(code);
	}
	,setCaret: function(index) {
		if(index < 0) index = 0; else if(index > this.content.length) index = this.content.length;
		this.caret1 = index;
		if(!this.shift) this.caret2 = this.caret1;
		this.render();
	}
	,getIndex: function(col,row) {
		if(row < 0) return 0;
		var index = 0;
		var lines = this.content.split("\n");
		if(row > lines.length - 1) return this.content.length;
		var _g1 = 0, _g = lines.length;
		while(_g1 < _g) {
			var i = _g1++;
			var line = lines[i];
			if(i == row) {
				if(col > line.length) col = line.length;
				if(col < 0) col = 0;
				return index + col;
			} else index += line.length + 1;
		}
		return index;
	}
	,getPosition: function(index) {
		var lines = this.content.split("\n");
		var _g1 = 0, _g = lines.length;
		while(_g1 < _g) {
			var i = _g1++;
			index -= lines[i].length + 1;
			if(index < 0) return { col : lines[i].length + index + 1, row : i};
		}
		return null;
	}
	,inputChar: function(code) {
		var $char = String.fromCharCode(code == 190?46:code);
		var region = new edit.Region(this.caret1,this.caret2);
		console.log(code);
		switch(code) {
		case 8:case 46:
			$char = "";
			if(region.isEmpty()) {
				if(code == 8) {
					if(this.caret1 == 0) return;
					this.caret1--;
					region = new edit.Region(this.caret1,this.caret2);
				} else region = new edit.Region(this.caret1,this.caret2 + 1);
			} else this.caret1 = region.begin;
			break;
		default:
			this.caret1 = region.begin + 1;
		}
		this.content = HxOverrides.substr(this.content,0,region.begin) + $char + HxOverrides.substr(this.content,region.end,null);
		this.caret2 = this.caret1;
		this.render();
	}
	,insertText: function(text) {
		var region = new edit.Region(this.caret1,this.caret2);
		this.content = HxOverrides.substr(this.content,0,region.begin) + text + HxOverrides.substr(this.content,region.end,null);
		this.caret1 = this.caret2 = region.begin + text.length;
		this.render();
	}
	,paste: function(e) {
		this.insertText(e.clipboardData.getData("text/plain"));
	}
	,copy: function(e) {
		var region = new edit.Region(this.caret1,this.caret2);
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.content.substring(region.begin,region.end));
	}
	,cut: function(e) {
		var region = new edit.Region(this.caret1,this.caret2);
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.content.substring(region.begin,region.end));
		this.insertText("");
	}
}
edit.Region = function(a,b) {
	this.begin = a < b?a:b;
	this.end = a > b?a:b;
	this.size = this.end - this.begin;
};
edit.Region.prototype = {
	cover: function(region) {
		var a = this.begin < region.begin?this.begin:region.begin;
		var b = this.end > region.end?this.end:region.end;
		return new edit.Region(a,b);
	}
	,containsRegion: function(region) {
		return this.begin <= region.begin && region.end <= this.end;
	}
	,containsPoint: function(point) {
		return this.begin <= point && point <= this.end;
	}
	,intersection: function(region) {
		if(this.intersects(region)) {
			var a = this.begin > region.begin?this.begin:region.begin;
			var b = this.end > region.end?this.end:region.end;
			return new edit.Region(a,b);
		}
		return new edit.Region(0,0);
	}
	,intersects: function(region) {
		return region.begin >= this.begin && region.begin < this.end || region.end > this.begin && region.end <= this.end;
	}
	,isEmpty: function() {
		return this.size == 0;
	}
}
var js = {}
js.Browser = function() { }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
edit.Editor.lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed purus tempus, \nfacilisis dui id, egestas magna.\n\nCurabitur sagittis, libero quis adipiscing consectetur, odio risus mattis \ntristique ante nec faucibus dictum. Nulla sapien lectus, pellentesque et mattis \na, rutrum quis massa. Ut eget nulla neque. Donec vitae mi mauris. Fusce dolor \nfelis, viverra eget dolor at, luctus dignissim nisl. Etiam eu libero \nscelerisque metus volutpat pulvinar accumsan nec neque.\n\nVestibulum ante ipsum primis in faucibus orci luctus.\n\nSuspendisse euismod posuere mi, ac pretium eros. In in metus pulvinar, \nelementum nibh eget, congue massa. Vestibulum eros elit, pellentesque at massa \nsed, rhoncus laoreet purus. Proin interdum mauris sed enim posuere \npellentesque. Maecenas facilisis blandit hendrerit. Pellentesque ut velit \neleifend, commodo nisl vitae, vehicula orci. Suspendisse pellentesque auctor \norci in pretium.\n\nVestibulum accumsan malesuada ante, ut suscipit neque rhoncus vitae. Nunc \nsagittis tincidunt ligula, sit amet ultricies nibh eleifend vitae. Nullam vel \nbibendum ipsum. Vestibulum in nisl bibendum, ultricies augue a, ullamcorper \nsem. Mauris euismod urna eros, a placerat leo tincidunt sed. Vestibulum luctus \nmetus ut vestibulum congue. Sed rutrum aliquet metus, at gravida nunc volutpat \nmattis. Praesent congue nisl quis augue euismod, quis dignissim diam mattis. \nMorbi malesuada blandit nulla sit amet ultrices. Pellentesque vitae ornare dui, \nvel euismod velit. Ut quam erat, congue id tellus vel, pharetra laoreet tortor. \nProin feugiat, enim et pulvinar ornare, lorem erat consequat urna, vel \nsollicitudin libero erat vitae tellus.";
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
edit.Editor.main();
})();
