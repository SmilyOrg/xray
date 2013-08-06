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
	map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf.b += Std.string(f(this));
			if(p.len == 0) {
				buf.b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.b += Std.string(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		return this.r.global?(function($this) {
			var $r;
			$this.r.lastIndex = pos;
			$this.r.m = $this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = $this.r.m != null;
			if(b) $this.r.s = s;
			$r = b;
			return $r;
		}(this)):(function($this) {
			var $r;
			var b = $this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b) {
				$this.r.s = s;
				$this.r.m.index += pos;
			}
			$r = b;
			return $r;
		}(this));
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
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
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
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
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
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
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
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
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
var edit = {}
edit.Buffer = function(content) {
	this.content = content;
	this.flags = haxe.io.Bytes.alloc(1024);
	this.colors = haxe.io.Bytes.alloc(1024);
	this.buffers = [this.flags,this.colors];
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
	,setColor: function(region,color) {
		var _g1 = region.begin(), _g = region.end();
		while(_g1 < _g) {
			var i = _g1++;
			this.colors.b[i] = color & 255;
		}
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
		var _g = 0, _g1 = this.buffers;
		while(_g < _g1.length) {
			var buffer = _g1[_g];
			++_g;
			var previous = buffer;
			buffer.blit(0,previous,0,index);
			var pos = index + length;
			buffer.blit(0,previous,pos,previous.length - pos);
		}
	}
	,clearFlags: function() {
		this.flags = haxe.io.Bytes.alloc(1024);
		this.colors = haxe.io.Bytes.alloc(1024);
	}
	,__class__: edit.Buffer
}
edit.BufferFlag = $hxClasses["edit.BufferFlag"] = { __ename__ : true, __constructs__ : ["Selected","Caret","Test"] }
edit.BufferFlag.Selected = ["Selected",0];
edit.BufferFlag.Selected.toString = $estr;
edit.BufferFlag.Selected.__enum__ = edit.BufferFlag;
edit.BufferFlag.Caret = ["Caret",1];
edit.BufferFlag.Caret.toString = $estr;
edit.BufferFlag.Caret.__enum__ = edit.BufferFlag;
edit.BufferFlag.Test = ["Test",2];
edit.BufferFlag.Test.toString = $estr;
edit.BufferFlag.Test.__enum__ = edit.BufferFlag;
edit.Edit = function(view) {
	this.view = view;
	this.operations = [];
	this.selectionBefore = view.selection.clone();
};
$hxClasses["edit.Edit"] = edit.Edit;
edit.Edit.__name__ = true;
edit.Edit.prototype = {
	end: function() {
		this.selectionAfter = this.view.selection.clone();
	}
	,redo: function() {
		var len = this.operations.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var operation = this.operations[i];
			var $e = (operation);
			switch( $e[1] ) {
			case 0:
				var string = $e[3], region = $e[2];
				this.view.erase(null,region);
				break;
			case 1:
				var string = $e[3], region = $e[2];
				this.view.insert(null,region.begin(),string);
				break;
			}
		}
		this.view.selection = this.selectionAfter;
	}
	,undo: function() {
		var len = this.operations.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var operation = this.operations[len - (i + 1)];
			var $e = (operation);
			switch( $e[1] ) {
			case 0:
				var string = $e[3], region = $e[2];
				this.view.insert(null,region.begin(),string);
				break;
			case 1:
				var string = $e[3], region = $e[2];
				this.view.erase(null,region);
				break;
			}
		}
		this.view.selection = this.selectionBefore;
	}
	,erase: function(region) {
		this.operations.push(edit.EditOperation.Erase(region,this.view.substr(region)));
	}
	,insert: function(point,string) {
		this.operations.push(edit.EditOperation.Insert(new edit.Region(point,point + string.length),string));
	}
	,__class__: edit.Edit
}
edit.EditOperation = $hxClasses["edit.EditOperation"] = { __ename__ : true, __constructs__ : ["Erase","Insert"] }
edit.EditOperation.Erase = function(region,string) { var $x = ["Erase",0,region,string]; $x.__enum__ = edit.EditOperation; $x.toString = $estr; return $x; }
edit.EditOperation.Insert = function(region,string) { var $x = ["Insert",1,region,string]; $x.__enum__ = edit.EditOperation; $x.toString = $estr; return $x; }
edit.Input = function(view) {
	this.lastUp = 0.0;
	var _g = this;
	this.view = view;
	this.mappings = [];
	var document = js.Browser.document;
	var body = document.body;
	body.addEventListener("keydown",$bind(this,this.keyDown));
	body.addEventListener("keypress",$bind(this,this.keyPress));
	body.addEventListener("mousedown",$bind(this,this.mouseDown));
	body.addEventListener("mouseup",$bind(this,this.mouseUp));
	body.addEventListener("mousewheel",$bind(this,this.mouseWheel));
	body.addEventListener("scroll",$bind(this,this.scroll));
	document.addEventListener("paste",$bind(this,this.paste));
	document.addEventListener("copy",$bind(this,this.copy));
	document.addEventListener("cut",$bind(this,this.cut));
	var platform = js.Browser.window.navigator.platform;
	var os = platform.indexOf("Mac") > -1?"mac":"win";
	var http = new haxe.Http("keymap-" + os + ".json");
	http.onData = function(data) {
		_g.mappings = haxe.Json.parse(data);
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
		if($char == " " || $char == "\n") {
			this.view.endEdit(this.view.edits[0]);
			this.view.beginEdit();
		}
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
								$r = $this.view.substr(new edit.Region(region.end(),$this.view.size()));
								break;
							case "text":
								$r = $this.view.substr(region);
								break;
							case "num_selections":
								$r = Lambda.count($this.view.selection);
								break;
							case "has_prev_field":
								$r = $this.view.currentField > 0;
								break;
							case "has_next_field":
								$r = $this.view.currentField < $this.view.fields.length - 1;
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
	,paste: function(e) {
		var text = e.clipboardData.getData("text/plain");
		this.view.runCommand("insert",{ characters : text});
	}
	,copy: function(e) {
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.view.getRegions(this.view.selection));
	}
	,cut: function(e) {
		e.preventDefault();
		e.clipboardData.setData("text/plain",this.view.getRegions(this.view.selection));
		this.view.runCommand("insert",{ characters : ""});
	}
	,__class__: edit.Input
}
edit.Language = function(source) {
	this.definition = this.revive(haxe.Json.parse(source));
};
$hxClasses["edit.Language"] = edit.Language;
edit.Language.__name__ = true;
edit.Language.prototype = {
	processCaptures: function(region,captures,match,scopes) {
		var _g = 0, _g1 = Reflect.fields(captures);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			var capture = Reflect.field(captures,field);
			var group = Std.parseInt(field);
			var string = match.matched(group);
			var index = match.matchedPos().pos + match.matched(0).indexOf(string);
			var captureRegion = new edit.Region(index,index + string.length);
			var captureScope = { region : captureRegion, name : capture.name};
			scopes.push(captureScope);
		}
	}
	,searchRange: function(source,region,pattern,scopes) {
		if(!pattern.begin.matchSub(source,region.a,region.b - region.a)) return null;
		var beginPos = pattern.begin.matchedPos();
		var range = new edit.Region(beginPos.pos,beginPos.pos + beginPos.len);
		var end = pattern.end;
		if(!end.matchSub(source,range.b,region.b - range.b)) return null;
		var endPos = end.matchedPos();
		range.b = endPos.pos + endPos.len;
		var regions = [range];
		var subScopes = [];
		if(pattern.patterns != null) {
			var _g = 0, _g1 = pattern.patterns;
			while(_g < _g1.length) {
				var pattern1 = _g1[_g];
				++_g;
				var i = 0;
				while(true) {
					var subRegion = regions[i];
					var match = this.search(source,subRegion,pattern1,scopes);
					if(match != null) {
						if(match.b == range.b) {
							if(!end.matchSub(source,range.b,subRegion.b - region.b)) return null;
							endPos = end.matchedPos();
							var newEnd = endPos.pos + endPos.len;
							regions.push(new edit.Region(range.b,newEnd));
							range.b = newEnd;
						}
						var left = new edit.Region(subRegion.a,match.a);
						var right = new edit.Region(match.b,subRegion.b);
						regions.splice(i,1);
						subScopes.push({ region : match, name : pattern1.name});
						if(right.size() > 0) regions.splice(i,0,right);
						if(left.size() > 0) {
							regions.splice(i,0,left);
							i++;
						}
					} else i++;
					if(i > regions.length - 1) break;
				}
			}
		}
		if(pattern.beginCaptures != null) this.processCaptures(range,pattern.beginCaptures,pattern.begin,scopes);
		if(pattern.endCaptures != null) this.processCaptures(range,pattern.endCaptures,pattern.end,scopes);
		scopes.push({ region : range, name : pattern.name});
		return range;
	}
	,searchMatch: function(source,region,pattern,scopes) {
		if(!pattern.match.matchSub(source,region.a,region.b - region.a)) return null;
		var matchPos = pattern.match.matchedPos();
		var matchRegion = new edit.Region(matchPos.pos,matchPos.pos + matchPos.len);
		var matchScope = { region : matchRegion, name : pattern.name};
		if(pattern.captures != null) this.processCaptures(matchRegion,pattern.captures,pattern.match,scopes);
		scopes.push(matchScope);
		return matchRegion;
	}
	,search: function(source,region,pattern,scopes) {
		return pattern.match != null?this.searchMatch(source,region,pattern,scopes):this.searchRange(source,region,pattern,scopes);
	}
	,process: function(source) {
		var region = new edit.Region(0,source.length);
		var regions = [region];
		var scopes = [];
		var _g = 0, _g1 = this.definition.patterns;
		while(_g < _g1.length) {
			var pattern = _g1[_g];
			++_g;
			var i = 0;
			while(true) {
				if(i > regions.length - 1) break;
				var region1 = regions[i];
				var match = this.search(source,region1,pattern,scopes);
				if(match != null) {
					var left = new edit.Region(region1.a,match.a);
					var right = new edit.Region(match.b,region1.b);
					regions.splice(i,1);
					if(right.size() > 0) regions.splice(i,0,right);
					if(left.size() > 0) {
						regions.splice(i,0,left);
						i++;
					}
				} else i++;
			}
		}
		scopes.reverse();
		return scopes;
	}
	,revive: function(json) {
		var _g = 0, _g1 = Reflect.fields(json);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			var value = Reflect.field(json,field);
			if(js.Boot.__instanceof(value,String)) switch(field) {
			case "match":case "begin":case "end":
				json[field] = new EReg(value,"");
				break;
			default:
			} else if(js.Boot.__instanceof(value,Array)) {
				var array = value;
				var _g2 = 0;
				while(_g2 < array.length) {
					var value1 = array[_g2];
					++_g2;
					this.revive(value1);
				}
			} else this.revive(value);
		}
		return json;
	}
	,__class__: edit.Language
}
edit.Region = function(a,b) {
	this.a = a;
	this.b = b;
};
$hxClasses["edit.Region"] = edit.Region;
edit.Region.__name__ = true;
edit.Region.prototype = {
	clone: function() {
		return new edit.Region(this.a,this.b);
	}
	,subtract: function(region) {
		var size2 = region.size();
		if(region.end() <= this.begin()) {
			this.a -= size2;
			this.b -= size2;
		} else if(this.intersects(region)) {
			var cross = this.size() - this.intersection(region).size();
			this.a = this.begin() < region.begin()?this.begin():region.begin();
			this.b = this.a + cross;
		}
	}
	,insert: function(point,length) {
		if(point <= this.a) this.a += length;
		if(point <= this.b) this.b += length;
	}
	,cover: function(region) {
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
			var b = this.end() < region.end()?this.end():region.end();
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
	subtract: function(region) {
		var $it0 = this.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			r.subtract(region);
		}
	}
	,insert: function(point,length) {
		var $it0 = this.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			r.insert(point,length);
		}
	}
	,clone: function() {
		var set = new edit.RegionSet();
		var _g = 0, _g1 = this.regions;
		while(_g < _g1.length) {
			var region = _g1[_g];
			++_g;
			set.add(new edit.Region(region.a,region.b));
		}
		return set;
	}
	,last: function() {
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
edit.RegionTest = function() { }
$hxClasses["edit.RegionTest"] = edit.RegionTest;
edit.RegionTest.__name__ = true;
edit.RegionTest.main = function() {
	edit.RegionTest.testSubtract(0,1,1,2,0,1);
	edit.RegionTest.testSubtract(1,2,0,1,0,1);
	edit.RegionTest.testSubtract(1,2,0,2,0,0);
	edit.RegionTest.testSubtract(0,3,1,2,0,2);
}
edit.RegionTest.testSubtract = function(a1,b1,a2,b2,a3,b3) {
	var r1 = new edit.Region(a1,b1);
	var r2 = new edit.Region(a2,b2);
	r1.subtract(r2);
	if(r1.a != a3 || r1.b != b3) throw "\n(" + r1.a + " -> " + r1.b + ") should be\n(" + a3 + " -> " + b3 + ")";
}
edit.Settings = function(json) {
	this.values = new haxe.ds.StringMap();
	var _g = 0, _g1 = Reflect.fields(json);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var value = Reflect.field(json,field);
		this.values.set(field,value);
	}
};
$hxClasses["edit.Settings"] = edit.Settings;
edit.Settings.__name__ = true;
edit.Settings.prototype = {
	get: function(key) {
		return this.values.get(key);
	}
	,__class__: edit.Settings
}
edit.View = function() {
	this.settings = new edit.Settings(haxe.Json.parse(haxe.Resource.getString("settings")));
	this.language = new edit.Language(haxe.Resource.getString("haxe"));
	this.fields = [];
	this.currentField = 0;
	this.fontSize = this.settings.values.get("font_size");
	this.gutterWidth = 100;
	var document = js.Browser.document;
	var window = js.Browser.window;
	var body = document.body;
	this.scrollX = 0;
	this.scrollY = 0;
	this.maxScrollX = 0;
	this.maxScrollY = 0;
	this.scale = window.devicePixelRatio;
	this.selection = new edit.RegionSet();
	this.selection.add(new edit.Region(0,0));
	this.edits = [];
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.canvas2 = document.createElement("canvas");
	this.context2 = this.canvas2.getContext("2d");
	body.appendChild(this.canvas);
	this.canvas.width = this.canvas2.width = window.innerWidth * this.scale | 0;
	this.canvas.height = this.canvas2.height = window.innerHeight * this.scale | 0;
	this.theme = new haxe.ds.StringMap();
	this.theme.set("string",1);
	this.theme.set("keyword",2);
	this.theme.set("operator",3);
	this.theme.set("constant",4);
	this.theme.set("comment",5);
	this.theme.set("directive",6);
	this.theme.set("type",7);
	this.theme.set("special",8);
	this.colors = new haxe.ds.IntMap();
	this.colors.set(1,15195242);
	this.colors.set(2,16460658);
	this.colors.set(3,16460658);
	this.colors.set(4,11435775);
	this.colors.set(5,7696728);
	this.colors.set(6,6412529);
	this.colors.set(7,10936878);
	this.colors.set(8,13734446);
	var invScale = 1 / this.scale;
	this.canvas.style.webkitTransformOrigin = "top left";
	this.canvas.style.webkitTransform = "scale(" + invScale + "," + invScale + ")";
	this.setContent("");
	new edit.Input(this);
	this.runCommand("load",{ url : "Test.hx"});
};
$hxClasses["edit.View"] = edit.View;
edit.View.__name__ = true;
edit.View.main = function() {
	new edit.View();
}
edit.View.prototype = {
	renderLine: function(index) {
		var region = this.line(this.getIndex(0,index));
		var y = index * this.charHeight;
		this.context.save();
		this.context.translate(-this.scrollX,-this.scrollY);
		this.context.clearRect(0,y,this.canvas.width,this.charHeight);
		this.context.fillStyle = "#32322a";
		var $it0 = this.selection.iterator();
		while( $it0.hasNext() ) {
			var selected = $it0.next();
			if(selected.a == selected.b && this.line(selected.a).a == region.a) this.context.fillRect(0,y,this.canvas.width,this.charHeight);
		}
		this.context.fillStyle = "#8f908a";
		var num = Std.string(index + 1);
		this.context.fillText(num,this.gutterWidth - (num.length + 2) * this.charWidth,y + 2 * this.scale);
		var rulers = this.settings.values.get("rulers");
		var _g = 0;
		while(_g < rulers.length) {
			var ruler = rulers[_g];
			++_g;
			this.context.fillRect(this.gutterWidth + ruler * this.charWidth,y,this.scale,this.charHeight);
		}
		var col = 0;
		var _g1 = region.a, _g = region.b + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var code = HxOverrides.cca(this.buffer.content,i);
			var w = 1;
			if(code == 9) w = Math.floor(col / 4) * 4 + 4 - col;
			var x = this.gutterWidth + col * this.charWidth;
			if(this.buffer.hasFlagAt(i,edit.BufferFlag.Selected)) {
				this.context.fillStyle = "#38382f";
				this.context.fillRect(x,y,this.charWidth * w,this.charHeight);
			}
			if(this.buffer.hasFlagAt(i,edit.BufferFlag.Test)) {
				this.context.fillStyle = "#f00";
				this.context.fillRect(x,y,this.charWidth * w,this.charHeight);
			}
			if(code != 10 && code != 9) {
				var color = this.buffer.colors.b[i];
				if(color == 0) this.context.fillStyle = "white"; else this.context.fillStyle = "#" + StringTools.hex(this.colors.get(color));
				this.context.fillText(String.fromCharCode(code),x,y + 2 * this.scale);
			}
			if(this.buffer.hasFlagAt(i,edit.BufferFlag.Caret)) {
				this.context.fillStyle = "white";
				this.context.fillRect(x,y,this.scale,this.charHeight);
			}
			col += w;
		}
		this.context.restore();
	}
	,render: function() {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		var size = this.fontSize * this.scale | 0;
		this.context.font = "" + size + "px \"Lucida Console\",Consolas,monospace";
		this.context.textBaseline = "top";
		var metrics = this.context.measureText(".");
		this.charWidth = Math.ceil(metrics.width);
		this.charHeight = Math.ceil(size * 1.2);
		var selected = new haxe.ds.IntMap();
		var carets = new haxe.ds.IntMap();
		this.buffer.clearFlags();
		var $it0 = this.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.buffer.setFlag(region,edit.BufferFlag.Selected);
			this.buffer.setFlagAt(region.b,edit.BufferFlag.Caret);
		}
		var scopes = this.language.process(this.buffer.content);
		var _g = 0;
		while(_g < scopes.length) {
			var scope = scopes[_g];
			++_g;
			this.buffer.setColor(scope.region,this.theme.get(scope.name));
		}
		var lines = this.buffer.content.split("\n").length;
		this.maxScrollY = lines * this.charHeight - this.canvas.height;
		this.gutterWidth = (Std.string(lines).length + 3) * this.charWidth;
		var _g = 0;
		while(_g < lines) {
			var i = _g++;
			this.renderLine(i);
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
			text.b += Std.string(this.substr(region));
		}
		return text.b;
	}
	,scroll: function(x,y) {
		var oldScrollX = this.scrollX;
		var oldScrollY = this.scrollY;
		this.scrollX = Math.max(0,Math.min(this.maxScrollX,this.scrollX - x)) | 0;
		this.scrollY = Math.max(0,Math.min(this.maxScrollY,this.scrollY - y)) | 0;
		x = oldScrollX - this.scrollX;
		y = oldScrollY - this.scrollY;
		this.context2.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.context2.drawImage(this.canvas,0,0);
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.context.drawImage(this.canvas2,x,y);
		if(y > 0) {
			var start = Math.floor(this.scrollY / this.charHeight);
			var end = Math.ceil(oldScrollY / this.charHeight);
			var _g = start;
			while(_g < end) {
				var i = _g++;
				this.renderLine(i);
			}
		} else if(y < 0) {
			var start = Math.floor((oldScrollY + this.canvas.height) / this.charHeight);
			var end = Math.ceil((this.scrollY + this.canvas.height) / this.charHeight);
			var _g = start;
			while(_g < end) {
				var i = _g++;
				this.renderLine(i);
			}
		}
	}
	,getLine: function(index) {
		return this.buffer.content.split("\n")[index];
	}
	,findRight: function(index,chars) {
		var size = this.size();
		while(index <= size) {
			if(chars.indexOf(this["char"](index)) > -1) break;
			index += 1;
		}
		return index;
	}
	,findLeft: function(index,chars) {
		while(index > 0) {
			if(chars.indexOf(this["char"](index - 1)) > -1) break;
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
		if(this["char"](full.b - 1) == "\n") full.b -= 1;
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
		if(line == null) return this.size();
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
	,runCommand: function(name,args) {
		if(this.edits.length == 0) this.beginEdit();
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
		command1.run(this.edits[0],args);
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
		region = region.clone();
		if(edit != null) edit.erase(region);
		this.buffer.insert(region.begin(),region.size(),"");
		this.selection.subtract(region);
		var _g = 0, _g1 = this.fields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			field.subtract(region);
		}
	}
	,insert: function(edit,point,string) {
		if(edit != null) edit.insert(point,string);
		this.selection.insert(point,string.length);
		var _g = 0, _g1 = this.fields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			field.insert(point,string.length);
		}
		this.buffer.insert(point,0,string);
	}
	,endEdit: function(edit) {
		edit.end();
	}
	,beginEdit: function(command,args) {
		var edit1 = new edit.Edit(this);
		this.edits.unshift(edit1);
		return edit1;
	}
	,__class__: edit.View
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
	run: function(edit,args) {
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
	run: function(edit,args) {
		if(this.view.fontSize <= 6) return;
		this.view.fontSize -= 1;
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
	run: function(edit,args) {
		this.view.runCommand("left_delete",{ });
		this.view.runCommand("right_delete",{ });
	}
	,__class__: edit.command.DeleteLeftRightCommand
});
edit.command.DeleteLineCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.DeleteLineCommand"] = edit.command.DeleteLineCommand;
edit.command.DeleteLineCommand.__name__ = true;
edit.command.DeleteLineCommand.__super__ = edit.command.TextCommand;
edit.command.DeleteLineCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		this.view.runCommand("expand_selection",{ to : "line"});
		this.view.runCommand("left_delete");
	}
	,__class__: edit.command.DeleteLineCommand
});
edit.command.DuplicateLineCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.DuplicateLineCommand"] = edit.command.DuplicateLineCommand;
edit.command.DuplicateLineCommand.__name__ = true;
edit.command.DuplicateLineCommand.__super__ = edit.command.TextCommand;
edit.command.DuplicateLineCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			if(region.isEmpty()) {
				var line = this.view.line(region.a);
				var content = this.view.substr(line) + "\n";
				this.view.insert(null,line.begin(),content);
			} else this.view.insert(null,region.begin(),this.view.substr(region));
		}
		this.view.render();
	}
	,__class__: edit.command.DuplicateLineCommand
});
edit.command.ExpandSelectionCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.ExpandSelectionCommand"] = edit.command.ExpandSelectionCommand;
edit.command.ExpandSelectionCommand.__name__ = true;
edit.command.ExpandSelectionCommand.__super__ = edit.command.TextCommand;
edit.command.ExpandSelectionCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		var to = args.to;
		switch(to) {
		case "line":
			var $it0 = this.view.selection.iterator();
			while( $it0.hasNext() ) {
				var region = $it0.next();
				var line = this.view.fullLine(region.b);
				region.a = line.a;
				region.b = line.b;
			}
			break;
		default:
		}
	}
	,__class__: edit.command.ExpandSelectionCommand
});
edit.command.FindUnderExpandCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.FindUnderExpandCommand"] = edit.command.FindUnderExpandCommand;
edit.command.FindUnderExpandCommand.__name__ = true;
edit.command.FindUnderExpandCommand.__super__ = edit.command.TextCommand;
edit.command.FindUnderExpandCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit1,args) {
		var last = this.view.selection.last();
		var term = this.view.substr(last);
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
	run: function(edit,args) {
		this.view.fontSize += 1;
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
	run: function(edit,args) {
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
	run: function(edit1,args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.view.replace(edit1,new edit.Region(region.begin(),region.end()),args.characters);
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
	getVariable: function(name,region) {
		return (function($this) {
			var $r;
			switch(name) {
			case "$SELECTION":case "$SELECTED_TEXT":
				$r = $this.view.substr(region);
				break;
			case "$CURRENT_LINE":
				$r = $this.view.substr($this.view.line(region.b));
				break;
			case "$CURRENT_WORD":
				$r = $this.view.substr($this.view.word(region.b));
				break;
			case "$FILENAME":
				$r = "Todo.hx";
				break;
			case "$FILEPATH":
				$r = "/ws/project/src/Todo.hx";
				break;
			case "$FULLNAME":
				$r = "David Peek";
				break;
			case "$LINE_INDEX":
				$r = Std.string($this.view.getPosition(region.b).row);
				break;
			case "$LINE_NUMBER":
				$r = Std.string($this.view.getPosition(region.b).row + 1);
				break;
			case "$SOFT_TABS":
				$r = "NO";
				break;
			case "$TAB_SIZE":
				$r = "4";
				break;
			default:
				$r = name;
			}
			return $r;
		}(this));
	}
	,run: function(edit1,args) {
		var _g = this;
		var stops = new EReg("\\$(?:\\{(\\d):(.+?)\\}|(\\d))","g");
		var vars = new EReg("\\$[A-Z_]+","");
		var contents = args.contents;
		var fields = [];
		var regionIndex = 0;
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			var region1 = [region];
			var chars = contents;
			chars = vars.map(chars,(function(region1) {
				return function(ereg) {
					return _g.getVariable(ereg.matched(0),region1[0]);
				};
			})(region1));
			var offset = [0];
			var a = [0];
			var b = [0];
			chars = stops.map(chars,(function(b,a,offset,region1) {
				return function(ereg) {
					var num = ereg.matched(1);
					if(num == null) num = ereg.matched(3);
					var index = Std.parseInt(num);
					if(fields[index] == null) fields[index] = new edit.RegionSet();
					var field = fields[index];
					a[0] = b[0] = region1[0].begin() + ereg.matchedPos().pos - offset[0];
					if(ereg.matched(2) != null) {
						b[0] += ereg.matched(2).length;
						field.add(new edit.Region(a[0],b[0]));
						offset[0] += 5;
						return ereg.matched(2);
					}
					field.add(new edit.Region(a[0],b[0]));
					return "";
				};
			})(b,a,offset,region1));
			if(fields[0] == null) fields[0] = new edit.RegionSet();
			if(fields[0].get(regionIndex) == null) {
				var exit = region1[0].a + chars.length;
				fields[0].add(new edit.Region(exit,exit));
			}
			this.view.replace(edit1,region1[0],chars);
			regionIndex += 1;
		}
		if(fields.length > 1) fields.push(fields.shift());
		this.view.fields = fields;
		this.view.selection = fields[0].clone();
		this.view.currentField = 0;
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
	run: function(edit,args) {
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
edit.command.LoadCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.LoadCommand"] = edit.command.LoadCommand;
edit.command.LoadCommand.__name__ = true;
edit.command.LoadCommand.__super__ = edit.command.TextCommand;
edit.command.LoadCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		var _g = this;
		var http = new haxe.Http(args.url);
		http.onData = function(data) {
			_g.view.setContent(data);
		};
		http.request();
	}
	,__class__: edit.command.LoadCommand
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
			if(!args.extend && region.size() > 0) index = dir < 0?region.begin():region.end();
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
				index = dir < 0?region.begin():region.end();
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
		if(region.b > this.view.size()) region.b = this.view.size();
		if(!args.extend) region.a = region.b;
	}
	,run: function(edit,args) {
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
			region.b = this.view.size();
			break;
		}
		if(!args.extend) region.a = region.b;
	}
	,run: function(edit,args) {
		var $it0 = this.view.selection.iterator();
		while( $it0.hasNext() ) {
			var region = $it0.next();
			this.moveRegion(region,args);
		}
		this.view.render();
	}
	,__class__: edit.command.MoveToCommand
});
edit.command.NextFieldCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.NextFieldCommand"] = edit.command.NextFieldCommand;
edit.command.NextFieldCommand.__name__ = true;
edit.command.NextFieldCommand.__super__ = edit.command.TextCommand;
edit.command.NextFieldCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		this.view.currentField += 1;
		this.view.selection = this.view.fields[this.view.currentField].clone();
		this.view.render();
		if(this.view.currentField == this.view.fields.length - 1) {
			this.view.fields = [];
			this.view.currentField = 0;
		}
	}
	,__class__: edit.command.NextFieldCommand
});
edit.command.PrevFieldCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.PrevFieldCommand"] = edit.command.PrevFieldCommand;
edit.command.PrevFieldCommand.__name__ = true;
edit.command.PrevFieldCommand.__super__ = edit.command.TextCommand;
edit.command.PrevFieldCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
		this.view.currentField -= 1;
		this.view.selection = this.view.fields[this.view.currentField].clone();
		this.view.render();
	}
	,__class__: edit.command.PrevFieldCommand
});
edit.command.RedoCommand = function(view) {
	edit.command.TextCommand.call(this,view);
};
$hxClasses["edit.command.RedoCommand"] = edit.command.RedoCommand;
edit.command.RedoCommand.__name__ = true;
edit.command.RedoCommand.__super__ = edit.command.TextCommand;
edit.command.RedoCommand.prototype = $extend(edit.command.TextCommand.prototype,{
	run: function(edit,args) {
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
	run: function(edit,args) {
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
			if(region.b < this.view.size()) region.b += 1;
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
	run: function(edit1,args) {
		this.view.selection.clear();
		this.view.selection.add(new edit.Region(0,this.view.size()));
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
	run: function(edit,args) {
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
	run: function(edit,args) {
		if(this.view.edits.length > 0) {
			var edit1 = this.view.edits.shift();
			edit1.undo();
			this.view.render();
		}
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
	run: function(edit,args) {
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
		return i == f?i:f;
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
haxe.Resource = function() { }
$hxClasses["haxe.Resource"] = haxe.Resource;
haxe.Resource.__name__ = true;
haxe.Resource.getString = function(name) {
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.Unserializer.run(x.data);
			return b.toString();
		}
	}
	return null;
}
haxe.Timer = function() { }
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = true;
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		var _g = this.buf.charCodeAt(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new haxe.ds.IntMap();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntMap format";
			return h;
		case 77:
			var h = new haxe.ds.ObjectMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,__class__: haxe.Unserializer
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
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
	,set: function(key,value) {
		this.h["$" + key] = value;
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
	toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,blit: function(pos,src,srcpos,len) {
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
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
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
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
haxe.Resource.content = [{ name : "haxe", data : "s3879:ewoJIm5hbWUiOiAiSGF4ZSIsCgkic2NvcGVOYW1lIjogInNvdXJjZS5oYXhlIiwKCSJmaWxlVHlwZXMiOiBbImh4Il0sCgkicGF0dGVybnMiOgoJWwoJCXsKCQkJIm1hdGNoIjogIi8vLioiLAoJCQkibmFtZSI6ICJjb21tZW50IgoJCX0sCgkJewoJCQkiYmVnaW4iOiAiL1xcKiIsCgkJCSJlbmQiOiAiXFwqLyIsCgkJCSJuYW1lIjogImNvbW1lbnQiCgkJfSwKCQl7CgkJCSJiZWdpbiI6ICJcIiIsCgkJCSJlbmQiOiAiXCIiLAoJCQkibmFtZSI6ICJzdHJpbmciLAoJCQkicGF0dGVybnMiOgoJCQlbCgkJCQl7CgkJCQkJIm5hbWUiOiAiY29uc3RhbnQiLAoJCQkJCSJtYXRjaCI6ICJcXFxcLiIKCQkJCX0KCQkJXQoJCX0sCgkJewoJCQkiYmVnaW4iOiAiJyIsCgkJCSJlbmQiOiAiJyIsCgkJCSJuYW1lIjogInN0cmluZyIsCgkJCSJwYXR0ZXJucyI6CgkJCVsKCQkJCXsKCQkJCQkibmFtZSI6ICJjb25zdGFudCIsCgkJCQkJIm1hdGNoIjogIlxcXFwuIgoJCQkJfSwKCQkJCXsKCQkJCQkibmFtZSI6ICJzdHJpbmciLAoJCQkJCSJtYXRjaCI6ICJcXCRcXCQiCgkJCQl9LAoJCQkJewoJCQkJCSJuYW1lIjogInNvdXJjZSIsCgkJCQkJImJlZ2luIjogIihcXCRcXHspIiwKCQkJCQkiYmVnaW5DYXB0dXJlcyI6CgkJCQkJewoJCQkJCQkiMSI6IHsgIm5hbWUiOiAic3RyaW5nIiB9CgkJCQkJfSwKCQkJCQkiZW5kIjogIihcXH0pIiwKCQkJCQkiZW5kQ2FwdHVyZXMiOgoJCQkJCXsKCQkJCQkJIjEiOiB7ICJuYW1lIjogInN0cmluZyIgfQoJCQkJCX0sCgkJCQkJInBhdHRlcm5zIjoKCQkJCQlbCgkJCQkJCQoJCQkJCQl7CgkJCQkJCQkibWF0Y2giOiAiXFxiKCgwKHh8WClbMC05YS1mQS1GXSopfCgoWzAtOV0rXFwuP1swLTldKil8KFxcLlswLTldKykpKChlfEUpKFxcK3wtKT9bMC05XSspPylcXGIiLAoJCQkJCQkJIm5hbWUiOiAiY29uc3RhbnQiCgkJCQkJCX0sCgkJCQkJCXsKCQkJCQkJCSJtYXRjaCI6ICIoXFxefD4%PnxcXC18Pj58PDx8XFx8XFx8fFxcIT18XFwqfCV8PD18PHxcXC5cXC5cXC58Pj18Pnw9PXwvfFxcfHwmfFxcKz18LT18Lz18XFwqPXw8PD18Pj49fD4%Pj18XFx8PXwmPXxcXF49fD18PT58JiZ8XFwrKSIsCgkJCQkJCQkibmFtZSI6ICJvcGVyYXRvciIKCQkJCQkJfSwKCQkJCQkJewoJCQkJCQkJIm1hdGNoIjogIihcXCF8fnxcXC18XFwrXFwrfFxcLVxcLSkiLAoJCQkJCQkJIm5hbWUiOiAib3BlcmF0b3IiCgkJCQkJCX0sCgkJCQkJCXsKCQkJCQkJCSJtYXRjaCI6ICJcXGJbQS1aXVthLXpBLVowLTlfXSpcXGIiLAoJCQkJCQkJIm5hbWUiOiAidHlwZSIKCQkJCQkJfSwKCQkJCQkJewoJCQkJCQkJIm1hdGNoIjogIlxcYlthLXpfXVthLXpBLVowLTlfXSpcXGIiLAoJCQkJCQkJIm5hbWUiOiAiaWRlbnRpZmllciIKCQkJCQkJfQoJCQkJCV0KCQkJCX0sCgkJCQl7CgkJCQkJIm5hbWUiOiAiaWRlbnRpZmllciIsCgkJCQkJIm1hdGNoIjogIihcXCQpW2EtekEtWjAtMF9dKiIsCgkJCQkJImNhcHR1cmVzIjoKCQkJCQl7CgkJCQkgICAgIAkiMSI6IHsgIm5hbWUiOiAic3RyaW5nIiB9CgkJCQkJfQoJCQkJfQoJCQldCgkJfSwKCQl7CgkJCSJuYW1lIjogInN0cmluZyIsCgkJCSJiZWdpbiI6ICJ%LyIsCgkJCSJiZWdpbkNhcHR1cmVzIjoKCQkJewoJCQkJIjAiOiB7ICJuYW1lIjoia2V5d29yZCIgfQoJCQl9LAoJCQkiZW5kIjogIi9bZ2ltc3VdKiIsCgkJCSJlbmRDYXB0dXJlcyI6CgkJCXsKCQkJCSIwIjogeyAibmFtZSI6ImtleXdvcmQiIH0KCQkJfSwKCQkJInBhdHRlcm5zIjoKCQkJWwoJCQkJewoJCQkJCSJuYW1lIjoic3BlY2lhbCIsCgkJCQkJIm1hdGNoIjoiXFxcXFt3c2RXU0RdIgoJCQkJfSwKCQkJCXsKCQkJCQkibmFtZSI6InNwZWNpYWwiLAoJCQkJCSJtYXRjaCI6IltcXC5cXCtcXD9cXCpdIgoJCQkJfSwKCQkJCXsKCQkJCQkibmFtZSI6ImNvbnN0YW50IiwKCQkJCQkibWF0Y2giOiJcXFxcLiIKCQkJCX0KCQkJXQoJCX0sCgkJewoJCQkibWF0Y2giOiAiXFxiKGNsYXNzfHR5cGVkZWZ8YWJzdHJhY3R8aW50ZXJmYWNlfGVudW18cGFja2FnZXxpbXBvcnR8dXNpbmd8dGhpcylcXGIiLAoJCQkibmFtZSI6ICJkaXJlY3RpdmUiCgkJfSwKCQl7CgkJCSJtYXRjaCI6ICJcXGIod2hpbGV8cmV0dXJufHN1cGVyfG5ld3xkZWZhdWx0fGRvfGZvcnxjYXNlfHN3aXRjaHx2YXJ8aWZ8ZWxzZXx0cnl8Y2F0Y2h8dGhyb3d8ZnVuY3Rpb258cHVibGljfHByaXZhdGV8c3RhdGljfG92ZXJyaWRlfGR5bmFtaWN8aW5saW5lfG1hY3JvfHRyYWNlfGV4dGVybnxpbXBsZW1lbnRzfGV4dGVuZHN8YnJlYWt8Y29udGludWUpXFxiIiwKCQkJIm5hbWUiOiAia2V5d29yZCIKCQl9LAoJCXsKCQkJIm1hdGNoIjogIlxcYigoMCh4fFgpWzAtOWEtZkEtRl0qKXwoKFswLTldK1xcLj9bMC05XSopfChcXC5bMC05XSspKSgoZXxFKShcXCt8LSk:WzAtOV0rKT8pXFxiIiwKCQkJIm5hbWUiOiAiY29uc3RhbnQiCgkJfSwKCQl7CgkJCSJtYXRjaCI6ICJcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYiIsCgkJCSJuYW1lIjogImNvbnN0YW50IgoJCX0sCgkJewoJCQkibWF0Y2giOiAiKFxcXnw%Pj58XFwtfD4%fDw8fFxcfFxcfHxcXCE9fFxcKnwlfDw9fDx8XFwuXFwuXFwufD49fD58PT18L3xcXHx8JnxcXCs9fC09fC89fFxcKj18PDw9fD4%PXw%Pj49fFxcfD18Jj18XFxePXw9fD0%fCYmfFxcKykiLAoJCQkibmFtZSI6ICJvcGVyYXRvciIKCQl9LAoJCXsKCQkJIm1hdGNoIjogIihcXCF8fnxcXC18XFwrXFwrfFxcLVxcLSkiLAoJCQkibmFtZSI6ICJvcGVyYXRvciIKCQl9LAoJCXsKCQkJIm1hdGNoIjogIlxcYihbYS16MC05XStcXC4pKltBLVpdW2EtekEtWjAtOV9dKlxcYiIsCgkJCSJuYW1lIjogInR5cGUiCgkJfSwKCQl7CgkJCSJtYXRjaCI6ICJcXGJbYS16X11bYS16QS1aMC05X10qXFxiIiwKCQkJIm5hbWUiOiAiaWRlbnRpZmllciIKCQl9CgldCn0"},{ name : "settings", data : "s52:ewoJImZvbnRfc2l6ZSI6IDE0LAoJInJ1bGVycyI6IFsgODAgXQp9"}];
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
edit.View.main();
})();
