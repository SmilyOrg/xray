(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
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
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = true;
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
var edit = {}
edit.Buffer = function(content) {
	this.content = content;
	this.flags = haxe.io.Bytes.alloc(content.length);
};
$hxClasses["edit.Buffer"] = edit.Buffer;
edit.Buffer.__name__ = true;
edit.Buffer.prototype = {
	hasFlagAt: function(index,flag) {
		var enumFlags = this.flags.b[index];
		return (enumFlags & 1 << flag[1]) != 0;
	}
	,clearFlag: function(region,flag) {
		var _g1 = region.begin(), _g = region.end();
		while(_g1 < _g) {
			var i = _g1++;
			var enumFlags = this.flags.b[i];
			enumFlags &= 268435455 - (1 << flag[1]);
			this.flags.b[i] = enumFlags & 255;
		}
	}
	,setFlagAt: function(index,flag) {
		var enumFlags = this.flags.b[index];
		enumFlags |= 1 << flag[1];
		this.flags.b[index] = enumFlags & 255;
	}
	,setFlag: function(region,flag) {
		var _g1 = region.begin(), _g = region.end();
		while(_g1 < _g) {
			var i = _g1++;
			this.setFlagAt(i,flag);
		}
	}
	,replace: function(region,text) {
		this.insert(region.begin(),region.size(),text);
	}
	,insert: function(index,length,string) {
		this.content = HxOverrides.substr(this.content,0,index) + string + HxOverrides.substr(this.content,index + length,null);
		var previous = this.flags;
		this.flags = haxe.io.Bytes.alloc(this.content.length);
		this.flags.blit(0,previous,0,index);
		var pos = index + length;
		this.flags.blit(0,previous,pos,previous.length - pos);
	}
	,clearFlags: function() {
		this.flags = haxe.io.Bytes.alloc(this.content.length);
	}
	,__class__: edit.Buffer
}
edit.BufferFlag = { __ename__ : true, __constructs__ : ["Selected","Caret"] }
edit.BufferFlag.Selected = ["Selected",0];
edit.BufferFlag.Selected.toString = $estr;
edit.BufferFlag.Selected.__enum__ = edit.BufferFlag;
edit.BufferFlag.Caret = ["Caret",1];
edit.BufferFlag.Caret.toString = $estr;
edit.BufferFlag.Caret.__enum__ = edit.BufferFlag;
edit.Edit = function(view) {
	this.view = view;
	this.operations = [];
};
$hxClasses["edit.Edit"] = edit.Edit;
edit.Edit.__name__ = true;
edit.Edit.prototype = {
	redo: function() {
		var len = this.operations.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var operation = this.operations[i];
			switch(operation[1]) {
			case 0:
				var string = operation[3], region = operation[2];
				this.view.erase(null,region);
				break;
			case 1:
				var string = operation[3], region = operation[2];
				this.view.insert(null,region.begin(),string);
				break;
			}
		}
	}
	,undo: function() {
		var len = this.operations.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var operation = this.operations[len - (i + 1)];
			switch(operation[1]) {
			case 0:
				var string = operation[3], region = operation[2];
				this.view.insert(null,region.begin(),string);
				break;
			case 1:
				var string = operation[3], region = operation[2];
				this.view.erase(null,region);
				break;
			}
		}
	}
	,erase: function(region) {
		this.operations.push(edit.EditOperation.Erase(region,this.view.buffer.content.substring(region.begin(),region.end())));
	}
	,insert: function(point,string) {
		this.operations.push(edit.EditOperation.Insert(new edit.Region(point,point + string.length),string));
	}
	,__class__: edit.Edit
}
edit.EditOperation = { __ename__ : true, __constructs__ : ["Erase","Insert"] }
edit.EditOperation.Erase = function(region,string) { var $x = ["Erase",0,region,string]; $x.__enum__ = edit.EditOperation; $x.toString = $estr; return $x; }
edit.EditOperation.Insert = function(region,string) { var $x = ["Insert",1,region,string]; $x.__enum__ = edit.EditOperation; $x.toString = $estr; return $x; }
edit.Editor = function() {
	this.fontSize = 16;
	this.gutterWidth = 30;
	var document = js.Browser.document;
	var window = js.Browser.window;
	var body = document.body;
	this.edit = new edit.Edit(this);
	this.edits = [this.edit];
	this.scrollX = 0;
	this.scrollY = 0;
	this.maxScrollX = 0;
	this.maxScrollY = 0;
	this.scale = window.devicePixelRatio;
	this.generateFont();
	this.selection = new edit.RegionSet();
	this.selection.add(new edit.Region(0,0));
	this.canvas = document.createElement("canvas");
	body.appendChild(this.canvas);
	this.canvas.width = window.innerWidth * this.scale | 0;
	this.canvas.height = window.innerHeight * this.scale | 0;
	var invScale = 1 / this.scale;
	this.canvas.style.webkitTransformOrigin = "top left";
	this.canvas.style.webkitTransform = "scale(" + invScale + "," + invScale + ")";
	this.context = this.canvas.getContext("2d");
	document.addEventListener("paste",$bind(this,this.paste));
	document.addEventListener("copy",$bind(this,this.copy));
	document.addEventListener("cut",$bind(this,this.cut));
	this.setContent("");
	new edit.Input(this);
};
$hxClasses["edit.Editor"] = edit.Editor;
edit.Editor.__name__ = true;
edit.Editor.main = function() {
	new edit.Editor();
}
edit.Editor.prototype = {
	generateFont: function() {
		this.fontCanvas = js.Browser.document.createElement("canvas");
		var context = this.fontCanvas.getContext("2d");
		var size = this.fontSize * this.scale | 0;
		context.font = "" + size + "px Consolas";
		this.charWidth = Math.ceil(context.measureText(".").width);
		this.charHeight = Math.ceil(size);
		var totalWidth = 127 * this.charWidth;
		this.fontCanvas.width = totalWidth;
		this.fontCanvas.height = this.charHeight;
		context.fillStyle = "white";
		context.textBaseline = "top";
		context.font = "" + size + "px Consolas";
		var _g = 0;
		while(_g < 127) {
			var i = _g++;
			context.fillText(String.fromCharCode(i),i * this.charWidth,0);
		}
	}
	,size: function() {
		return this.buffer.content.length;
	}
	,'char': function(index) {
		return this.buffer.content.charAt(index);
	}
	,substr: function(region) {
		return this.buffer.content.substring(region.begin(),region.end());
	}
	,getRegions: function(regions) {
		var text = new StringBuf();
		var $it0 = regions.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			text.b += Std.string(this.buffer.content.substring(region.begin(),region.end()));
		}
		return text.b;
	}
	,render: function() {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		console.log(this.scrollY);
		this.context.save();
		this.context.translate(-this.scrollX,-this.scrollY);
		var selected = new haxe.ds.IntMap();
		var carets = new haxe.ds.IntMap();
		this.buffer.clearFlags();
		var $it0 = this.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.buffer.setFlag(region,edit.BufferFlag.Selected);
			this.buffer.setFlagAt(region.b,edit.BufferFlag.Caret);
		}
		var x = 0;
		var y = 0;
		var _g1 = 0, _g = this.buffer.content.length + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var code = HxOverrides.cca(this.buffer.content,i);
			var w = 1;
			if(code == 9) w = Math.floor(x / 4) * 4 + 4 - x;
			if(this.buffer.hasFlagAt(i,edit.BufferFlag.Selected)) {
				this.context.fillStyle = "orange";
				this.context.fillRect(this.gutterWidth + x * this.charWidth,y * this.charHeight,this.charWidth * w,this.charHeight);
			}
			if(this.buffer.hasFlagAt(i,edit.BufferFlag.Caret)) {
				this.context.fillStyle = "white";
				this.context.fillRect(this.gutterWidth + x * this.charWidth,y * this.charHeight,2,this.charHeight);
			}
			if(code != 10 && code != 9) this.context.drawImage(this.fontCanvas,code * this.charWidth,0,this.charWidth,this.charHeight,this.gutterWidth + x * this.charWidth,y * this.charHeight,this.charWidth,this.charHeight);
			if(code == 10) {
				x = 0;
				y++;
			} else x += w;
		}
		this.maxScrollY = y * this.charHeight - this.canvas.height;
		this.context.restore();
	}
	,scroll: function(x,y) {
		this.scrollX = Math.max(0,Math.min(this.maxScrollX,this.scrollX - x)) | 0;
		this.scrollY = Math.max(0,Math.min(this.maxScrollY,this.scrollY - y)) | 0;
		this.render();
	}
	,getLine: function(index) {
		return this.buffer.content.split("\n")[index];
	}
	,findRight: function(index,chars) {
		var size = this.buffer.content.length;
		while(index <= size) {
			if(chars.indexOf(this.buffer.content.charAt(index)) > -1) break;
			index += 1;
		}
		return index;
	}
	,findLeft: function(index,chars) {
		while(index > 0) {
			if(chars.indexOf(this.buffer.content.charAt(index - 1)) > -1) break;
			index -= 1;
		}
		return index;
	}
	,word: function(index) {
		var wordChars = " \n./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?";
		return new edit.Region(this.findLeft(index,wordChars),this.findRight(index,wordChars));
	}
	,fullLine: function(index) {
		var a = this.findLeft(index,"\n");
		var b = this.findRight(index,"\n") + 1;
		return new edit.Region(a,b);
	}
	,line: function(index) {
		var full = this.fullLine(index);
		if(this.buffer.content.charAt(full.b - 1) == "\n") full.b -= 1;
		return full;
	}
	,layoutToText: function(x,y) {
		x *= this.scale;
		y *= this.scale;
		x -= this.gutterWidth;
		x += this.scrollX;
		y += this.scrollY;
		var row = Math.floor(y / this.charHeight);
		var col = x / this.charWidth;
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
	,getIndex: function(col,row) {
		if(row < 0) return 0;
		var index = 0;
		var lines = this.buffer.content.split("\n");
		if(row > lines.length - 1) return this.buffer.content.length;
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
		var lines = this.buffer.content.split("\n");
		var _g1 = 0, _g = lines.length;
		while(_g1 < _g) {
			var i = _g1++;
			index -= lines[i].length + 1;
			if(index < 0) return { col : lines[i].length + index + 1, row : i};
		}
		return null;
	}
	,paste: function(e) {
		var text = e.clipboardData.getData("text/plain");
		this.runCommand("insert",{ characters : text});
	}
	,copy: function(e) {
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.getRegions(this.selection));
	}
	,cut: function(e) {
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.getRegions(this.selection));
		this.runCommand("insert",{ characters : ""});
	}
	,runCommand: function(name,args) {
		var className = "edit.command.";
		var _g = 0, _g1 = name.split("_");
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			className += part.charAt(0).toUpperCase() + HxOverrides.substr(part,1,null);
		}
		className += "Command";
		var command = Type.resolveClass(className);
		if(command == null) {
			console.log("command not found: " + name);
			return;
		}
		if(args != null) console.log(name + ":" + Std.string(args)); else console.log(name);
		if(args == null) args = { };
		var command1 = Type.createInstance(command,[this]);
		command1.run(args);
	}
	,setContent: function(string) {
		this.buffer = new edit.Buffer(string);
		this.render();
	}
	,replace: function(edit,region,string) {
		this.erase(edit,region);
		this.insert(edit,region.begin(),string);
	}
	,erase: function(edit,region) {
		if(edit != null) edit.erase(region);
		this.buffer.insert(region.begin(),region.size(),"");
	}
	,insert: function(edit,point,string) {
		if(edit != null) edit.insert(point,string);
		this.buffer.insert(point,0,string);
	}
	,endEdit: function(edit) {
		this.edits.push(edit);
	}
	,beginEdit: function(command,args) {
		return new edit.Edit(this);
	}
	,__class__: edit.Editor
}
edit.Input = function(view) {
	this.lastUp = 0.0;
	var _g = this;
	this.view = view;
	this.mappings = [];
	var body = js.Browser.document.body;
	body.addEventListener("keydown",$bind(this,this.keyDown));
	body.addEventListener("keypress",$bind(this,this.keyPress));
	body.addEventListener("mousedown",$bind(this,this.mouseDown));
	body.addEventListener("mouseup",$bind(this,this.mouseUp));
	body.addEventListener("mousewheel",$bind(this,this.mouseWheel));
	body.addEventListener("scroll",$bind(this,this.scroll));
	var platform = js.Browser.window.navigator.platform;
	var os = platform.indexOf("Mac") > -1?"mac":"win";
	var http = new haxe.Http("keymap-" + os + ".json");
	http.onData = function(data) {
		_g.mappings = haxe.Json.parse(data);
		view.setContent(data);
	};
	http.request();
};
$hxClasses["edit.Input"] = edit.Input;
edit.Input.__name__ = true;
edit.Input.prototype = {
	parseKeys: function(keys) {
		var keys1 = keys.split("+");
		var codes = [];
		var _g = 0;
		while(_g < keys1.length) {
			var key = keys1[_g];
			++_g;
			var keyCodes = (function($this) {
				var $r;
				switch(key) {
				case "left":
					$r = [37];
					break;
				case "right":
					$r = [39];
					break;
				case "up":
					$r = [38];
					break;
				case "down":
					$r = [40];
					break;
				case "backspace":
					$r = [8];
					break;
				case "escape":
					$r = [27];
					break;
				case "delete":
					$r = [46];
					break;
				case "shift":
					$r = [16];
					break;
				case "ctrl":
					$r = [17];
					break;
				case "alt":
					$r = [18];
					break;
				case "super":
					$r = [91];
					break;
				case "enter":
					$r = [13];
					break;
				case "end":
					$r = [35];
					break;
				case "home":
					$r = [36];
					break;
				case "-":
					$r = [189];
					break;
				case "=":
					$r = [187];
					break;
				case "tab":
					$r = [9];
					break;
				case "[":
					$r = [219];
					break;
				case "]":
					$r = [221];
					break;
				case "{":
					$r = [16,219];
					break;
				case "}":
					$r = [16,221];
					break;
				case "(":
					$r = [16,57];
					break;
				case ")":
					$r = [16,48];
					break;
				case "'":
					$r = [222];
					break;
				case "\"":
					$r = [16,222];
					break;
				default:
					$r = [HxOverrides.cca(key.toUpperCase(),0)];
				}
				return $r;
			}(this));
			var _g1 = 0;
			while(_g1 < keyCodes.length) {
				var code = keyCodes[_g1];
				++_g1;
				codes.push(code);
			}
		}
		return codes;
	}
	,mouseUp: function(e) {
		var stamp = haxe.Timer.stamp();
		if(stamp - this.lastUp < 0.3) this.clickCount++; else this.clickCount = 1;
		this.lastUp = stamp;
		if(this.clickCount == 2) {
			var word = this.view.word(this.mouseSelection.b);
			this.mouseSelection.a = word.a;
			this.mouseSelection.b = word.b;
			this.view.render();
		} else if(this.clickCount == 3) {
			var word = this.view.fullLine(this.mouseSelection.b);
			this.mouseSelection.a = word.a;
			this.mouseSelection.b = word.b;
			this.view.render();
		}
		this.mouseSelection = null;
		js.Browser.document.body.removeEventListener("mousemove",$bind(this,this.mouseMove));
	}
	,mouseWheel: function(e) {
		e.preventDefault();
		this.view.scroll(e.wheelDeltaX,e.wheelDeltaY);
	}
	,mouseMove: function(e) {
		this.mouseSelection.b = this.view.layoutToText(e.clientX,e.clientY);
		this.view.render();
	}
	,mouseDown: function(e) {
		var index = this.view.layoutToText(e.clientX,e.clientY);
		if(e.shiftKey) {
			this.mouseSelection = this.view.selection.last();
			this.mouseSelection.b = index;
		} else {
			this.view.selection.clear();
			this.mouseSelection = new edit.Region(index,index);
			this.view.selection.add(this.mouseSelection);
		}
		this.view.render();
		js.Browser.document.body.addEventListener("mousemove",$bind(this,this.mouseMove));
	}
	,keyPress: function(e) {
		var code = e.keyCode;
		if(code == 13) code = 10;
		var $char = String.fromCharCode(code == 190?46:code);
		this.view.runCommand("insert",{ characters : $char});
	}
	,keyDown: function(e) {
		var down = [];
		if(e.metaKey) down.push(91);
		if(e.shiftKey) down.push(16);
		if(e.ctrlKey) down.push(17);
		if(e.altKey) down.push(18);
		down.push(e.keyCode);
		var _g = 0, _g1 = this.mappings;
		while(_g < _g1.length) {
			var mapping = _g1[_g];
			++_g;
			var codes = this.parseKeys(mapping.keys[0]);
			if(codes.length != down.length) continue;
			var execute = true;
			var _g2 = 0;
			while(_g2 < codes.length) {
				var code = codes[_g2];
				++_g2;
				if(!Lambda.has(down,code)) {
					execute = false;
					break;
				}
			}
			if(execute && mapping.context != null) {
				var _g2 = 0, _g3 = mapping.context;
				while(_g2 < _g3.length) {
					var context = _g3[_g2];
					++_g2;
					var $it0 = this.view.selection.iterator();
					while( $it0.hasNext() ) {
						var region = $it0.next();
						var value = (function($this) {
							var $r;
							switch(context.key) {
							case "selection_empty":
								$r = region.size() == 0;
								break;
							case "preceding_text":
								$r = $this.view.substr(new edit.Region(0,region.begin()));
								break;
							case "following_text":
								$r = $this.view.substr(new edit.Region(region.end(),$this.view.buffer.content.length));
								break;
							case "text":
								$r = $this.view.buffer.content.substring(region.begin(),region.end());
								break;
							case "num_selections":
								$r = Lambda.count($this.view.selection);
								break;
							default:
								$r = null;
							}
							return $r;
						}(this));
						var result = (function($this) {
							var $r;
							switch(context.operator) {
							case "equal":
								$r = value == context.operand;
								break;
							case "not_equal":
								$r = value != context.operand;
								break;
							case "regex_contains":
								$r = new EReg(context.operand,"").match(value);
								break;
							case "not_regex_contains":
								$r = (function($this) {
									var $r;
									console.log(value);
									$r = !new EReg(context.operand,"").match(value);
									return $r;
								}($this));
								break;
							default:
								$r = true;
							}
							return $r;
						}(this));
						if(!result) execute = false;
						if(!execute) break;
					}
					if(!execute) break;
				}
			}
			if(execute) {
				e.stopPropagation();
				e.preventDefault();
				this.view.runCommand(mapping.command,mapping.args);
				break;
			}
		}
	}
	,scroll: function(e) {
		js.Browser.document.body.scrollTop = 0;
		js.Browser.document.body.scrollLeft = 0;
	}
	,__class__: edit.Input
}
edit.Region = function(a,b) {
	this.a = a;
	this.b = b;
};
$hxClasses["edit.Region"] = edit.Region;
edit.Region.__name__ = true;
edit.Region.prototype = {
	cover: function(region) {
		var a = this.begin() < region.begin()?this.begin():region.begin();
		var b = this.end() > region.end()?this.end():region.end();
		return new edit.Region(a,b);
	}
	,containsRegion: function(region) {
		return this.begin() <= region.begin() && region.end() <= this.end();
	}
	,containsPoint: function(point) {
		return this.begin() <= point && point <= this.end();
	}
	,intersection: function(region) {
		if(this.intersects(region)) {
			var a = this.begin() > region.begin()?this.begin():region.begin();
			var b = this.end() > region.end()?this.end():region.end();
			return new edit.Region(a,b);
		}
		return new edit.Region(0,0);
	}
	,intersects: function(region) {
		return region.begin() >= this.begin() && region.begin() < this.end() || region.end() > this.begin() && region.end() <= this.end();
	}
	,isEmpty: function() {
		return this.size() == 0;
	}
	,size: function() {
		return Math.abs(this.a - this.b) | 0;
	}
	,end: function() {
		return this.a > this.b?this.a:this.b;
	}
	,begin: function() {
		return this.a < this.b?this.a:this.b;
	}
	,__class__: edit.Region
}
edit.RegionSet = function() {
	this.regions = [];
};
$hxClasses["edit.RegionSet"] = edit.RegionSet;
edit.RegionSet.__name__ = true;
edit.RegionSet.prototype = {
	last: function() {
		return this.get(this.regions.length - 1);
	}
	,get: function(index) {
		return this.regions[index];
	}
	,iterator: function() {
		return HxOverrides.iter(this.regions);
	}
	,addAll: function(regions) {
		var _g = 0;
		while(_g < regions.length) {
			var region = regions[_g];
			++_g;
			this.add(region);
		}
	}
	,add: function(region) {
		this.regions.push(region);
	}
	,clear: function() {
		this.regions = [];
	}
	,__class__: edit.RegionSet
}
edit.command = {}
edit.command.TextCommand = function(view) {
	this.view = view;
};
$hxClasses["edit.command.TextCommand"] = edit.command.TextCommand;
edit.command.TextCommand.__name__ = true;
edit.command.TextCommand.prototype = {
	__class__: edit.command.TextCommand
}
edit.command.AddLineInBracesCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.AddLineInBracesCommand"] = edit.command.AddLineInBracesCommand;
edit.command.AddLineInBracesCommand.__name__ = true;
edit.command.AddLineInBracesCommand.__super__ = edit.command.TextCommand;
edit.command.AddLineInBracesCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		this.view.runCommand("insert",{ characters : "\n\t\n"});
		this.view.runCommand("move",{ by : "lines", forward : false});
		this.view.runCommand("move_to",{ to : "eol", extend : false});
		this.view.runCommand("reindent",{ single_line : true});
	}
	,__class__: edit.command.AddLineInBracesCommand
});
edit.command.DecreaseFontSizeCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.DecreaseFontSizeCommand"] = edit.command.DecreaseFontSizeCommand;
edit.command.DecreaseFontSizeCommand.__name__ = true;
edit.command.DecreaseFontSizeCommand.__super__ = edit.command.TextCommand;
edit.command.DecreaseFontSizeCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		if(this.view.fontSize <= 6) return;
		this.view.fontSize -= 1;
		this.view.generateFont();
		this.view.render();
	}
	,__class__: edit.command.DecreaseFontSizeCommand
});
edit.command.DeleteLeftRightCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.DeleteLeftRightCommand"] = edit.command.DeleteLeftRightCommand;
edit.command.DeleteLeftRightCommand.__name__ = true;
edit.command.DeleteLeftRightCommand.__super__ = edit.command.TextCommand;
edit.command.DeleteLeftRightCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		this.view.runCommand("left_delete",{ });
		this.view.runCommand("right_delete",{ });
	}
	,__class__: edit.command.DeleteLeftRightCommand
});
edit.command.FindUnderExpandCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.FindUnderExpandCommand"] = edit.command.FindUnderExpandCommand;
edit.command.FindUnderExpandCommand.__name__ = true;
edit.command.FindUnderExpandCommand.__super__ = edit.command.TextCommand;
edit.command.FindUnderExpandCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		var last = this.view.selection.last();
		var term = this.view.buffer.content.substring(last.begin(),last.end());
		var index = this.view.buffer.content.indexOf(term,last.end());
		if(index == -1) return;
		this.view.selection.add(new edit.Region(index,index + last.size()));
		this.view.render();
	}
	,__class__: edit.command.FindUnderExpandCommand
});
edit.command.IncreaseFontSizeCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.IncreaseFontSizeCommand"] = edit.command.IncreaseFontSizeCommand;
edit.command.IncreaseFontSizeCommand.__name__ = true;
edit.command.IncreaseFontSizeCommand.__super__ = edit.command.TextCommand;
edit.command.IncreaseFontSizeCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		this.view.fontSize += 1;
		this.view.generateFont();
		this.view.render();
	}
	,__class__: edit.command.IncreaseFontSizeCommand
});
edit.command.IndentCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.IndentCommand"] = edit.command.IndentCommand;
edit.command.IndentCommand.__name__ = true;
edit.command.IndentCommand.__super__ = edit.command.TextCommand;
edit.command.IndentCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
	}
	,__class__: edit.command.IndentCommand
});
edit.command.InsertCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.InsertCommand"] = edit.command.InsertCommand;
edit.command.InsertCommand.__name__ = true;
edit.command.InsertCommand.__super__ = edit.command.TextCommand;
edit.command.InsertCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		var characters = args.characters;
		var offset = 0;
		var size = characters.length;
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			var delta = size - region.size();
			this.view.replace(this.view.edit,new edit.Region(region.begin() + offset,region.end() + offset),characters);
			region.a = region.b = offset + region.begin() + size;
			offset += delta;
		}
		this.view.render();
	}
	,__class__: edit.command.InsertCommand
});
edit.command.InsertSnippetCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.InsertSnippetCommand"] = edit.command.InsertSnippetCommand;
edit.command.InsertSnippetCommand.__name__ = true;
edit.command.InsertSnippetCommand.__super__ = edit.command.TextCommand;
edit.command.InsertSnippetCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		var ereg = new EReg("\\$\\d","g");
		var contents = args.contents;
		var characters = ereg.replace(contents,"");
		var size = characters.length;
		var index = size;
		if(ereg.match(contents)) index = ereg.matchedPos().pos;
		var offset = 0;
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.view.buffer.insert(region.begin() + offset,region.size(),characters);
			region.a = region.b = offset + region.begin() + index;
			offset += region.size() - size;
		}
		this.view.render();
	}
	,__class__: edit.command.InsertSnippetCommand
});
edit.command.LeftDeleteCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.LeftDeleteCommand"] = edit.command.LeftDeleteCommand;
edit.command.LeftDeleteCommand.__name__ = true;
edit.command.LeftDeleteCommand.__super__ = edit.command.TextCommand;
edit.command.LeftDeleteCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			if(!region.isEmpty()) {
				this.view.runCommand("insert",{ characters : ""});
				return;
			}
		}
		var $it1 = this.view.selection.iterator();
		while( $it1.hasNext() ) {
			var region = $it1.next();
			if(region.a > 0) region.a -= 1;
		}
		this.view.runCommand("insert",{ characters : ""});
	}
	,__class__: edit.command.LeftDeleteCommand
});
edit.command.MoveCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.MoveCommand"] = edit.command.MoveCommand;
edit.command.MoveCommand.__name__ = true;
edit.command.MoveCommand.__super__ = edit.command.TextCommand;
edit.command.MoveCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	moveRegion: function(region,args) {
		var dir = args.forward?1:-1;
		var index = region.b;
		switch(args.by) {
		case "lines":
			if(!args.extend && region.size() > 0) {
				if(dir < 0) index = region.begin(); else index = region.end();
			}
			var line = this.view.fullLine(index);
			var col = index - line.a;
			if(dir > 0) {
				var next = this.view.line(line.b);
				region.b = next.a + col;
				if(region.b > next.b) region.b = next.b;
			} else {
				var prev = this.view.line(line.a - 1);
				region.b = prev.a + col;
				if(region.b > prev.b) region.b = prev.b;
			}
			break;
		case "characters":
			if(!args.extend && region.size() > 0) {
				if(dir < 0) index = region.begin(); else index = region.end();
				dir = 0;
			}
			region.b = index + dir;
			break;
		case "words":
			var word = this.view.word(index + dir);
			if(dir == -1) region.b = word.a; else region.b = word.b;
			break;
		case "word_ends":
			var word = this.view.word(index + dir);
			if(dir == -1) region.b = word.a; else region.b = word.b;
			break;
		default:
		}
		if(region.b < 0) region.b = 0;
		if(region.b > this.view.buffer.content.length) region.b = this.view.buffer.content.length;
		if(!args.extend) region.a = region.b;
	}
	,run: function(args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.moveRegion(region,args);
		}
		this.view.render();
	}
	,__class__: edit.command.MoveCommand
});
edit.command.MoveToCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.MoveToCommand"] = edit.command.MoveToCommand;
edit.command.MoveToCommand.__name__ = true;
edit.command.MoveToCommand.__super__ = edit.command.TextCommand;
edit.command.MoveToCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	moveRegion: function(region,args) {
		switch(args.to) {
		case "bol":
			region.b = this.view.line(region.b).a;
			break;
		case "eol":
			region.b = this.view.line(region.b).b;
			break;
		case "bof":
			region.b = 0;
			break;
		case "eof":
			region.b = this.view.buffer.content.length;
			break;
		}
		if(!args.extend) region.a = region.b;
	}
	,run: function(args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.moveRegion(region,args);
		}
		this.view.render();
	}
	,__class__: edit.command.MoveToCommand
});
edit.command.RedoCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.RedoCommand"] = edit.command.RedoCommand;
edit.command.RedoCommand.__name__ = true;
edit.command.RedoCommand.__super__ = edit.command.TextCommand;
edit.command.RedoCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
	}
	,__class__: edit.command.RedoCommand
});
edit.command.ReindentCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.ReindentCommand"] = edit.command.ReindentCommand;
edit.command.ReindentCommand.__name__ = true;
edit.command.ReindentCommand.__super__ = edit.command.TextCommand;
edit.command.ReindentCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
	}
	,__class__: edit.command.ReindentCommand
});
edit.command.RightDeleteCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.RightDeleteCommand"] = edit.command.RightDeleteCommand;
edit.command.RightDeleteCommand.__name__ = true;
edit.command.RightDeleteCommand.__super__ = edit.command.TextCommand;
edit.command.RightDeleteCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function() {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			if(!region.isEmpty()) {
				this.view.runCommand("insert",{ characters : ""});
				return;
			}
		}
		var $it1 = this.view.selection.iterator();
		while( $it1.hasNext() ) {
			var region = $it1.next();
			if(region.b < this.view.buffer.content.length) region.b += 1;
		}
		this.view.runCommand("insert",{ characters : ""});
	}
	,__class__: edit.command.RightDeleteCommand
});
edit.command.SelectAllCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.SelectAllCommand"] = edit.command.SelectAllCommand;
edit.command.SelectAllCommand.__name__ = true;
edit.command.SelectAllCommand.__super__ = edit.command.TextCommand;
edit.command.SelectAllCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		this.view.selection.clear();
		this.view.selection.add(new edit.Region(0,this.view.buffer.content.length));
		this.view.render();
	}
	,__class__: edit.command.SelectAllCommand
});
edit.command.SingleSelectionCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.SingleSelectionCommand"] = edit.command.SingleSelectionCommand;
edit.command.SingleSelectionCommand.__name__ = true;
edit.command.SingleSelectionCommand.__super__ = edit.command.TextCommand;
edit.command.SingleSelectionCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
		var first = this.view.selection.get(0);
		this.view.selection.clear();
		this.view.selection.add(first);
		this.view.render();
	}
	,__class__: edit.command.SingleSelectionCommand
});
edit.command.UndoCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.UndoCommand"] = edit.command.UndoCommand;
edit.command.UndoCommand.__name__ = true;
edit.command.UndoCommand.__super__ = edit.command.TextCommand;
edit.command.UndoCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
	}
	,__class__: edit.command.UndoCommand
});
edit.command.UnindentCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.UnindentCommand"] = edit.command.UnindentCommand;
edit.command.UnindentCommand.__name__ = true;
edit.command.UnindentCommand.__super__ = edit.command.TextCommand;
edit.command.UnindentCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(args) {
	}
	,__class__: edit.command.UnindentCommand
});
var haxe = {}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new haxe.ds.StringMap();
	this.params = new haxe.ds.StringMap();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(me.responseData = r.responseText); else if(s == null) me.onError("Failed to connect or resolve host"); else switch(s) {
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,__class__: haxe.Http
}
haxe.Json = function() {
};
$hxClasses["haxe.Json"] = haxe.Json;
haxe.Json.__name__ = true;
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.prototype = {
	parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45, digit = !minus, zero = c == 48;
		var point = false, e = false, pm = false, end = false;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		if(i == f) return i; else return f;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "";
					break;
				case 102:
					buf.b += "";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,__class__: haxe.Json
}
haxe.Timer = function() { }
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	__class__: haxe.ds.IntMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.prototype = {
	blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,__class__: haxe.io.Bytes
}
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
edit.Editor.main();
})();
