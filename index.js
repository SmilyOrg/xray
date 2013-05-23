(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
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
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
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
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
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
	,r: null
	,__class__: EReg
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
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
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIterator
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
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
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += "{";
		while(l != null) {
			if(first) first = false; else s.b += ", ";
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var _Map = {}
_Map.Map_Impl_ = function() { }
$hxClasses["_Map.Map_Impl_"] = _Map.Map_Impl_;
_Map.Map_Impl_.__name__ = ["_Map","Map_Impl_"];
_Map.Map_Impl_._new = null;
_Map.Map_Impl_.set = function(this1,key,value) {
	this1.set(key,value);
}
_Map.Map_Impl_.get = function(this1,key) {
	return this1.get(key);
}
_Map.Map_Impl_.exists = function(this1,key) {
	return this1.exists(key);
}
_Map.Map_Impl_.remove = function(this1,key) {
	return this1.remove(key);
}
_Map.Map_Impl_.keys = function(this1) {
	return this1.keys();
}
_Map.Map_Impl_.iterator = function(this1) {
	return this1.iterator();
}
_Map.Map_Impl_.toString = function(this1) {
	return this1.toString();
}
_Map.Map_Impl_.arrayWrite = function(this1,k,v) {
	this1.set(k,v);
	return v;
}
_Map.Map_Impl_.toStringMap = function(t) {
	return new haxe.ds.StringMap();
}
_Map.Map_Impl_.toIntMap = function(t) {
	return new haxe.ds.IntMap();
}
_Map.Map_Impl_.toEnumValueMapMap = function(t) {
	return new haxe.ds.EnumValueMap();
}
_Map.Map_Impl_.toObjectMap = function(t) {
	return new haxe.ds.ObjectMap();
}
_Map.Map_Impl_.fromStringMap = function(map) {
	return map;
}
_Map.Map_Impl_.fromIntMap = function(map) {
	return map;
}
_Map.Map_Impl_.fromObjectMap = function(map) {
	return map;
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
IMap.prototype = {
	toString: null
	,iterator: null
	,keys: null
	,remove: null
	,exists: null
	,set: null
	,get: null
	,__class__: IMap
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
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
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
}
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
}
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
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
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
}
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
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
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEof = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
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
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var dox = {}
dox.Model = function(types) {
	this.typeMap = new haxe.ds.StringMap();
	this.classTypes = [];
	this.directSubclasses = new haxe.ds.StringMap();
	this.indrectSubclasses = new haxe.ds.StringMap();
	this.directImplementors = new haxe.ds.StringMap();
	this.indrectImplementors = new haxe.ds.StringMap();
	this.docs = new haxe.ds.StringMap();
	this.packages = new haxe.ds.StringMap();
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		var base = dox.TypeTools.toBaseType(type);
		if(base == null) continue;
		if(base.isPrivate) continue;
		this.typeMap.set(base.name,base);
		var pack = base.pack.join(".");
		if(!this.packages.exists(pack)) this.packages.set(pack,[]);
		this.packages.get(pack).push(type);
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var type_eTInst_1 = $e[3], t = $e[2];
			this.classTypes.push(t.get());
			break;
		default:
		}
	}
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		var base = dox.TypeTools.toBaseType(type);
		if(base == null) continue;
		if(base.isPrivate) continue;
		var id = this.getClassTypeID(base);
		if(base.doc != null) this.docs.set(id,this.parseDoc(base.doc));
	}
	var _g = 0, _g1 = this.classTypes;
	while(_g < _g1.length) {
		var type = _g1[_g];
		++_g;
		var _g2 = 0, _g3 = type.interfaces;
		while(_g2 < _g3.length) {
			var inter = _g3[_g2];
			++_g2;
			var id = this.getClassTypeID(inter.t.get());
			if(!this.directImplementors.exists(id)) this.directImplementors.set(id,[]);
			this.directImplementors.get(id).push(type);
		}
		if(type.superClass == null) continue;
		var sup = type.superClass.t.get();
		var id = this.getClassTypeID(sup);
		if(!this.directSubclasses.exists(id)) this.directSubclasses.set(id,[]);
		this.directSubclasses.get(id).push(type);
		if(sup.superClass == null) continue;
		var sup1 = sup.superClass.t.get();
		while(sup1 != null) {
			var id1 = this.getClassTypeID(sup1);
			if(!this.indrectSubclasses.exists(id1)) this.indrectSubclasses.set(id1,[]);
			this.indrectSubclasses.get(id1).push(type);
			if(sup1.superClass == null) break;
			sup1 = sup1.superClass.t.get();
		}
	}
};
$hxClasses["dox.Model"] = dox.Model;
dox.Model.__name__ = ["dox","Model"];
dox.Model.prototype = {
	getClassTypeID: function(type) {
		return type.pack.join(".") + "." + type.module + "." + type.name;
	}
	,replaceLinks: function(ereg) {
		var id = ereg.matched(1);
		var parts = id.split(".");
		var href = "#" + parts[parts.length - 1];
		if(this.typeMap.exists(parts[0])) {
			var base = this.typeMap.get(parts[0]);
			href = dox.Printer.baseurl + "/" + base.pack.concat([base.name]).join("/") + ".html";
			if(parts.length > 1) href += "#" + parts[parts.length - 1];
		}
		return "<code><a href=\"" + href + "\">" + id + "</a></code>";
	}
	,redirectLinks: function(ereg) {
		var href = ereg.matched(1);
		if(href.indexOf(".md") == -1) return ereg.matched(0);
		href = href.split(".md").join(".html");
		return "href=\"" + href + "\"";
	}
	,markupFile: function(path) {
		return path;
	}
	,markup: function(source) {
		return source;
	}
	,parseDoc: function(doc) {
		if(doc == null) return "<p></p>";
		var orig = doc;
		var ereg = new EReg("^([\t ]+).+","m");
		if(ereg.match(doc)) {
			var tabs = new EReg("^" + ereg.matched(1),"gm");
			doc = tabs.replace(doc,"");
		}
		if(doc.charAt(doc.length - 1) == "*") doc = HxOverrides.substr(doc,0,doc.length - 1);
		doc = StringTools.trim(doc);
		return this.markup(doc);
	}
	,getDescription: function(type) {
		var doc = this.getDoc(type);
		return doc.substring(0,doc.indexOf("</p>") + 4);
	}
	,getDoc: function(type) {
		var id = this.getClassTypeID(type);
		if(!this.docs.exists(id)) return "<p></p>";
		return this.docs.get(id);
	}
	,getDirectImplementors: function(type) {
		var id = this.getClassTypeID(type);
		if(!this.directImplementors.exists(id)) return [];
		return this.directImplementors.get(id);
	}
	,getIndirectSubclasses: function(type) {
		var id = this.getClassTypeID(type);
		if(!this.indrectSubclasses.exists(id)) return [];
		return this.indrectSubclasses.get(id);
	}
	,getDirectSubclasses: function(type) {
		var id = this.getClassTypeID(type);
		if(!this.directSubclasses.exists(id)) return [];
		return this.directSubclasses.get(id);
	}
	,getSubClasses: function(type) {
		return this.getIndirectSubclasses(type).concat(this.getDirectSubclasses(type));
	}
	,packages: null
	,docs: null
	,indrectImplementors: null
	,directImplementors: null
	,indrectSubclasses: null
	,directSubclasses: null
	,classTypes: null
	,typeMap: null
	,__class__: dox.Model
}
dox.Printer = function(model) {
	this.model = model;
	this.buf = new StringBuf();
	this.nav = "";
	var packs = (function($this) {
		var $r;
		var _g = [];
		var $it0 = model.packages.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			_g.push(key);
		}
		$r = _g;
		return $r;
	}(this));
	packs.sort(Reflect.compare);
	var _g1 = 0;
	while(_g1 < packs.length) {
		var pack = packs[_g1];
		++_g1;
		var parts = pack.split(".");
		if(parts.length == 1 && parts[0] == "") parts = [];
		parts.push("index.html");
		var href = parts.join("/");
		if(pack == "") pack = "top level";
		this.nav += "<li><a href=\"" + dox.Printer.baseurl + "/" + href + "\">" + pack + "</a></li>\n";
	}
};
$hxClasses["dox.Printer"] = dox.Printer;
dox.Printer.__name__ = ["dox","Printer"];
dox.Printer.prototype = {
	typeKind: function(type) {
		return (function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 3:
				$r = "typedef";
				break;
			case 2:
				var type_eTInst_1 = $e[3], t = $e[2];
				$r = t.get().isInterface?"interface":"class";
				break;
			case 1:
				$r = "enum";
				break;
			case 8:
				$r = "abstract";
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,baseTypePath: function(type) {
		return type.pack.concat([type.name]);
	}
	,baseTypeURL: function(type) {
		return "javascript:client.filter('" + this.baseTypePath(type).join(".") + "');";
		return dox.Printer.baseurl + "/" + this.baseTypePath(type).join("/") + ".html";
	}
	,baseTypeLink: function(type) {
		var href = this.baseTypeURL(type);
		return "<a href=\"" + href + "\">" + type.name + "</a>";
	}
	,argLink: function(arg) {
		var opt = arg.opt?"?":"";
		var name = arg.name;
		var link = this.typeLink(arg.t);
		return "" + opt + "<span class=\"i\">" + name + "</span>:" + link;
	}
	,argType: function(arg) {
		return arg.t;
	}
	,refLink: function(ref) {
		return this.baseTypeLink(ref.t.get()) + this.paramsLink(ref.params);
	}
	,paramsLink: function(params) {
		if(params.length == 0) return "";
		return "&lt;" + params.map($bind(this,this.typeLink)).join(", ") + "&gt;";
	}
	,fieldLink: function(field) {
		return field.name + ":" + this.typeLink(field.type);
	}
	,typeLink: function(type) {
		if(type == null) return null;
		var base = dox.TypeTools.toBaseType(type);
		if(base == null) return (function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 4:
				var ret = $e[3], args = $e[2];
				$r = args.map($bind($this,$this.argType)).concat([ret]).map($bind($this,$this.typeLink)).join(" -> ");
				break;
			case 6:
				$r = "<a href=\"" + dox.Printer.baseurl + "/Dynamic.html\">Dynamic</a>";
				break;
			case 5:
				var a = $e[2];
				$r = "{ " + a.get().fields.map($bind($this,$this.fieldLink)).join(", ") + " }";
				break;
			default:
				$r = StringTools.htmlEscape(Std.string(type));
			}
			return $r;
		}(this));
		var link = this.baseTypeLink(base);
		var $e = (type);
		switch( $e[1] ) {
		case 3:
			var params = $e[3], type_eTType_0 = $e[2];
			link += this.paramsLink(params);
			break;
		case 2:
			var params = $e[3], type_eTInst_0 = $e[2];
			link += this.paramsLink(params);
			break;
		case 1:
			var params = $e[3], type_eTEnum_0 = $e[2];
			link += this.paramsLink(params);
			break;
		default:
		}
		return link;
	}
	,printPackTypes: function(types,title) {
		if(types.length == 0) return;
		this.buf.b += Std.string("<h2>" + title + "</h2>");
		this.buf.b += "<table class=\"table table-condensed\"><tbody>";
		var _g = 0;
		while(_g < types.length) {
			var type = types[_g];
			++_g;
			var link = this.baseTypeLink(type);
			var desc = this.model.getDescription(type);
			this.buf.b += Std.string("<tr><td width=\"200\">" + link + "</td><td>" + desc + "</td></tr>");
		}
		this.buf.b += "</tbody></table>";
	}
	,matchAll: function(ereg,string,groups) {
		if(groups == null) groups = 0;
		var matches = [];
		var pos = { pos : 0, len : 0};
		while(ereg.matchSub(string,pos.pos + pos.len)) {
			pos = ereg.matchedPos();
			var match = [];
			var _g1 = 0, _g = groups + 1;
			while(_g1 < _g) {
				var i = _g1++;
				match.push(ereg.matched(i));
			}
			matches.push(match);
		}
		return matches;
	}
	,shiftHeadings: function(doc,start,removeTop) {
		if(removeTop == null) removeTop = false;
		var matches = this.matchAll(new EReg("<h([1-9])>","i"),doc,1);
		var levels = matches.map(function(m) {
			return m[1];
		});
		levels.sort(Reflect.compare);
		var top = Std.parseInt(levels[0]);
		if(removeTop) doc = new EReg("<h" + top + ">.+?</h" + top + ">","i").replace(doc,"");
		doc = new EReg("<(/?)h([1-9])>","gi").map(doc,function(e) {
			var level = Std.parseInt(e.matched(2)) - top + start;
			return "<" + e.matched(1) + "h" + level + ">";
		});
		return doc;
	}
	,printPack: function(pack) {
		this.buf = new StringBuf();
		if(pack == "") this.buf.b += "<h1>top level<h1>"; else this.buf.b += Std.string("<h1><span class=\"d\">package</span> " + pack + "</h1>");
		var interfaces = [];
		var classes = [];
		var enums = [];
		var typedefs = [];
		var abstracts = [];
		var types = this.model.packages.get(pack);
		var _g = 0;
		while(_g < types.length) {
			var type = types[_g];
			++_g;
			var $e = (type);
			switch( $e[1] ) {
			case 2:
				var type_eTInst_1 = $e[3], t = $e[2];
				var ref = t.get();
				if(ref.isInterface) interfaces.push(ref); else classes.push(ref);
				break;
			case 1:
				var type_eTEnum_1 = $e[3], t = $e[2];
				enums.push(t.get());
				break;
			case 3:
				var type_eTType_1 = $e[3], t = $e[2];
				typedefs.push(t.get());
				break;
			case 8:
				var type_eTAbstract_1 = $e[3], t = $e[2];
				abstracts.push(t.get());
				break;
			default:
			}
		}
		this.printPackTypes(interfaces,"Interfaces");
		this.printPackTypes(classes,"Classes");
		this.printPackTypes(typedefs,"Type Definitions");
		this.printPackTypes(enums,"Enums");
		this.printPackTypes(abstracts,"Abstracts");
	}
	,printDoc: function(doc) {
		this.printMarkDownDoc(this.model.parseDoc(doc));
	}
	,printMarkDownDoc: function(doc) {
		this.buf.b += Std.string("<div class=\"doc\">" + doc + "</div>\n");
	}
	,printClassField: function(field) {
		var name = field.name;
		var $e = (field.kind);
		switch( $e[1] ) {
		case 0:
			var write = $e[3], field_fkind_eFVar_0 = $e[2];
			var link = this.typeLink(field.type);
			this.buf.b += Std.string("<a name=\"" + name + "\"></a><h3><code><span class=\"k\">var</span> <span class=\"i\">" + name + "</span>:" + link + "</code></h3>\n");
			break;
		case 1:
			var $e = (field.type);
			switch( $e[1] ) {
			case 4:
				var ret = $e[3], args = $e[2];
				var argLinks = args.map($bind(this,this.argLink)).join(", ");
				var retLink = this.typeLink(ret);
				this.buf.b += Std.string("<a name=\"" + name + "\"></a><h3><code><span class=\"k\">function</span> <span class=\"i\">" + name + "</span>(" + argLinks + "):" + retLink + "</code></h3>\n");
				break;
			default:
			}
			break;
		}
		this.printDoc(field.doc);
	}
	,printClassFields: function(fields,title) {
		var fields1 = fields.filter(function(field) {
			return field.isPublic;
		});
		if(fields1.length > 0) {
			this.buf.b += Std.string("<h2>" + title + "</h2>\n");
			var _g = 0;
			while(_g < fields1.length) {
				var field = fields1[_g];
				++_g;
				this.printClassField(field);
			}
		}
	}
	,printRelatedTypes: function(types,title) {
		if(types.length > 0) {
			var table = "<table class='table table-condensed'><tbody>";
			var _g = 0;
			while(_g < types.length) {
				var type = types[_g];
				++_g;
				var link = this.baseTypeLink(type);
				var desc = this.model.getDescription(type);
				table += "<tr><td width=\"200\">" + link + "</td><td>" + desc + "</td></tr>";
			}
			table += "</tbody></table>";
			this.buf.b += "<table class=\"related-types toggle\" style=\"margin-top:16px;\"><tbody>";
			this.buf.b += Std.string("<tr><td colspan=\"2\">" + title + "</td></tr>");
			var links = types.map($bind(this,this.baseTypeLink)).join(", ");
			this.buf.b += "<tr>";
			this.buf.b += Std.string("<td width=\"12\" style=\"vertical-align:top;\"><a href=\"#\" onclick=\"toggleInherited(this)\"><img style=\"padding-top:4px;\" src=\"" + dox.Printer.baseurl + "/triangle-closed.png\"></a></td>");
			this.buf.b += Std.string("<td class=\"toggle-hide\">" + links + "</td>");
			this.buf.b += Std.string("<td class=\"toggle-show\">" + table + "</td>");
			this.buf.b += "</tr>";
			this.buf.b += "</tbody></table>";
		}
	}
	,printTypeNav: function(type) {
		this.buf.b += "<div class=\"package-nav\">";
		var nav = [];
		var parts = [];
		var _g = 0, _g1 = type.pack;
		while(_g < _g1.length) {
			var pack = _g1[_g];
			++_g;
			parts.push(pack);
			var path = parts.join("/");
			nav.push("<a href=\"" + dox.Printer.baseurl + "/" + path + "\">" + pack + "</a>");
		}
		this.buf.b += Std.string("<a href=\"" + dox.Printer.baseurl + "\">root</a> " + nav.join("."));
		this.buf.b += "</div>";
	}
	,printAbstract: function(type) {
		this.printMarkDownDoc(this.model.getDoc(type));
	}
	,printDef: function(type) {
		this.printMarkDownDoc(this.model.getDoc(type));
		var $e = (type.type);
		switch( $e[1] ) {
		case 5:
			var a = $e[2];
			var ref = a.get();
			this.printClassFields(ref.fields,"Instance Fields");
			break;
		default:
		}
	}
	,printEnumField: function(field) {
		var name = field.name;
		var $e = (field.type);
		switch( $e[1] ) {
		case 4:
			var field_ftype_eTFun_1 = $e[3], args = $e[2];
			var argLinks = args.map($bind(this,this.argLink)).join(", ");
			if(argLinks.length > 0) argLinks = "(" + argLinks + ")";
			this.buf.b += Std.string("<h3><code>" + name + argLinks + "</code></h3>\n");
			break;
		default:
			this.buf.b += Std.string("<h3><code>" + name + "</code></h3>\n");
		}
		this.printDoc(field.doc);
	}
	,printEnum: function(type) {
		this.printMarkDownDoc(this.model.getDoc(type));
		this.buf.b += "<h2>Constructs:</h2>\n";
		var $it0 = type.constructs.iterator();
		while( $it0.hasNext() ) {
			var field = $it0.next();
			this.printEnumField(field);
		}
	}
	,printClass: function(type) {
		if(type.superClass != null) {
			var link = this.refLink(type.superClass);
			this.buf.b += Std.string("<div>extends " + link + "</div>\n");
		}
		if(type.interfaces.length > 0) {
			var links = type.interfaces.map($bind(this,this.refLink)).join(" ");
			this.buf.b += Std.string("<div>implements " + links + "</div>\n");
		}
		this.printRelatedTypes(this.model.getDirectSubclasses(type),"Direct Subclasses");
		this.printRelatedTypes(this.model.getIndirectSubclasses(type),"Indirect Subclasses");
		this.printRelatedTypes(this.model.getDirectImplementors(type),"Direct Implementors");
		this.printMarkDownDoc(this.model.getDoc(type));
		this.printClassFields(type.statics.get(),"Class Fields");
		this.printClassFields(type.fields.get(),"Instance Fields");
	}
	,getString: function() {
		return this.buf.b;
	}
	,getHtml: function() {
		return this.html(this.buf.b);
	}
	,html: function(body) {
		return "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset=\"utf-8\"> \n\t\t<link href=\"http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css\" rel=\"stylesheet\">\n\t\t<script src=\"http://code.jquery.com/jquery-1.9.1.min.js\"></script>\n\t\t<script src=\"http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js\"></script>\n\t\t<link href=\"" + dox.Printer.baseurl + "/styles.css\" rel=\"stylesheet\">\n\t\t<script type=\"text/javascript\" src=\"" + dox.Printer.baseurl + "/index.js\"></script>\n\t</head>\n\t<body>\n\t\t<div class=\"container-fluid\">\n\t\t\t<div class=\"navbar navbar-inverse navbar-fixed-top\">\n\t\t\t\t<div class=\"navbar-inner\">\n\t\t\t\t\t<ul class=\"nav\">\n\t\t\t\t\t\t<li><a href=\"#\">MDK</a></li>\n\t\t\t\t\t\t<li><a href=\"#\">Guides</a></li>\n\t\t\t\t\t\t<li class=\"active\"><a href=\"#\">API</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row-fluid\">\n\t\t\t\t<div class=\"packages\">" + this.nav + "</div>\n\t\t\t\t<div class=\"content\">" + body + "</div>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>";
	}
	,printType: function(type) {
		var base = dox.TypeTools.toBaseType(type);
		if(base == null) return;
		this.buf = new StringBuf();
		var kind = this.typeKind(type);
		var link = this.typeLink(type);
		this.buf.b += Std.string("<h1><span class=\"d\">" + kind + "</span> " + link + "</h1>\n");
		var $e = (type);
		switch( $e[1] ) {
		case 3:
			var type_eTType_1 = $e[3], t = $e[2];
			this.printDef(t.get());
			break;
		case 2:
			var type_eTInst_1 = $e[3], t = $e[2];
			this.printClass(t.get());
			break;
		case 1:
			var type_eTEnum_1 = $e[3], t = $e[2];
			this.printEnum(t.get());
			break;
		case 8:
			var type_eTAbstract_1 = $e[3], t = $e[2];
			this.printAbstract(t.get());
			break;
		default:
		}
	}
	,nav: null
	,buf: null
	,model: null
	,__class__: dox.Printer
}
dox.TypeTools = function() { }
$hxClasses["dox.TypeTools"] = dox.TypeTools;
dox.TypeTools.__name__ = ["dox","TypeTools"];
dox.TypeTools.toBaseType = function(type) {
	if(type == null) return null;
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 3:
			var type_eTType_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 7:
			var f = $e[2];
			$r = dox.TypeTools.toBaseType(f());
			break;
		case 2:
			var type_eTInst_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 1:
			var type_eTEnum_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 8:
			var type_eTAbstract_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		default:
			$r = null;
		}
		return $r;
	}(this));
}
dox.TypeTools.isBaseType = function(type) {
	return dox.TypeTools.toBaseType(type) != null;
}
dox.TypeTools.isPublic = function(type) {
	return !dox.TypeTools.isPrivate(type);
}
dox.TypeTools.isPrivate = function(type) {
	var base = dox.TypeTools.toBaseType(type);
	return base == null?false:base.isPrivate;
}
dox.TypeTools.getPath = function(type) {
	var base = dox.TypeTools.toBaseType(type);
	if(base == null) return null;
	return base.pack.concat([base.name]);
}
dox.TypeTools.getName = function(type) {
	var path = dox.TypeTools.getPath(type);
	if(path == null) return null;
	return path.join(".");
}
var haxe = {}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new haxe.ds.StringMap();
	this.params = new haxe.ds.StringMap();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
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
	,setPostData: function(data) {
		this.postData = data;
		return this;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
		return this;
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
		return this;
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,responseData: null
	,url: null
	,__class__: haxe.Http
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
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
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
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.ds = {}
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe.ds.BalancedTree.prototype = {
	toString: function() {
		return "{" + this.root.toString() + "}";
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,balance: function(l,k,v,r) {
		var hl = l == null?0:l.height;
		var hr = r == null?0:r.height;
		return hl > hr + 2?(function($this) {
			var $r;
			var _this = l.left;
			$r = _this == null?0:_this.height;
			return $r;
		}(this)) >= (function($this) {
			var $r;
			var _this = l.right;
			$r = _this == null?0:_this.height;
			return $r;
		}(this))?new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r)):hr > hl + 2?(function($this) {
			var $r;
			var _this = r.right;
			$r = _this == null?0:_this.height;
			return $r;
		}(this)) > (function($this) {
			var $r;
			var _this = r.left;
			$r = _this == null?0:_this.height;
			return $r;
		}(this))?new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right)):new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,removeMinBinding: function(t) {
		return t.left == null?t.right:this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,minBinding: function(t) {
		return t == null?(function($this) {
			var $r;
			throw "Not_found";
			return $r;
		}(this)):t.left == null?t:this.minBinding(t.left);
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			acc.push(node.key);
			this.keysLoop(node.left,acc);
			this.keysLoop(node.right,acc);
		}
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			acc.push(node.value);
			this.iteratorLoop(node.left,acc);
			this.iteratorLoop(node.right,acc);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw "Not_found";
		var c = this.compare(k,node.key);
		return c == 0?this.merge(node.left,node.right):c < 0?this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right):this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		return c == 0?new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node.height):c < 0?(function($this) {
			var $r;
			var nl = $this.setLoop(k,v,node.left);
			$r = $this.balance(nl,node.key,node.value,node.right);
			return $r;
		}(this)):(function($this) {
			var $r;
			var nr = $this.setLoop(k,v,node.right);
			$r = $this.balance(node.left,node.key,node.value,nr);
			return $r;
		}(this));
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,exists: function(k) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(k,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,remove: function(k) {
		return (function($this) {
			var $r;
			try {
				$r = (function($this) {
					var $r;
					$this.root = $this.removeLoop(k,$this.root);
					$r = true;
					return $r;
				}($this));
			} catch( e ) {
				if( js.Boot.__instanceof(e,String) ) {
					$r = false;
				} else throw(e);
			}
			return $r;
		}(this));
	}
	,get: function(k) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(k,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,set: function(k,v) {
		this.root = this.setLoop(k,v,this.root);
	}
	,root: null
	,__class__: haxe.ds.BalancedTree
}
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this.height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this.height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this.height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this.height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this.height;
		return $r;
	}(this))) + 1; else this.height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe.ds.TreeNode.prototype = {
	toString: function() {
		return (this.left == null?"":this.left.toString() + ", ") + ("" + Std.string(this.key) + "=" + Std.string(this.value)) + (this.right == null?"":", " + this.right.toString());
	}
	,height: null
	,value: null
	,key: null
	,right: null
	,left: null
	,__class__: haxe.ds.TreeNode
	,__properties__: {get_height:"get_height"}
}
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0, _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v1 = a1[i], v2 = a2[i];
			var d = Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)?this.compare(v1,v2):Reflect.compare(v1,v2);
			if(d != 0) return d;
		}
		return 0;
	}
	,compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds._HashMap = {}
haxe.ds._HashMap.HashMap_Impl_ = function() { }
$hxClasses["haxe.ds._HashMap.HashMap_Impl_"] = haxe.ds._HashMap.HashMap_Impl_;
haxe.ds._HashMap.HashMap_Impl_.__name__ = ["haxe","ds","_HashMap","HashMap_Impl_"];
haxe.ds._HashMap.HashMap_Impl_._new = function() {
	return { keys : new haxe.ds.IntMap(), values : new haxe.ds.IntMap()};
}
haxe.ds._HashMap.HashMap_Impl_.set = function(this1,k,v) {
	this1.keys.set(k.hashCode(),k);
	this1.values.set(k.hashCode(),v);
}
haxe.ds._HashMap.HashMap_Impl_.get = function(this1,k) {
	return this1.values.get(k.hashCode());
}
haxe.ds._HashMap.HashMap_Impl_.exists = function(this1,k) {
	return this1.values.exists(k.hashCode());
}
haxe.ds._HashMap.HashMap_Impl_.remove = function(this1,k) {
	this1.values.remove(k.hashCode());
	return this1.keys.remove(k.hashCode());
}
haxe.ds._HashMap.HashMap_Impl_.keys = function(this1) {
	return this1.keys.iterator();
}
haxe.ds._HashMap.HashMap_Impl_.iterator = function(this1) {
	return this1.values.iterator();
}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.assignId = function(obj) {
	return obj.__id__ = ++haxe.ds.ObjectMap.count;
}
haxe.ds.ObjectMap.getId = function(obj) {
	return obj.__id__;
}
haxe.ds.ObjectMap.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(Std.string(i));
			s.b += " => ";
			s.b += Std.string(Std.string(this.h[i.__id__]));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		var id = key.__id__;
		if(!this.h.hasOwnProperty(id)) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key.__id__);
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,h: null
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: haxe.ds.StringMap
}
haxe.ds._Vector = {}
haxe.ds._Vector.Vector_Impl_ = function() { }
$hxClasses["haxe.ds._Vector.Vector_Impl_"] = haxe.ds._Vector.Vector_Impl_;
haxe.ds._Vector.Vector_Impl_.__name__ = ["haxe","ds","_Vector","Vector_Impl_"];
haxe.ds._Vector.Vector_Impl_.__properties__ = {get_length:"get_length"}
haxe.ds._Vector.Vector_Impl_._new = function(length) {
	return new Array(length);
}
haxe.ds._Vector.Vector_Impl_.get = function(this1,index) {
	return this1[index];
}
haxe.ds._Vector.Vector_Impl_.set = function(this1,index,val) {
	return this1[index] = val;
}
haxe.ds._Vector.Vector_Impl_.get_length = function(this1) {
	return this1.length;
}
haxe.ds._Vector.Vector_Impl_.blit = function(src,srcPos,dest,destPos,len) {
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		dest[destPos + i] = src[srcPos + i];
	}
}
haxe.ds._Vector.Vector_Impl_.toData = function(this1) {
	return this1;
}
haxe.ds._Vector.Vector_Impl_.fromData = function(data) {
	return data;
}
haxe.ds._Vector.Vector_Impl_.fromArrayCopy = function(array) {
	var vec = new Array(array.length);
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		vec[i] = array[i];
	}
	return vec;
}
haxe.ds.WeakMap = function() {
	throw "Not implemented for this platform";
};
$hxClasses["haxe.ds.WeakMap"] = haxe.ds.WeakMap;
haxe.ds.WeakMap.__name__ = ["haxe","ds","WeakMap"];
haxe.ds.WeakMap.__interfaces__ = [IMap];
haxe.ds.WeakMap.prototype = {
	toString: function() {
		return null;
	}
	,iterator: function() {
		return null;
	}
	,keys: function() {
		return null;
	}
	,remove: function(key) {
		return false;
	}
	,exists: function(key) {
		return false;
	}
	,get: function(key) {
		return null;
	}
	,set: function(key,value) {
	}
	,__class__: haxe.ds.WeakMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.fastGet = function(b,pos) {
	return b[pos];
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
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
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
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
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,b: null
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,bigEndian: null
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"set_bigEndian"}
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,set_position: function(p) {
		return this.pos = p;
	}
	,get_position: function() {
		return this.pos;
	}
	,len: null
	,pos: null
	,b: null
	,__class__: haxe.io.BytesInput
	,__properties__: $extend(haxe.io.Input.prototype.__properties__,{set_position:"set_position",get_position:"get_position"})
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
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
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
haxe.macro = {}
haxe.macro.Compiler = function() { }
$hxClasses["haxe.macro.Compiler"] = haxe.macro.Compiler;
haxe.macro.Compiler.__name__ = ["haxe","macro","Compiler"];
haxe.macro.ComplexTypeTools = function() { }
$hxClasses["haxe.macro.ComplexTypeTools"] = haxe.macro.ComplexTypeTools;
haxe.macro.ComplexTypeTools.__name__ = ["haxe","macro","ComplexTypeTools"];
haxe.macro.ComplexTypeTools.toString = function(c) {
	return new haxe.macro.Printer().printComplexType(c);
}
haxe.macro.Context = function() { }
$hxClasses["haxe.macro.Context"] = haxe.macro.Context;
haxe.macro.Context.__name__ = ["haxe","macro","Context"];
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.Access = $hxClasses["haxe.macro.Access"] = { __ename__ : ["haxe","macro","Access"], __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline","AMacro"] }
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.Access.AMacro = ["AMacro",6];
haxe.macro.Access.AMacro.toString = $estr;
haxe.macro.Access.AMacro.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = $hxClasses["haxe.macro.FieldType"] = { __ename__ : ["haxe","macro","FieldType"], __constructs__ : ["FVar","FFun","FProp"] }
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind = $hxClasses["haxe.macro.TypeDefKind"] = { __ename__ : ["haxe","macro","TypeDefKind"], __constructs__ : ["TDEnum","TDStructure","TDClass","TDAlias","TDAbstract"] }
haxe.macro.TypeDefKind.TDEnum = ["TDEnum",0];
haxe.macro.TypeDefKind.TDEnum.toString = $estr;
haxe.macro.TypeDefKind.TDEnum.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDStructure = ["TDStructure",1];
haxe.macro.TypeDefKind.TDStructure.toString = $estr;
haxe.macro.TypeDefKind.TDStructure.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDClass = function(superClass,interfaces,isInterface) { var $x = ["TDClass",2,superClass,interfaces,isInterface]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind.TDAlias = function(t) { var $x = ["TDAlias",3,t]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind.TDAbstract = function(tthis,from,to) { var $x = ["TDAbstract",4,tthis,from,to]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.Error = function(m,p) {
	this.message = m;
	this.pos = p;
};
$hxClasses["haxe.macro.Error"] = haxe.macro.Error;
haxe.macro.Error.__name__ = ["haxe","macro","Error"];
haxe.macro.Error.prototype = {
	toString: function() {
		return this.message;
	}
	,pos: null
	,message: null
	,__class__: haxe.macro.Error
}
haxe.macro.ExprTools = function() { }
$hxClasses["haxe.macro.ExprTools"] = haxe.macro.ExprTools;
haxe.macro.ExprTools.__name__ = ["haxe","macro","ExprTools"];
haxe.macro.ExprTools.toFieldExpr = function(sl) {
	return Lambda.fold(sl,function(s,e) {
		return e == null?{ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent(s)), pos : { file : "/usr/lib/haxe/std/haxe/macro/ExprTools.hx", min : 1656, max : 1659}}:{ expr : haxe.macro.ExprDef.EField(e,s), pos : { file : "/usr/lib/haxe/std/haxe/macro/ExprTools.hx", min : 1670, max : 1675}};
	},null);
}
haxe.macro.ExprTools.toString = function(e) {
	return new haxe.macro.Printer().printExpr(e);
}
haxe.macro.ExprTools.iter = function(e,f) {
	var $e = (e.expr);
	switch( $e[1] ) {
	case 0:
	case 21:
	case 20:
	case 26:
		break;
	case 3:
		var e_fexpr_eEField_1 = $e[3], e1 = $e[2];
		f(e1);
		break;
	case 4:
		var e1 = $e[2];
		f(e1);
		break;
	case 22:
		var e1 = $e[2];
		f(e1);
		break;
	case 23:
		var e1 = $e[2];
		f(e1);
		break;
	case 25:
		var e_fexpr_eEDisplay_1 = $e[3], e1 = $e[2];
		f(e1);
		break;
	case 28:
		var e_fexpr_eECheckType_1 = $e[3], e1 = $e[2];
		f(e1);
		break;
	case 9:
		var e1 = $e[4], e_fexpr_eEUnop_1 = $e[3], e_fexpr_eEUnop_0 = $e[2];
		f(e1);
		break;
	case 24:
		var e_fexpr_eECast_1 = $e[3], e1 = $e[2];
		f(e1);
		break;
	case 29:
		var e1 = $e[3], e_fexpr_eEMeta_0 = $e[2];
		f(e1);
		break;
	case 1:
		var e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		break;
	case 16:
		var e_fexpr_eEWhile_2 = $e[4], e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		break;
	case 2:
		var e2 = $e[4], e1 = $e[3], e_fexpr_eEBinop_0 = $e[2];
		f(e1);
		f(e2);
		break;
	case 13:
		var e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		break;
	case 14:
		var e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		break;
	case 10:
		var vl = $e[2];
		var _g = 0;
		while(_g < vl.length) {
			var v = vl[_g];
			++_g;
			haxe.macro.ExprTools.opt2(v.expr,f);
		}
		break;
	case 18:
		var cl = $e[3], e1 = $e[2];
		f(e1);
		var _g = 0;
		while(_g < cl.length) {
			var c = cl[_g];
			++_g;
			f(c.expr);
		}
		break;
	case 27:
		var e3 = $e[4], e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		if(e3 != null) f(e3);
		break;
	case 15:
		var e3 = $e[4], e2 = $e[3], e1 = $e[2];
		f(e1);
		f(e2);
		if(e3 != null) f(e3);
		break;
	case 6:
		var el = $e[2];
		haxe.macro.ExprArrayTools.iter(el,f);
		break;
	case 8:
		var el = $e[3], e_fexpr_eENew_0 = $e[2];
		haxe.macro.ExprArrayTools.iter(el,f);
		break;
	case 12:
		var el = $e[2];
		haxe.macro.ExprArrayTools.iter(el,f);
		break;
	case 5:
		var fl = $e[2];
		var _g = 0;
		while(_g < fl.length) {
			var fd = fl[_g];
			++_g;
			f(fd.expr);
		}
		break;
	case 7:
		var el = $e[3], e1 = $e[2];
		f(e1);
		haxe.macro.ExprArrayTools.iter(el,f);
		break;
	case 19:
		var e1 = $e[2];
		if(e1 != null) f(e1);
		break;
	case 11:
		var func = $e[3], e_fexpr_eEFunction_0 = $e[2];
		var _g = 0, _g1 = func.args;
		while(_g < _g1.length) {
			var arg = _g1[_g];
			++_g;
			haxe.macro.ExprTools.opt2(arg.value,f);
		}
		haxe.macro.ExprTools.opt2(func.expr,f);
		break;
	case 17:
		var edef = $e[4], cl = $e[3], e1 = $e[2];
		f(e1);
		var _g = 0;
		while(_g < cl.length) {
			var c = cl[_g];
			++_g;
			haxe.macro.ExprArrayTools.iter(c.values,f);
			haxe.macro.ExprTools.opt2(c.guard,f);
			haxe.macro.ExprTools.opt2(c.expr,f);
		}
		if(edef != null && edef.expr != null) f(edef);
		break;
	}
}
haxe.macro.ExprTools.map = function(e,f) {
	return { pos : e.pos, expr : (function($this) {
		var $r;
		var $e = (e.expr);
		switch( $e[1] ) {
		case 0:
			$r = e.expr;
			break;
		case 1:
			var e2 = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.EArray(f(e1),f(e2));
			break;
		case 2:
			var e2 = $e[4], e1 = $e[3], op = $e[2];
			$r = haxe.macro.ExprDef.EBinop(op,f(e1),f(e2));
			break;
		case 3:
			var field = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.EField(f(e1),field);
			break;
		case 4:
			var e1 = $e[2];
			$r = haxe.macro.ExprDef.EParenthesis(f(e1));
			break;
		case 5:
			var fields = $e[2];
			$r = (function($this) {
				var $r;
				var ret = [];
				{
					var _g = 0;
					while(_g < fields.length) {
						var field = fields[_g];
						++_g;
						ret.push({ field : field.field, expr : f(field.expr)});
					}
				}
				$r = haxe.macro.ExprDef.EObjectDecl(ret);
				return $r;
			}($this));
			break;
		case 6:
			var el = $e[2];
			$r = haxe.macro.ExprDef.EArrayDecl(haxe.macro.ExprArrayTools.map(el,f));
			break;
		case 7:
			var params = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.ECall(f(e1),haxe.macro.ExprArrayTools.map(params,f));
			break;
		case 8:
			var params = $e[3], tp = $e[2];
			$r = haxe.macro.ExprDef.ENew(tp,haxe.macro.ExprArrayTools.map(params,f));
			break;
		case 9:
			var e1 = $e[4], postFix = $e[3], op = $e[2];
			$r = haxe.macro.ExprDef.EUnop(op,postFix,f(e1));
			break;
		case 10:
			var vars = $e[2];
			$r = (function($this) {
				var $r;
				var ret = [];
				{
					var _g = 0;
					while(_g < vars.length) {
						var v = vars[_g];
						++_g;
						ret.push({ name : v.name, type : v.type, expr : haxe.macro.ExprTools.opt(v.expr,f)});
					}
				}
				$r = haxe.macro.ExprDef.EVars(ret);
				return $r;
			}($this));
			break;
		case 12:
			var el = $e[2];
			$r = haxe.macro.ExprDef.EBlock(haxe.macro.ExprArrayTools.map(el,f));
			break;
		case 13:
			var expr = $e[3], it = $e[2];
			$r = haxe.macro.ExprDef.EFor(f(it),f(expr));
			break;
		case 14:
			var e2 = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.EIn(f(e1),f(e2));
			break;
		case 15:
			var eelse = $e[4], eif = $e[3], econd = $e[2];
			$r = haxe.macro.ExprDef.EIf(f(econd),f(eif),eelse == null?null:f(eelse));
			break;
		case 16:
			var normalWhile = $e[4], e1 = $e[3], econd = $e[2];
			$r = haxe.macro.ExprDef.EWhile(f(econd),f(e1),normalWhile);
			break;
		case 19:
			var e1 = $e[2];
			$r = haxe.macro.ExprDef.EReturn(e1 == null?null:f(e1));
			break;
		case 22:
			var e1 = $e[2];
			$r = haxe.macro.ExprDef.EUntyped(f(e1));
			break;
		case 23:
			var e1 = $e[2];
			$r = haxe.macro.ExprDef.EThrow(f(e1));
			break;
		case 24:
			var t = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.ECast(f(e1),t);
			break;
		case 25:
			var isCall = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.EDisplay(f(e1),isCall);
			break;
		case 27:
			var eelse = $e[4], eif = $e[3], econd = $e[2];
			$r = haxe.macro.ExprDef.ETernary(f(econd),f(eif),f(eelse));
			break;
		case 28:
			var t = $e[3], e1 = $e[2];
			$r = haxe.macro.ExprDef.ECheckType(f(e1),t);
			break;
		case 26:
		case 21:
		case 20:
			$r = e.expr;
			break;
		case 18:
			var catches = $e[3], e1 = $e[2];
			$r = (function($this) {
				var $r;
				var ret = [];
				{
					var _g = 0;
					while(_g < catches.length) {
						var c = catches[_g];
						++_g;
						ret.push({ name : c.name, type : c.type, expr : f(c.expr)});
					}
				}
				$r = haxe.macro.ExprDef.ETry(f(e1),ret);
				return $r;
			}($this));
			break;
		case 17:
			var edef = $e[4], cases = $e[3], e1 = $e[2];
			$r = (function($this) {
				var $r;
				var ret = [];
				{
					var _g = 0;
					while(_g < cases.length) {
						var c = cases[_g];
						++_g;
						ret.push({ expr : haxe.macro.ExprTools.opt(c.expr,f), guard : haxe.macro.ExprTools.opt(c.guard,f), values : haxe.macro.ExprArrayTools.map(c.values,f)});
					}
				}
				$r = haxe.macro.ExprDef.ESwitch(f(e1),ret,edef == null || edef.expr == null?edef:f(edef));
				return $r;
			}($this));
			break;
		case 11:
			var func = $e[3], name = $e[2];
			$r = (function($this) {
				var $r;
				var ret = [];
				{
					var _g = 0, _g1 = func.args;
					while(_g < _g1.length) {
						var arg = _g1[_g];
						++_g;
						ret.push({ name : arg.name, opt : arg.opt, type : arg.type, value : haxe.macro.ExprTools.opt(arg.value,f)});
					}
				}
				$r = haxe.macro.ExprDef.EFunction(name,{ args : ret, ret : func.ret, params : func.params, expr : f(func.expr)});
				return $r;
			}($this));
			break;
		case 29:
			var e1 = $e[3], m = $e[2];
			$r = haxe.macro.ExprDef.EMeta(m,f(e1));
			break;
		}
		return $r;
	}(this))};
}
haxe.macro.ExprTools.opt = function(e,f) {
	return e == null?null:f(e);
}
haxe.macro.ExprTools.opt2 = function(e,f) {
	if(e != null) f(e);
}
haxe.macro.ExprArrayTools = function() { }
$hxClasses["haxe.macro.ExprArrayTools"] = haxe.macro.ExprArrayTools;
haxe.macro.ExprArrayTools.__name__ = ["haxe","macro","ExprArrayTools"];
haxe.macro.ExprArrayTools.map = function(el,f) {
	var ret = [];
	var _g = 0;
	while(_g < el.length) {
		var e = el[_g];
		++_g;
		ret.push(f(e));
	}
	return ret;
}
haxe.macro.ExprArrayTools.iter = function(el,f) {
	var _g = 0;
	while(_g < el.length) {
		var e = el[_g];
		++_g;
		f(e);
	}
}
haxe.macro.Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
$hxClasses["haxe.macro.Printer"] = haxe.macro.Printer;
haxe.macro.Printer.__name__ = ["haxe","macro","Printer"];
haxe.macro.Printer.prototype = {
	opt: function(v,f,prefix) {
		if(prefix == null) prefix = "";
		return v == null?"":prefix + f(v);
	}
	,printTypeDefinition: function(t,printPackage) {
		if(printPackage == null) printPackage = true;
		var old = this.tabs;
		this.tabs = this.tabString;
		var str = t == null?"#NULL":(printPackage && t.pack.length > 0 && t.pack[0] != ""?"package " + t.pack.join(".") + ";\n":"") + (t.meta != null && t.meta.length > 0?t.meta.map($bind(this,this.printMetadata)).join(" ") + " ":"") + (t.isExtern?"extern ":"") + (function($this) {
			var $r;
			var $e = (t.kind);
			switch( $e[1] ) {
			case 0:
				$r = "enum " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(",") + ">":"") + " {\n" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0, _g2 = t.fields;
						while(_g1 < _g2.length) {
							var field = _g2[_g1];
							++_g1;
							_g.push($this.tabs + (field.doc != null && field.doc != ""?"/**\n" + $this.tabs + $this.tabString + StringTools.replace(field.doc,"\n","\n" + $this.tabs + $this.tabString) + "\n" + $this.tabs + "**/\n" + $this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind($this,$this.printMetadata)).join(" ") + " ":"") + (function($this) {
								var $r;
								var $e = (field.kind);
								switch( $e[1] ) {
								case 0:
									$r = field.name;
									break;
								case 2:
									$r = (function($this) {
										var $r;
										throw "FProp is invalid for TDEnum.";
										return $r;
									}($this));
									break;
								case 1:
									var func = $e[2];
									$r = field.name + $this.printFunction(func);
									break;
								}
								return $r;
							}($this)) + ";");
						}
					}
					$r = _g;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			case 1:
				$r = "typedef " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(",") + ">":"") + " = {\n" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0, _g2 = t.fields;
						while(_g1 < _g2.length) {
							var f = _g2[_g1];
							++_g1;
							_g.push($this.tabs + $this.printField(f) + ";");
						}
					}
					$r = _g;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			case 2:
				var isInterface = $e[4], interfaces = $e[3], superClass = $e[2];
				$r = (isInterface?"interface ":"class ") + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(",") + ">":"") + (superClass != null?" extends " + $this.printTypePath(superClass):"") + (interfaces != null?(isInterface?(function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < interfaces.length) {
							var tp = interfaces[_g1];
							++_g1;
							_g.push(" extends " + $this.printTypePath(tp));
						}
					}
					$r = _g;
					return $r;
				}($this)):(function($this) {
					var $r;
					var _g1 = [];
					{
						var _g2 = 0;
						while(_g2 < interfaces.length) {
							var tp = interfaces[_g2];
							++_g2;
							_g1.push(" implements " + $this.printTypePath(tp));
						}
					}
					$r = _g1;
					return $r;
				}($this))).join(""):"") + " {\n" + ((function($this) {
					var $r;
					var _g2 = [];
					{
						var _g3 = 0, _g4 = t.fields;
						while(_g3 < _g4.length) {
							var f = _g4[_g3];
							++_g3;
							_g2.push((function($this) {
								var $r;
								var fstr = $this.printField(f);
								$r = $this.tabs + fstr + (function($this) {
									var $r;
									var $e = (f.kind);
									switch( $e[1] ) {
									case 0:
									case 2:
										$r = ";";
										break;
									case 1:
										var func = $e[2];
										$r = func.expr == null?";":"";
										break;
									default:
										$r = "";
									}
									return $r;
								}($this));
								return $r;
							}($this)));
						}
					}
					$r = _g2;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			case 3:
				var ct = $e[2];
				$r = "typedef " + t.name + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(",") + ">":"") + " = " + $this.printComplexType(ct) + ";";
				break;
			case 4:
				var to = $e[4], from = $e[3], tthis = $e[2];
				$r = "abstract " + t.name + (tthis == null?"":"(" + $this.printComplexType(tthis) + ")") + (t.params.length > 0?"<" + t.params.map($bind($this,$this.printTypeParamDecl)).join(",") + ">":"") + (from == null?"":((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < from.length) {
							var f = from[_g1];
							++_g1;
							_g.push(" from " + $this.printComplexType(f));
						}
					}
					$r = _g;
					return $r;
				}($this))).join("")) + (to == null?"":((function($this) {
					var $r;
					var _g1 = [];
					{
						var _g2 = 0;
						while(_g2 < to.length) {
							var t1 = to[_g2];
							++_g2;
							_g1.push(" to " + $this.printComplexType(t1));
						}
					}
					$r = _g1;
					return $r;
				}($this))).join("")) + " {\n" + ((function($this) {
					var $r;
					var _g2 = [];
					{
						var _g3 = 0, _g4 = t.fields;
						while(_g3 < _g4.length) {
							var f = _g4[_g3];
							++_g3;
							_g2.push((function($this) {
								var $r;
								var fstr = $this.printField(f);
								$r = $this.tabs + fstr + (function($this) {
									var $r;
									var $e = (f.kind);
									switch( $e[1] ) {
									case 0:
									case 2:
										$r = ";";
										break;
									case 1:
										var func = $e[2];
										$r = func.expr == null?";":"";
										break;
									default:
										$r = "";
									}
									return $r;
								}($this));
								return $r;
							}($this)));
						}
					}
					$r = _g2;
					return $r;
				}($this))).join("\n") + "\n}";
				break;
			}
			return $r;
		}(this));
		this.tabs = old;
		return str;
	}
	,printExprs: function(el,sep) {
		return el.map($bind(this,this.printExpr)).join(sep);
	}
	,printExpr: function(e) {
		var _g = this;
		return e == null?"#NULL":(function($this) {
			var $r;
			var $e = (e.expr);
			switch( $e[1] ) {
			case 0:
				var c = $e[2];
				$r = $this.printConstant(c);
				break;
			case 1:
				var e2 = $e[3], e1 = $e[2];
				$r = "" + $this.printExpr(e1) + "[" + $this.printExpr(e2) + "]";
				break;
			case 2:
				var e2 = $e[4], e1 = $e[3], op = $e[2];
				$r = "" + $this.printExpr(e1) + $this.printBinop(op) + $this.printExpr(e2);
				break;
			case 3:
				var n = $e[3], e1 = $e[2];
				$r = "" + $this.printExpr(e1) + "." + n;
				break;
			case 4:
				var e1 = $e[2];
				$r = "(" + $this.printExpr(e1) + ")";
				break;
			case 5:
				var fl = $e[2];
				$r = "{" + fl.map(function(fld) {
					return "" + fld.field + ":" + _g.printExpr(fld.expr);
				}).join(",") + "}";
				break;
			case 6:
				var el = $e[2];
				$r = "[" + $this.printExprs(el,",") + "]";
				break;
			case 7:
				var el = $e[3], e1 = $e[2];
				$r = "" + $this.printExpr(e1) + "(" + $this.printExprs(el,",") + ")";
				break;
			case 8:
				var el = $e[3], tp = $e[2];
				$r = "new " + $this.printTypePath(tp) + "(" + $this.printExprs(el,",") + ")";
				break;
			case 9:
				var e1 = $e[4], e_fexpr_eEUnop_1 = $e[3], op = $e[2];
				$r = (function($this) {
					var $r;
					switch(e_fexpr_eEUnop_1) {
					case true:
						$r = $this.printExpr(e1) + $this.printUnop(op);
						break;
					case false:
						$r = $this.printUnop(op) + $this.printExpr(e1);
						break;
					}
					return $r;
				}($this));
				break;
			case 11:
				var func = $e[3], no = $e[2];
				$r = no != null?"function " + no + $this.printFunction(func):"function " + $this.printFunction(func);
				break;
			case 10:
				var vl = $e[2];
				$r = "var " + vl.map($bind($this,$this.printVar)).join(",");
				break;
			case 12:
				var el = $e[2];
				$r = (function($this) {
					var $r;
					switch(el.length) {
					case 0:
						$r = "{\n" + $this.tabs + "}";
						break;
					default:
						$r = (function($this) {
							var $r;
							var old = $this.tabs;
							$this.tabs += $this.tabString;
							var s = "{\n" + $this.tabs + $this.printExprs(el,";\n" + $this.tabs);
							$this.tabs = old;
							$r = s + (";\n" + $this.tabs + "}");
							return $r;
						}($this));
					}
					return $r;
				}($this));
				break;
			case 13:
				var e2 = $e[3], e1 = $e[2];
				$r = "for(" + $this.printExpr(e1) + ") " + $this.printExpr(e2);
				break;
			case 14:
				var e2 = $e[3], e1 = $e[2];
				$r = "" + $this.printExpr(e1) + " in " + $this.printExpr(e2);
				break;
			case 15:
				var eelse = $e[4], eif = $e[3], econd = $e[2];
				$r = "if(" + $this.printExpr(econd) + ") " + $this.printExpr(eif) + " " + $this.opt(eelse,$bind($this,$this.printExpr),"else ");
				break;
			case 16:
				var e_fexpr_eEWhile_2 = $e[4], e1 = $e[3], econd = $e[2];
				$r = (function($this) {
					var $r;
					switch(e_fexpr_eEWhile_2) {
					case true:
						$r = "while(" + $this.printExpr(econd) + ") " + $this.printExpr(e1);
						break;
					case false:
						$r = "do " + $this.printExpr(e1) + " while(" + $this.printExpr(econd) + ")";
						break;
					}
					return $r;
				}($this));
				break;
			case 17:
				var edef = $e[4], cl = $e[3], e1 = $e[2];
				$r = (function($this) {
					var $r;
					var old = $this.tabs;
					$this.tabs += $this.tabString;
					var s = "switch " + $this.printExpr(e1) + " {\n" + $this.tabs + cl.map(function(c) {
						return "case " + _g.printExprs(c.values,",") + (c.guard != null?"if(" + _g.printExpr(c.guard) + "):":":") + _g.opt(c.expr,$bind(_g,_g.printExpr)) + ";";
					}).join("\n" + $this.tabs);
					if(edef != null) s += "\n" + $this.tabs + "default:" + (edef.expr == null?"":$this.printExpr(edef)) + ";";
					$this.tabs = old;
					$r = s + ("\n" + $this.tabs + "}");
					return $r;
				}($this));
				break;
			case 18:
				var cl = $e[3], e1 = $e[2];
				$r = "try " + $this.printExpr(e1) + cl.map(function(c) {
					return " catch(" + c.name + ":" + _g.printComplexType(c.type) + ") " + _g.printExpr(c.expr);
				}).join("");
				break;
			case 19:
				var eo = $e[2];
				$r = "return" + $this.opt(eo,$bind($this,$this.printExpr)," ");
				break;
			case 20:
				$r = "break";
				break;
			case 21:
				$r = "continue";
				break;
			case 22:
				var e1 = $e[2];
				$r = "untyped " + $this.printExpr(e1);
				break;
			case 23:
				var e1 = $e[2];
				$r = "throw " + $this.printExpr(e1);
				break;
			case 24:
				var cto = $e[3], e1 = $e[2];
				$r = cto != null?"cast(" + $this.printExpr(e1) + ", " + $this.printComplexType(cto) + ")":"cast " + $this.printExpr(e1);
				break;
			case 25:
				var e_fexpr_eEDisplay_1 = $e[3], e1 = $e[2];
				$r = "#DISPLAY(" + $this.printExpr(e1) + ")";
				break;
			case 26:
				var tp = $e[2];
				$r = "#DISPLAY(" + $this.printTypePath(tp) + ")";
				break;
			case 27:
				var eelse = $e[4], eif = $e[3], econd = $e[2];
				$r = "" + $this.printExpr(econd) + " ? " + $this.printExpr(eif) + " : " + $this.printExpr(eelse);
				break;
			case 28:
				var ct = $e[3], e1 = $e[2];
				$r = "#CHECK_TYPE(" + $this.printExpr(e1) + ", " + $this.printComplexType(ct) + ")";
				break;
			case 29:
				var e1 = $e[3], meta = $e[2];
				$r = $this.printMetadata(meta) + " " + $this.printExpr(e1);
				break;
			}
			return $r;
		}(this));
	}
	,printVar: function(v) {
		return v.name + this.opt(v.type,$bind(this,this.printComplexType),":") + this.opt(v.expr,$bind(this,this.printExpr),"=");
	}
	,printFunction: function(func) {
		return (func.params.length > 0?"<" + func.params.map($bind(this,this.printTypeParamDecl)).join(",") + ">":"") + "(" + func.args.map($bind(this,this.printFunctionArg)).join(",") + ")" + this.opt(func.ret,$bind(this,this.printComplexType),":") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt?"?":"") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType),":") + this.opt(arg.value,$bind(this,this.printExpr),"=");
	}
	,printTypeParamDecl: function(tpd) {
		return tpd.name + (tpd.params != null && tpd.params.length > 0?"<" + tpd.params.map($bind(this,this.printTypeParamDecl)).join(",") + ">":"") + (tpd.constraints != null && tpd.constraints.length > 0?":(" + tpd.constraints.map($bind(this,this.printComplexType)).join(",") + ")":"");
	}
	,printField: function(field) {
		return (field.doc != null && field.doc != ""?"/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind(this,this.printMetadata)).join(" ") + " ":"") + (field.access != null && field.access.length > 0?field.access.map($bind(this,this.printAccess)).join(" ") + " ":"") + (function($this) {
			var $r;
			var $e = (field.kind);
			switch( $e[1] ) {
			case 0:
				var eo = $e[3], t = $e[2];
				$r = "var " + field.name + $this.opt(t,$bind($this,$this.printComplexType),":") + $this.opt(eo,$bind($this,$this.printExpr),"=");
				break;
			case 2:
				var eo = $e[5], t = $e[4], set = $e[3], get = $e[2];
				$r = "var " + field.name + "(" + get + "," + set + ")" + $this.opt(t,$bind($this,$this.printComplexType),":") + $this.opt(eo,$bind($this,$this.printExpr),"=");
				break;
			case 1:
				var func = $e[2];
				$r = "function " + field.name + $this.printFunction(func);
				break;
			}
			return $r;
		}(this));
	}
	,printAccess: function(access) {
		return (function($this) {
			var $r;
			switch( (access)[1] ) {
			case 2:
				$r = "static";
				break;
			case 0:
				$r = "public";
				break;
			case 1:
				$r = "private";
				break;
			case 3:
				$r = "override";
				break;
			case 5:
				$r = "inline";
				break;
			case 4:
				$r = "dynamic";
				break;
			case 6:
				$r = "macro";
				break;
			}
			return $r;
		}(this));
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params.length > 0?"(" + this.printExprs(meta.params,",") + ")":"");
	}
	,printComplexType: function(ct) {
		return (function($this) {
			var $r;
			var $e = (ct);
			switch( $e[1] ) {
			case 0:
				var tp = $e[2];
				$r = $this.printTypePath(tp);
				break;
			case 1:
				var ret = $e[3], args = $e[2];
				$r = args.map($bind($this,$this.printComplexType)).join("->") + "->" + $this.printComplexType(ret);
				break;
			case 2:
				var fields = $e[2];
				$r = "{" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						while(_g1 < fields.length) {
							var f = fields[_g1];
							++_g1;
							_g.push($this.printField(f) + ";");
						}
					}
					$r = _g;
					return $r;
				}($this))).join("") + "}";
				break;
			case 3:
				var ct1 = $e[2];
				$r = "(" + $this.printComplexType(ct1) + ")";
				break;
			case 5:
				var ct1 = $e[2];
				$r = "?" + $this.printComplexType(ct1);
				break;
			case 4:
				var fields = $e[3], tp = $e[2];
				$r = "{" + $this.printTypePath(tp) + " >, " + fields.map($bind($this,$this.printField)).join(",") + "}";
				break;
			}
			return $r;
		}(this));
	}
	,printTypePath: function(tp) {
		return (tp.pack.length > 0?tp.pack.join(".") + ".":"") + tp.name + (tp.sub != null?"." + tp.sub:"") + (tp.params.length > 0?"<" + tp.params.map($bind(this,this.printTypeParam)).join(",") + ">":"");
	}
	,printTypeParam: function(param) {
		return (function($this) {
			var $r;
			var $e = (param);
			switch( $e[1] ) {
			case 0:
				var ct = $e[2];
				$r = $this.printComplexType(ct);
				break;
			case 1:
				var e = $e[2];
				$r = $this.printExpr(e);
				break;
			}
			return $r;
		}(this));
	}
	,printConstant: function(c) {
		return (function($this) {
			var $r;
			var $e = (c);
			switch( $e[1] ) {
			case 2:
				var s = $e[2];
				$r = "\"" + s + "\"";
				break;
			case 3:
				var s = $e[2];
				$r = s;
				break;
			case 0:
				var s = $e[2];
				$r = s;
				break;
			case 1:
				var s = $e[2];
				$r = s;
				break;
			case 4:
				var opt = $e[3], s = $e[2];
				$r = "~/" + s + "/" + opt;
				break;
			}
			return $r;
		}(this));
	}
	,printBinop: function(op) {
		return (function($this) {
			var $r;
			var $e = (op);
			switch( $e[1] ) {
			case 0:
				$r = "+";
				break;
			case 1:
				$r = "*";
				break;
			case 2:
				$r = "/";
				break;
			case 3:
				$r = "-";
				break;
			case 4:
				$r = "=";
				break;
			case 5:
				$r = "==";
				break;
			case 6:
				$r = "!=";
				break;
			case 7:
				$r = ">";
				break;
			case 8:
				$r = ">=";
				break;
			case 9:
				$r = "<";
				break;
			case 10:
				$r = "<=";
				break;
			case 11:
				$r = "&";
				break;
			case 12:
				$r = "|";
				break;
			case 13:
				$r = "^";
				break;
			case 14:
				$r = "&&";
				break;
			case 15:
				$r = "||";
				break;
			case 16:
				$r = "<<";
				break;
			case 17:
				$r = ">>";
				break;
			case 18:
				$r = ">>>";
				break;
			case 19:
				$r = "%";
				break;
			case 21:
				$r = "...";
				break;
			case 22:
				$r = "=>";
				break;
			case 20:
				var op1 = $e[2];
				$r = $this.printBinop(op1) + "=";
				break;
			}
			return $r;
		}(this));
	}
	,printUnop: function(op) {
		return (function($this) {
			var $r;
			switch( (op)[1] ) {
			case 0:
				$r = "++";
				break;
			case 1:
				$r = "--";
				break;
			case 2:
				$r = "!";
				break;
			case 3:
				$r = "-";
				break;
			case 4:
				$r = "~";
				break;
			}
			return $r;
		}(this));
	}
	,tabString: null
	,tabs: null
	,__class__: haxe.macro.Printer
}
haxe.macro.Type = $hxClasses["haxe.macro.Type"] = { __ename__ : ["haxe","macro","Type"], __constructs__ : ["TMono","TEnum","TInst","TType","TFun","TAnonymous","TDynamic","TLazy","TAbstract"] }
haxe.macro.Type.TMono = function(t) { var $x = ["TMono",0,t]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TEnum = function(t,params) { var $x = ["TEnum",1,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TInst = function(t,params) { var $x = ["TInst",2,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TType = function(t,params) { var $x = ["TType",3,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TFun = function(args,ret) { var $x = ["TFun",4,args,ret]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TAnonymous = function(a) { var $x = ["TAnonymous",5,a]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TDynamic = function(t) { var $x = ["TDynamic",6,t]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TLazy = function(f) { var $x = ["TLazy",7,f]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.Type.TAbstract = function(t,params) { var $x = ["TAbstract",8,t,params]; $x.__enum__ = haxe.macro.Type; $x.toString = $estr; return $x; }
haxe.macro.ClassKind = $hxClasses["haxe.macro.ClassKind"] = { __ename__ : ["haxe","macro","ClassKind"], __constructs__ : ["KNormal","KTypeParameter","KExtension","KExpr","KGeneric","KGenericInstance","KMacroType","KAbstractImpl"] }
haxe.macro.ClassKind.KNormal = ["KNormal",0];
haxe.macro.ClassKind.KNormal.toString = $estr;
haxe.macro.ClassKind.KNormal.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KTypeParameter = function(constraints) { var $x = ["KTypeParameter",1,constraints]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KExtension = function(cl,params) { var $x = ["KExtension",2,cl,params]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KExpr = function(expr) { var $x = ["KExpr",3,expr]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KGeneric = ["KGeneric",4];
haxe.macro.ClassKind.KGeneric.toString = $estr;
haxe.macro.ClassKind.KGeneric.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KGenericInstance = function(cl,params) { var $x = ["KGenericInstance",5,cl,params]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.ClassKind.KMacroType = ["KMacroType",6];
haxe.macro.ClassKind.KMacroType.toString = $estr;
haxe.macro.ClassKind.KMacroType.__enum__ = haxe.macro.ClassKind;
haxe.macro.ClassKind.KAbstractImpl = function(a) { var $x = ["KAbstractImpl",7,a]; $x.__enum__ = haxe.macro.ClassKind; $x.toString = $estr; return $x; }
haxe.macro.FieldKind = $hxClasses["haxe.macro.FieldKind"] = { __ename__ : ["haxe","macro","FieldKind"], __constructs__ : ["FVar","FMethod"] }
haxe.macro.FieldKind.FVar = function(read,write) { var $x = ["FVar",0,read,write]; $x.__enum__ = haxe.macro.FieldKind; $x.toString = $estr; return $x; }
haxe.macro.FieldKind.FMethod = function(k) { var $x = ["FMethod",1,k]; $x.__enum__ = haxe.macro.FieldKind; $x.toString = $estr; return $x; }
haxe.macro.VarAccess = $hxClasses["haxe.macro.VarAccess"] = { __ename__ : ["haxe","macro","VarAccess"], __constructs__ : ["AccNormal","AccNo","AccNever","AccResolve","AccCall","AccInline","AccRequire"] }
haxe.macro.VarAccess.AccNormal = ["AccNormal",0];
haxe.macro.VarAccess.AccNormal.toString = $estr;
haxe.macro.VarAccess.AccNormal.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccNo = ["AccNo",1];
haxe.macro.VarAccess.AccNo.toString = $estr;
haxe.macro.VarAccess.AccNo.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccNever = ["AccNever",2];
haxe.macro.VarAccess.AccNever.toString = $estr;
haxe.macro.VarAccess.AccNever.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccResolve = ["AccResolve",3];
haxe.macro.VarAccess.AccResolve.toString = $estr;
haxe.macro.VarAccess.AccResolve.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccCall = ["AccCall",4];
haxe.macro.VarAccess.AccCall.toString = $estr;
haxe.macro.VarAccess.AccCall.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccInline = ["AccInline",5];
haxe.macro.VarAccess.AccInline.toString = $estr;
haxe.macro.VarAccess.AccInline.__enum__ = haxe.macro.VarAccess;
haxe.macro.VarAccess.AccRequire = function(r,msg) { var $x = ["AccRequire",6,r,msg]; $x.__enum__ = haxe.macro.VarAccess; $x.toString = $estr; return $x; }
haxe.macro.MethodKind = $hxClasses["haxe.macro.MethodKind"] = { __ename__ : ["haxe","macro","MethodKind"], __constructs__ : ["MethNormal","MethInline","MethDynamic","MethMacro"] }
haxe.macro.MethodKind.MethNormal = ["MethNormal",0];
haxe.macro.MethodKind.MethNormal.toString = $estr;
haxe.macro.MethodKind.MethNormal.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethInline = ["MethInline",1];
haxe.macro.MethodKind.MethInline.toString = $estr;
haxe.macro.MethodKind.MethInline.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethDynamic = ["MethDynamic",2];
haxe.macro.MethodKind.MethDynamic.toString = $estr;
haxe.macro.MethodKind.MethDynamic.__enum__ = haxe.macro.MethodKind;
haxe.macro.MethodKind.MethMacro = ["MethMacro",3];
haxe.macro.MethodKind.MethMacro.toString = $estr;
haxe.macro.MethodKind.MethMacro.__enum__ = haxe.macro.MethodKind;
haxe.macro.TypeTools = function() { }
$hxClasses["haxe.macro.TypeTools"] = haxe.macro.TypeTools;
haxe.macro.TypeTools.__name__ = ["haxe","macro","TypeTools"];
var hxparse = {}
hxparse.LexEngine = function(patterns) {
	this.nodes = [];
	this.finals = [];
	this.states = [];
	this.hstates = new haxe.ds.StringMap();
	this.uid = 0;
	var pid = 0;
	var _g = 0;
	while(_g < patterns.length) {
		var p = patterns[_g];
		++_g;
		var id = pid++;
		var f = new hxparse.Node(this.uid++,id);
		var n = this.initNode(p,f,id);
		this.nodes.push(n);
		this.finals.push(f);
	}
	this.makeState(this.addNodes([],this.nodes));
};
$hxClasses["hxparse.LexEngine"] = hxparse.LexEngine;
hxparse.LexEngine.__name__ = ["hxparse","LexEngine"];
hxparse.LexEngine.single = function(c) {
	return [{ min : c, max : c}];
}
hxparse.LexEngine.parse = function(pattern) {
	var p = hxparse.LexEngine.parseInner(pattern);
	if(p == null) throw "Invalid pattern '" + pattern + "'";
	return p;
}
hxparse.LexEngine.next = function(a,b) {
	return a == hxparse.Pattern.Empty?b:hxparse.Pattern.Next(a,b);
}
hxparse.LexEngine.plus = function(r) {
	return (function($this) {
		var $r;
		var $e = (r);
		switch( $e[1] ) {
		case 4:
			var r2 = $e[3], r1 = $e[2];
			$r = hxparse.Pattern.Next(r1,hxparse.LexEngine.plus(r2));
			break;
		default:
			$r = hxparse.Pattern.Plus(r);
		}
		return $r;
	}(this));
}
hxparse.LexEngine.star = function(r) {
	return (function($this) {
		var $r;
		var $e = (r);
		switch( $e[1] ) {
		case 4:
			var r2 = $e[3], r1 = $e[2];
			$r = hxparse.Pattern.Next(r1,hxparse.LexEngine.star(r2));
			break;
		default:
			$r = hxparse.Pattern.Star(r);
		}
		return $r;
	}(this));
}
hxparse.LexEngine.opt = function(r) {
	return (function($this) {
		var $r;
		var $e = (r);
		switch( $e[1] ) {
		case 4:
			var r2 = $e[3], r1 = $e[2];
			$r = hxparse.Pattern.Next(r1,hxparse.LexEngine.opt(r2));
			break;
		default:
			$r = hxparse.Pattern.Choice(r,hxparse.Pattern.Empty);
		}
		return $r;
	}(this));
}
hxparse.LexEngine.cinter = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),hxparse.LexEngine.ccomplement(c2)));
}
hxparse.LexEngine.cdiff = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),c2));
}
hxparse.LexEngine.ccomplement = function(c) {
	var first = c[0];
	var start = first != null && first.min == -1?c.shift().max + 1:-1;
	var out = [];
	var _g = 0;
	while(_g < c.length) {
		var k = c[_g];
		++_g;
		out.push({ min : start, max : k.min - 1});
		start = k.max + 1;
	}
	if(start <= 255) out.push({ min : start, max : 255});
	return out;
}
hxparse.LexEngine.cunion = function(ca,cb) {
	var i = 0, j = 0;
	var out = [];
	var a = ca[i++], b = cb[j++];
	while(true) {
		if(a == null) {
			out.push(b);
			while(j < cb.length) out.push(cb[j++]);
			break;
		}
		if(b == null) {
			out.push(a);
			while(i < ca.length) out.push(ca[i++]);
			break;
		}
		if(a.min <= b.min) {
			if(a.max + 1 < b.min) {
				out.push(a);
				a = ca[i++];
			} else if(a.max < b.max) {
				b = { min : a.min, max : b.max};
				a = ca[i++];
			} else b = cb[j++];
		} else {
			var tmp = ca;
			ca = cb;
			cb = tmp;
			var tmp1 = j;
			j = i;
			i = tmp1;
			var tmp2 = a;
			a = b;
			b = tmp2;
		}
	}
	return out;
}
hxparse.LexEngine.parseInner = function(pattern,i) {
	if(i == null) i = 0;
	var r = hxparse.Pattern.Empty;
	var l = pattern.length;
	while(i < l) {
		var c = pattern.charCodeAt(i++);
		switch(c) {
		case 43:
			if(r != hxparse.Pattern.Empty) r = hxparse.LexEngine.plus(r); else r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		case 42:
			if(r != hxparse.Pattern.Empty) r = hxparse.LexEngine.star(r); else r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		case 63:
			if(r != hxparse.Pattern.Empty) r = hxparse.LexEngine.opt(r); else r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		case 124:
			if(r != hxparse.Pattern.Empty) return hxparse.Pattern.Choice(r,hxparse.LexEngine.parseInner(pattern,i)); else r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		case 91:
			if(pattern.length > 1) {
				var range = 0;
				var acc = [];
				var not = pattern.charCodeAt(i) == 94;
				if(not) i++;
				while(true) {
					var c1 = pattern.charCodeAt(i++);
					if(c1 == 93) {
						if(range != 0) return null;
						break;
					} else if(c1 == 45) {
						if(range != 0) return null;
						var last = acc.pop();
						if(last == null) acc.push({ min : c1, max : c1}); else {
							if(last.min != last.max) return null;
							range = last.min;
						}
					} else {
						if(c1 == 92) c1 = pattern.charCodeAt(i++);
						if(range == 0) acc.push({ min : c1, max : c1}); else {
							acc.push({ min : range, max : c1});
							range = 0;
						}
					}
				}
				var g = [];
				var _g = 0;
				while(_g < acc.length) {
					var k = acc[_g];
					++_g;
					g = hxparse.LexEngine.cunion(g,[k]);
				}
				if(not) g = hxparse.LexEngine.cdiff(hxparse.LexEngine.ALL_CHARS,g);
				r = hxparse.LexEngine.next(r,hxparse.Pattern.Match(g));
			} else r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		case 92:
			c = pattern.charCodeAt(i++);
			if(c != c) c = 92;
			r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
			break;
		default:
			r = hxparse.LexEngine.next(r,hxparse.Pattern.Match([{ min : c, max : c}]));
		}
	}
	return r;
}
hxparse.LexEngine.prototype = {
	initNode: function(p,$final,pid) {
		return (function($this) {
			var $r;
			var $e = (p);
			switch( $e[1] ) {
			case 0:
				$r = $final;
				break;
			case 1:
				var c = $e[2];
				$r = (function($this) {
					var $r;
					var n = new hxparse.Node($this.uid++,pid);
					n.trans.push({ chars : c, n : $final});
					$r = n;
					return $r;
				}($this));
				break;
			case 2:
				var p1 = $e[2];
				$r = (function($this) {
					var $r;
					var n = new hxparse.Node($this.uid++,pid);
					var an = $this.initNode(p1,n,pid);
					n.epsilon.push(an);
					n.epsilon.push($final);
					$r = n;
					return $r;
				}($this));
				break;
			case 3:
				var p1 = $e[2];
				$r = (function($this) {
					var $r;
					var n = new hxparse.Node($this.uid++,pid);
					var an = $this.initNode(p1,n,pid);
					n.epsilon.push(an);
					n.epsilon.push($final);
					$r = an;
					return $r;
				}($this));
				break;
			case 4:
				var b = $e[3], a = $e[2];
				$r = $this.initNode(a,$this.initNode(b,$final,pid),pid);
				break;
			case 5:
				var b = $e[3], a = $e[2];
				$r = (function($this) {
					var $r;
					var n = new hxparse.Node($this.uid++,pid);
					n.epsilon.push($this.initNode(a,$final,pid));
					n.epsilon.push($this.initNode(b,$final,pid));
					$r = n;
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
	}
	,node: function(pid) {
		return new hxparse.Node(this.uid++,pid);
	}
	,addNodes: function(nodes,add) {
		var _g = 0;
		while(_g < add.length) {
			var n = add[_g];
			++_g;
			this.addNode(nodes,n);
		}
		return nodes;
	}
	,addNode: function(nodes,n) {
		var _g = 0;
		while(_g < nodes.length) {
			var n2 = nodes[_g];
			++_g;
			if(n == n2) return;
		}
		nodes.push(n);
		this.addNodes(nodes,n.epsilon);
	}
	,getTransitions: function(nodes) {
		var tl = [];
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			var _g1 = 0, _g2 = n.trans;
			while(_g1 < _g2.length) {
				var t = _g2[_g1];
				++_g1;
				tl.push(t);
			}
		}
		tl.sort(function(t1,t2) {
			return t1.n.id - t2.n.id;
		});
		var t0 = tl[0];
		var _g1 = 1, _g = tl.length;
		while(_g1 < _g) {
			var i = _g1++;
			var t1 = tl[i];
			if(t0.n == t1.n) {
				tl[i - 1] = null;
				t1 = { chars : hxparse.LexEngine.cunion(t0.chars,t1.chars), n : t1.n};
				tl[i] = t1;
			}
			t0 = t1;
		}
		while(HxOverrides.remove(tl,null)) {
		}
		var allChars = hxparse.LexEngine.EMPTY;
		var allStates = new List();
		var _g = 0;
		while(_g < tl.length) {
			var t = tl[_g];
			++_g;
			var states = new List();
			states.push({ chars : hxparse.LexEngine.cdiff(t.chars,allChars), n : [t.n]});
			var $it0 = allStates.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				var nodes1 = s.n.slice();
				nodes1.push(t.n);
				states.push({ chars : hxparse.LexEngine.cinter(s.chars,t.chars), n : nodes1});
				states.push({ chars : hxparse.LexEngine.cdiff(s.chars,t.chars), n : s.n});
			}
			var $it1 = states.iterator();
			while( $it1.hasNext() ) {
				var s = $it1.next();
				if(s.chars.length == 0) states.remove(s);
			}
			allChars = hxparse.LexEngine.cunion(allChars,t.chars);
			allStates = states;
		}
		var states = [];
		var $it2 = allStates.iterator();
		while( $it2.hasNext() ) {
			var s = $it2.next();
			states.push({ chars : s.chars, n : this.addNodes([],s.n)});
		}
		states.sort(function(s1,s2) {
			var a = s1.chars.length;
			var b = s2.chars.length;
			var _g1 = 0, _g = a < b?a:b;
			while(_g1 < _g) {
				var i = _g1++;
				var a1 = s1.chars[i];
				var b1 = s2.chars[i];
				if(a1.min != b1.min) return b1.min - a1.min;
				if(a1.max != b1.max) return b1.max - a1.max;
			}
			if(a < b) return b - a;
			return 0;
		});
		return states;
	}
	,makeState: function(nodes) {
		var buf = new StringBuf();
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			buf.b += Std.string(n.id);
			buf.b += "-";
		}
		var key = buf.b;
		var s = this.hstates.get(key);
		if(s != null) return s;
		s = new hxparse.State();
		this.states.push(s);
		this.hstates.set(key,s);
		var trans = this.getTransitions(nodes);
		var _g = 0;
		while(_g < trans.length) {
			var t = trans[_g];
			++_g;
			var target = this.makeState(t.n);
			var _g1 = 0, _g2 = t.chars;
			while(_g1 < _g2.length) {
				var chr = _g2[_g1];
				++_g1;
				var _g4 = chr.min, _g3 = chr.max + 1;
				while(_g4 < _g3) {
					var i = _g4++;
					s.trans[i] = target;
				}
			}
		}
		var _g = 0, _g1 = this.finals;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < nodes.length) {
				var n = nodes[_g2];
				++_g2;
				if(n == f) {
					s.finals.push(n);
					break;
				}
			}
		}
		return s;
	}
	,firstState: function() {
		return this.states[0];
	}
	,hstates: null
	,states: null
	,finals: null
	,nodes: null
	,uid: null
	,__class__: hxparse.LexEngine
}
hxparse.UnexpectedChar = function($char,pos) {
	this["char"] = $char;
	this.pos = pos;
};
$hxClasses["hxparse.UnexpectedChar"] = hxparse.UnexpectedChar;
hxparse.UnexpectedChar.__name__ = ["hxparse","UnexpectedChar"];
hxparse.UnexpectedChar.prototype = {
	toString: function() {
		return "" + Std.string(this.pos) + ": Unexpected " + this["char"];
	}
	,pos: null
	,'char': null
	,__class__: hxparse.UnexpectedChar
}
hxparse.Lexer = function(input,sourceName) {
	if(sourceName == null) sourceName = "<null>";
	var bufsize = 4096;
	this.carriage = false;
	this.current = "";
	this.buffer = haxe.io.Bytes.alloc(bufsize);
	this.bsize = bufsize;
	this.bin = 0;
	this.cin = 0;
	this.bpos = bufsize;
	this.cpos = bufsize;
	this.input = input;
	this.source = sourceName;
	this.line = 1;
	this.pos = 0;
	this.eof = false;
};
$hxClasses["hxparse.Lexer"] = hxparse.Lexer;
hxparse.Lexer.__name__ = ["hxparse","Lexer"];
hxparse.Lexer.build = function(rules) {
	var cases = [];
	var functions = [];
	var eofFunction = null;
	rules.reverse();
	var _g = 0;
	while(_g < rules.length) {
		var rule = rules[_g];
		++_g;
		if(rule.rule == "") eofFunction = rule.func; else {
			cases.push(hxparse.LexEngine.parse(rule.rule));
			functions.push(rule.func);
		}
	}
	return new hxparse.Ruleset(new hxparse.LexEngine(cases),functions,eofFunction);
}
hxparse.Lexer.posUnion = function(p1,p2) {
	return { psource : p1.psource, pline : p1.pline, pmin : p1.pmin < p2.pmin?p1.pmin:p2.pmin, pmax : p1.pmax > p2.pmax?p1.pmax:p2.pmax};
}
hxparse.Lexer.prototype = {
	token: function(ruleset) {
		var _g = this;
		if(this.eof) {
			if(ruleset.eofFunction != null) return ruleset.eofFunction(this); else throw new haxe.io.Eof();
		}
		var state = ruleset.engine.firstState();
		var n = 0;
		var cur = 0;
		var last = 0;
		var process = function(eof) {
			if(state == null) {
				_g.current = "";
				if(!eof) {
					_g.bpos -= cur + 1;
					_g.bin += cur + 1;
				}
			} else {
				_g.cin -= last;
				_g.bin = _g.cin;
				_g.current = _g.buffer.sub(_g.cpos,last).toString();
				_g.cpos += last;
				_g.bpos = _g.cpos;
				_g.pos += last;
				var i = 0;
				while(i < last) {
					_g.incLine(HxOverrides.cca(_g.current,i));
					i++;
				}
			}
		};
		try {
			while(true) {
				if(state.finals.length > 0) last = n;
				var i = this.read();
				cur = n;
				var newState = state.trans[i];
				if(newState == null) throw "Exit"; else state = newState;
				n++;
			}
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,haxe.io.Eof) ) {
				var e = $e0;
				this.eof = true;
				process(true);
			} else if( js.Boot.__instanceof($e0,String) ) {
				var e = $e0;
				process(false);
			} else throw($e0);
		}
		if(state == null || state.finals.length == 0) throw new hxparse.UnexpectedChar(String.fromCharCode(this["char"]()),this.curPos());
		return ruleset.functions[state.finals[0].pid](this);
	}
	,incLine: function(c) {
		if(c == 13) this.carriage = true; else if(c == 10 || this.carriage) {
			this.carriage = false;
			this.line++;
		}
	}
	,read: function() {
		if(this.bin == 0) {
			if(this.bpos == this.bsize) {
				var buf = haxe.io.Bytes.alloc(this.bsize * 2);
				buf.blit(this.bsize,this.buffer,0,this.bsize);
				this.cpos += this.bsize;
				this.bpos += this.bsize;
				this.buffer = buf;
				this.bsize *= 2;
			}
			var delta = this.bpos - this.cpos;
			this.buffer.blit(0,this.buffer,this.cpos,delta);
			this.bpos = delta;
			this.cpos = 0;
			var k = this.input.readBytes(this.buffer,delta,this.bsize - delta);
			this.bin += k;
			this.cin += k;
		}
		var c = this.buffer.b[this.bpos];
		this.bpos++;
		this.bin--;
		return c;
	}
	,'char': function() {
		try {
			var c = this.read();
			this.bpos--;
			this.bin++;
			this.incLine(c);
			return c;
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				return null;
			} else throw(e);
		}
	}
	,curPos: function() {
		return { psource : this.source, pline : this.line, pmin : this.pos - this.current.length, pmax : this.pos};
	}
	,eof: null
	,carriage: null
	,pos: null
	,line: null
	,source: null
	,input: null
	,cpos: null
	,cin: null
	,bpos: null
	,bin: null
	,bsize: null
	,buffer: null
	,current: null
	,__class__: hxparse.Lexer
}
hxparse.LexerStream = function(lexer,ruleset) {
	this.offset = 0;
	this.lexer = lexer;
	this.ruleset = ruleset;
	this.cache = [];
};
$hxClasses["hxparse.LexerStream"] = hxparse.LexerStream;
hxparse.LexerStream.__name__ = ["hxparse","LexerStream"];
hxparse.LexerStream.prototype = {
	get_last: function() {
		return this.cache[this.offset - 1];
	}
	,curPos: function() {
		return this.lexer.curPos();
	}
	,junk: function() {
		this.offset++;
	}
	,peek: function(n) {
		if(n == null) n = 0;
		var index = this.offset + n;
		while(this.cache[index] == null) this.cache.push(this.lexer.token(this.ruleset));
		return this.cache[index];
	}
	,cache: null
	,offset: null
	,lexer: null
	,last: null
	,ruleset: null
	,__class__: hxparse.LexerStream
	,__properties__: {get_last:"get_last"}
}
hxparse.RuleBuilder = function() { }
$hxClasses["hxparse.RuleBuilder"] = hxparse.RuleBuilder;
hxparse.RuleBuilder.__name__ = ["hxparse","RuleBuilder"];
hxparse.RuleBuilderImpl = function() { }
$hxClasses["hxparse.RuleBuilderImpl"] = hxparse.RuleBuilderImpl;
hxparse.RuleBuilderImpl.__name__ = ["hxparse","RuleBuilderImpl"];
hxparse.Pattern = $hxClasses["hxparse.Pattern"] = { __ename__ : ["hxparse","Pattern"], __constructs__ : ["Empty","Match","Star","Plus","Next","Choice"] }
hxparse.Pattern.Empty = ["Empty",0];
hxparse.Pattern.Empty.toString = $estr;
hxparse.Pattern.Empty.__enum__ = hxparse.Pattern;
hxparse.Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse.Pattern; $x.toString = $estr; return $x; }
hxparse.Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse.Pattern; $x.toString = $estr; return $x; }
hxparse.Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse.Pattern; $x.toString = $estr; return $x; }
hxparse.Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse.Pattern; $x.toString = $estr; return $x; }
hxparse.Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse.Pattern; $x.toString = $estr; return $x; }
hxparse.Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
$hxClasses["hxparse.Node"] = hxparse.Node;
hxparse.Node.__name__ = ["hxparse","Node"];
hxparse.Node.prototype = {
	epsilon: null
	,trans: null
	,pid: null
	,id: null
	,__class__: hxparse.Node
}
hxparse.Transition = function(chars) {
	this.chars = chars;
};
$hxClasses["hxparse.Transition"] = hxparse.Transition;
hxparse.Transition.__name__ = ["hxparse","Transition"];
hxparse.Transition.prototype = {
	toString: function() {
		return Std.string(this.chars);
	}
	,chars: null
	,__class__: hxparse.Transition
}
hxparse.State = function() {
	this.finals = [];
	this.trans = new Array(256);
};
$hxClasses["hxparse.State"] = hxparse.State;
hxparse.State.__name__ = ["hxparse","State"];
hxparse.State.prototype = {
	finals: null
	,trans: null
	,__class__: hxparse.State
}
hxparse.Ruleset = function(engine,functions,eofFunction) {
	this.engine = engine;
	this.functions = functions;
	this.eofFunction = eofFunction;
};
$hxClasses["hxparse.Ruleset"] = hxparse.Ruleset;
hxparse.Ruleset.__name__ = ["hxparse","Ruleset"];
hxparse.Ruleset.prototype = {
	eofFunction: null
	,functions: null
	,engine: null
	,__class__: hxparse.Ruleset
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0, _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
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
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Browser.getLocalStorage = function() {
	try {
		var s = js.Browser.window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
}
js.Browser.getSessionStorage = function() {
	try {
		var s = js.Browser.window.sessionStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
}
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
}
js.html = {}
js.html._CanvasElement = {}
js.html._CanvasElement.CanvasUtil = function() { }
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js.html._CanvasElement.CanvasUtil;
js.html._CanvasElement.CanvasUtil.__name__ = ["js","html","_CanvasElement","CanvasUtil"];
js.html._CanvasElement.CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0, _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
}
var xhx = {}
xhx.Keyword = $hxClasses["xhx.Keyword"] = { __ename__ : ["xhx","Keyword"], __constructs__ : ["Function","Class","Var","If","Else","While","Do","For","Break","Continue","Return","Extends","Implements","Import","Switch","Case","Default","Static","Public","Private","Try","Catch","New","This","Throw","Extern","Enum","In","Interface","Untyped","Cast","Override","Typedef","Dynamic","Package","Inline","Using","Null","True","False","Abstract","Macro"] }
xhx.Keyword.Function = ["Function",0];
xhx.Keyword.Function.toString = $estr;
xhx.Keyword.Function.__enum__ = xhx.Keyword;
xhx.Keyword.Class = ["Class",1];
xhx.Keyword.Class.toString = $estr;
xhx.Keyword.Class.__enum__ = xhx.Keyword;
xhx.Keyword.Var = ["Var",2];
xhx.Keyword.Var.toString = $estr;
xhx.Keyword.Var.__enum__ = xhx.Keyword;
xhx.Keyword.If = ["If",3];
xhx.Keyword.If.toString = $estr;
xhx.Keyword.If.__enum__ = xhx.Keyword;
xhx.Keyword.Else = ["Else",4];
xhx.Keyword.Else.toString = $estr;
xhx.Keyword.Else.__enum__ = xhx.Keyword;
xhx.Keyword.While = ["While",5];
xhx.Keyword.While.toString = $estr;
xhx.Keyword.While.__enum__ = xhx.Keyword;
xhx.Keyword.Do = ["Do",6];
xhx.Keyword.Do.toString = $estr;
xhx.Keyword.Do.__enum__ = xhx.Keyword;
xhx.Keyword.For = ["For",7];
xhx.Keyword.For.toString = $estr;
xhx.Keyword.For.__enum__ = xhx.Keyword;
xhx.Keyword.Break = ["Break",8];
xhx.Keyword.Break.toString = $estr;
xhx.Keyword.Break.__enum__ = xhx.Keyword;
xhx.Keyword.Continue = ["Continue",9];
xhx.Keyword.Continue.toString = $estr;
xhx.Keyword.Continue.__enum__ = xhx.Keyword;
xhx.Keyword.Return = ["Return",10];
xhx.Keyword.Return.toString = $estr;
xhx.Keyword.Return.__enum__ = xhx.Keyword;
xhx.Keyword.Extends = ["Extends",11];
xhx.Keyword.Extends.toString = $estr;
xhx.Keyword.Extends.__enum__ = xhx.Keyword;
xhx.Keyword.Implements = ["Implements",12];
xhx.Keyword.Implements.toString = $estr;
xhx.Keyword.Implements.__enum__ = xhx.Keyword;
xhx.Keyword.Import = ["Import",13];
xhx.Keyword.Import.toString = $estr;
xhx.Keyword.Import.__enum__ = xhx.Keyword;
xhx.Keyword.Switch = ["Switch",14];
xhx.Keyword.Switch.toString = $estr;
xhx.Keyword.Switch.__enum__ = xhx.Keyword;
xhx.Keyword.Case = ["Case",15];
xhx.Keyword.Case.toString = $estr;
xhx.Keyword.Case.__enum__ = xhx.Keyword;
xhx.Keyword.Default = ["Default",16];
xhx.Keyword.Default.toString = $estr;
xhx.Keyword.Default.__enum__ = xhx.Keyword;
xhx.Keyword.Static = ["Static",17];
xhx.Keyword.Static.toString = $estr;
xhx.Keyword.Static.__enum__ = xhx.Keyword;
xhx.Keyword.Public = ["Public",18];
xhx.Keyword.Public.toString = $estr;
xhx.Keyword.Public.__enum__ = xhx.Keyword;
xhx.Keyword.Private = ["Private",19];
xhx.Keyword.Private.toString = $estr;
xhx.Keyword.Private.__enum__ = xhx.Keyword;
xhx.Keyword.Try = ["Try",20];
xhx.Keyword.Try.toString = $estr;
xhx.Keyword.Try.__enum__ = xhx.Keyword;
xhx.Keyword.Catch = ["Catch",21];
xhx.Keyword.Catch.toString = $estr;
xhx.Keyword.Catch.__enum__ = xhx.Keyword;
xhx.Keyword.New = ["New",22];
xhx.Keyword.New.toString = $estr;
xhx.Keyword.New.__enum__ = xhx.Keyword;
xhx.Keyword.This = ["This",23];
xhx.Keyword.This.toString = $estr;
xhx.Keyword.This.__enum__ = xhx.Keyword;
xhx.Keyword.Throw = ["Throw",24];
xhx.Keyword.Throw.toString = $estr;
xhx.Keyword.Throw.__enum__ = xhx.Keyword;
xhx.Keyword.Extern = ["Extern",25];
xhx.Keyword.Extern.toString = $estr;
xhx.Keyword.Extern.__enum__ = xhx.Keyword;
xhx.Keyword.Enum = ["Enum",26];
xhx.Keyword.Enum.toString = $estr;
xhx.Keyword.Enum.__enum__ = xhx.Keyword;
xhx.Keyword.In = ["In",27];
xhx.Keyword.In.toString = $estr;
xhx.Keyword.In.__enum__ = xhx.Keyword;
xhx.Keyword.Interface = ["Interface",28];
xhx.Keyword.Interface.toString = $estr;
xhx.Keyword.Interface.__enum__ = xhx.Keyword;
xhx.Keyword.Untyped = ["Untyped",29];
xhx.Keyword.Untyped.toString = $estr;
xhx.Keyword.Untyped.__enum__ = xhx.Keyword;
xhx.Keyword.Cast = ["Cast",30];
xhx.Keyword.Cast.toString = $estr;
xhx.Keyword.Cast.__enum__ = xhx.Keyword;
xhx.Keyword.Override = ["Override",31];
xhx.Keyword.Override.toString = $estr;
xhx.Keyword.Override.__enum__ = xhx.Keyword;
xhx.Keyword.Typedef = ["Typedef",32];
xhx.Keyword.Typedef.toString = $estr;
xhx.Keyword.Typedef.__enum__ = xhx.Keyword;
xhx.Keyword.Dynamic = ["Dynamic",33];
xhx.Keyword.Dynamic.toString = $estr;
xhx.Keyword.Dynamic.__enum__ = xhx.Keyword;
xhx.Keyword.Package = ["Package",34];
xhx.Keyword.Package.toString = $estr;
xhx.Keyword.Package.__enum__ = xhx.Keyword;
xhx.Keyword.Inline = ["Inline",35];
xhx.Keyword.Inline.toString = $estr;
xhx.Keyword.Inline.__enum__ = xhx.Keyword;
xhx.Keyword.Using = ["Using",36];
xhx.Keyword.Using.toString = $estr;
xhx.Keyword.Using.__enum__ = xhx.Keyword;
xhx.Keyword.Null = ["Null",37];
xhx.Keyword.Null.toString = $estr;
xhx.Keyword.Null.__enum__ = xhx.Keyword;
xhx.Keyword.True = ["True",38];
xhx.Keyword.True.toString = $estr;
xhx.Keyword.True.__enum__ = xhx.Keyword;
xhx.Keyword.False = ["False",39];
xhx.Keyword.False.toString = $estr;
xhx.Keyword.False.__enum__ = xhx.Keyword;
xhx.Keyword.Abstract = ["Abstract",40];
xhx.Keyword.Abstract.toString = $estr;
xhx.Keyword.Abstract.__enum__ = xhx.Keyword;
xhx.Keyword.Macro = ["Macro",41];
xhx.Keyword.Macro.toString = $estr;
xhx.Keyword.Macro.__enum__ = xhx.Keyword;
xhx.TokenDef = $hxClasses["xhx.TokenDef"] = { __ename__ : ["xhx","TokenDef"], __constructs__ : ["Kwd","Const","Sharp","Dollar","Unop","Binop","Comment","CommentLine","IntInterval","Semicolon","Dot","DblDot","Arrow","Comma","BkOpen","BkClose","BrOpen","BrClose","POpen","PClose","Question","At","Eof"] }
xhx.TokenDef.Kwd = function(k) { var $x = ["Kwd",0,k]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Const = function(c) { var $x = ["Const",1,c]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Sharp = function(s) { var $x = ["Sharp",2,s]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Dollar = function(s) { var $x = ["Dollar",3,s]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Unop = function(op) { var $x = ["Unop",4,op]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Binop = function(op) { var $x = ["Binop",5,op]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Comment = function(s) { var $x = ["Comment",6,s]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.CommentLine = function(s) { var $x = ["CommentLine",7,s]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.IntInterval = function(s) { var $x = ["IntInterval",8,s]; $x.__enum__ = xhx.TokenDef; $x.toString = $estr; return $x; }
xhx.TokenDef.Semicolon = ["Semicolon",9];
xhx.TokenDef.Semicolon.toString = $estr;
xhx.TokenDef.Semicolon.__enum__ = xhx.TokenDef;
xhx.TokenDef.Dot = ["Dot",10];
xhx.TokenDef.Dot.toString = $estr;
xhx.TokenDef.Dot.__enum__ = xhx.TokenDef;
xhx.TokenDef.DblDot = ["DblDot",11];
xhx.TokenDef.DblDot.toString = $estr;
xhx.TokenDef.DblDot.__enum__ = xhx.TokenDef;
xhx.TokenDef.Arrow = ["Arrow",12];
xhx.TokenDef.Arrow.toString = $estr;
xhx.TokenDef.Arrow.__enum__ = xhx.TokenDef;
xhx.TokenDef.Comma = ["Comma",13];
xhx.TokenDef.Comma.toString = $estr;
xhx.TokenDef.Comma.__enum__ = xhx.TokenDef;
xhx.TokenDef.BkOpen = ["BkOpen",14];
xhx.TokenDef.BkOpen.toString = $estr;
xhx.TokenDef.BkOpen.__enum__ = xhx.TokenDef;
xhx.TokenDef.BkClose = ["BkClose",15];
xhx.TokenDef.BkClose.toString = $estr;
xhx.TokenDef.BkClose.__enum__ = xhx.TokenDef;
xhx.TokenDef.BrOpen = ["BrOpen",16];
xhx.TokenDef.BrOpen.toString = $estr;
xhx.TokenDef.BrOpen.__enum__ = xhx.TokenDef;
xhx.TokenDef.BrClose = ["BrClose",17];
xhx.TokenDef.BrClose.toString = $estr;
xhx.TokenDef.BrClose.__enum__ = xhx.TokenDef;
xhx.TokenDef.POpen = ["POpen",18];
xhx.TokenDef.POpen.toString = $estr;
xhx.TokenDef.POpen.__enum__ = xhx.TokenDef;
xhx.TokenDef.PClose = ["PClose",19];
xhx.TokenDef.PClose.toString = $estr;
xhx.TokenDef.PClose.__enum__ = xhx.TokenDef;
xhx.TokenDef.Question = ["Question",20];
xhx.TokenDef.Question.toString = $estr;
xhx.TokenDef.Question.__enum__ = xhx.TokenDef;
xhx.TokenDef.At = ["At",21];
xhx.TokenDef.At.toString = $estr;
xhx.TokenDef.At.__enum__ = xhx.TokenDef;
xhx.TokenDef.Eof = ["Eof",22];
xhx.TokenDef.Eof.toString = $estr;
xhx.TokenDef.Eof.__enum__ = xhx.TokenDef;
xhx.TypeDef = $hxClasses["xhx.TypeDef"] = { __ename__ : ["xhx","TypeDef"], __constructs__ : ["EClass","EEnum","EImport","ETypedef","EUsing"] }
xhx.TypeDef.EClass = function(d) { var $x = ["EClass",0,d]; $x.__enum__ = xhx.TypeDef; $x.toString = $estr; return $x; }
xhx.TypeDef.EEnum = function(d) { var $x = ["EEnum",1,d]; $x.__enum__ = xhx.TypeDef; $x.toString = $estr; return $x; }
xhx.TypeDef.EImport = function(sl,mode) { var $x = ["EImport",2,sl,mode]; $x.__enum__ = xhx.TypeDef; $x.toString = $estr; return $x; }
xhx.TypeDef.ETypedef = function(d) { var $x = ["ETypedef",3,d]; $x.__enum__ = xhx.TypeDef; $x.toString = $estr; return $x; }
xhx.TypeDef.EUsing = function(path) { var $x = ["EUsing",4,path]; $x.__enum__ = xhx.TypeDef; $x.toString = $estr; return $x; }
xhx.ClassFlag = $hxClasses["xhx.ClassFlag"] = { __ename__ : ["xhx","ClassFlag"], __constructs__ : ["HInterface","HExtern","HPrivate","HExtends","HImplements"] }
xhx.ClassFlag.HInterface = ["HInterface",0];
xhx.ClassFlag.HInterface.toString = $estr;
xhx.ClassFlag.HInterface.__enum__ = xhx.ClassFlag;
xhx.ClassFlag.HExtern = ["HExtern",1];
xhx.ClassFlag.HExtern.toString = $estr;
xhx.ClassFlag.HExtern.__enum__ = xhx.ClassFlag;
xhx.ClassFlag.HPrivate = ["HPrivate",2];
xhx.ClassFlag.HPrivate.toString = $estr;
xhx.ClassFlag.HPrivate.__enum__ = xhx.ClassFlag;
xhx.ClassFlag.HExtends = function(t) { var $x = ["HExtends",3,t]; $x.__enum__ = xhx.ClassFlag; $x.toString = $estr; return $x; }
xhx.ClassFlag.HImplements = function(t) { var $x = ["HImplements",4,t]; $x.__enum__ = xhx.ClassFlag; $x.toString = $estr; return $x; }
xhx.EnumFlag = $hxClasses["xhx.EnumFlag"] = { __ename__ : ["xhx","EnumFlag"], __constructs__ : ["EPrivate","EExtern"] }
xhx.EnumFlag.EPrivate = ["EPrivate",0];
xhx.EnumFlag.EPrivate.toString = $estr;
xhx.EnumFlag.EPrivate.__enum__ = xhx.EnumFlag;
xhx.EnumFlag.EExtern = ["EExtern",1];
xhx.EnumFlag.EExtern.toString = $estr;
xhx.EnumFlag.EExtern.__enum__ = xhx.EnumFlag;
xhx.ImportMode = $hxClasses["xhx.ImportMode"] = { __ename__ : ["xhx","ImportMode"], __constructs__ : ["INormal","IAsName","IAll"] }
xhx.ImportMode.INormal = ["INormal",0];
xhx.ImportMode.INormal.toString = $estr;
xhx.ImportMode.INormal.__enum__ = xhx.ImportMode;
xhx.ImportMode.IAsName = function(s) { var $x = ["IAsName",1,s]; $x.__enum__ = xhx.ImportMode; $x.toString = $estr; return $x; }
xhx.ImportMode.IAll = ["IAll",2];
xhx.ImportMode.IAll.toString = $estr;
xhx.ImportMode.IAll.__enum__ = xhx.ImportMode;
xhx.LexerErrorMsg = $hxClasses["xhx.LexerErrorMsg"] = { __ename__ : ["xhx","LexerErrorMsg"], __constructs__ : ["UnterminatedString","UnterminatedRegExp","UnclosedComment"] }
xhx.LexerErrorMsg.UnterminatedString = ["UnterminatedString",0];
xhx.LexerErrorMsg.UnterminatedString.toString = $estr;
xhx.LexerErrorMsg.UnterminatedString.__enum__ = xhx.LexerErrorMsg;
xhx.LexerErrorMsg.UnterminatedRegExp = ["UnterminatedRegExp",1];
xhx.LexerErrorMsg.UnterminatedRegExp.toString = $estr;
xhx.LexerErrorMsg.UnterminatedRegExp.__enum__ = xhx.LexerErrorMsg;
xhx.LexerErrorMsg.UnclosedComment = ["UnclosedComment",2];
xhx.LexerErrorMsg.UnclosedComment.toString = $estr;
xhx.LexerErrorMsg.UnclosedComment.__enum__ = xhx.LexerErrorMsg;
xhx.LexerError = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
$hxClasses["xhx.LexerError"] = xhx.LexerError;
xhx.LexerError.__name__ = ["xhx","LexerError"];
xhx.LexerError.prototype = {
	pos: null
	,msg: null
	,__class__: xhx.LexerError
}
xhx.HaxeLexer = function(input,sourceName) {
	hxparse.Lexer.call(this,input,sourceName);
};
$hxClasses["xhx.HaxeLexer"] = xhx.HaxeLexer;
xhx.HaxeLexer.__name__ = ["xhx","HaxeLexer"];
xhx.HaxeLexer.__interfaces__ = [hxparse.RuleBuilder];
xhx.HaxeLexer.mkPos = function(p) {
	return { file : p.psource, min : p.pmin, max : p.pmax};
}
xhx.HaxeLexer.mk = function(lexer,td) {
	return { tok : td, pos : xhx.HaxeLexer.mkPos(lexer.curPos())};
}
xhx.HaxeLexer.__super__ = hxparse.Lexer;
xhx.HaxeLexer.prototype = $extend(hxparse.Lexer.prototype,{
	__class__: xhx.HaxeLexer
});
var xray = {}
xray.Client = function() { }
$hxClasses["xray.Client"] = xray.Client;
$hxExpose(xray.Client, "client");
xray.Client.__name__ = ["xray","Client"];
xray.Client.main = function() {
	haxe.macro.FieldKind;
	var http = new haxe.Http("neko.txt");
	http.onData = xray.Client.parseData;
	http.request();
}
xray.Client.model = null;
xray.Client.codeModel = null;
xray.Client.printer = null;
xray.Client.parseData = function(data) {
	xray.Client.model = haxe.Unserializer.run(data);
	xray.Client.codeModel = new dox.Model(Lambda.array(xray.Client.model.types));
	xray.Client.printer = new dox.Printer(xray.Client.codeModel);
	var search = js.Browser.document.getElementById("search");
	search.onkeyup = function(_) {
		xray.Client.filter(search.value);
	};
}
xray.Client.filter = function(query) {
	var search = js.Browser.document.getElementById("search");
	if(search.value != query) search.value = query;
	query = query.toLowerCase();
	var results = [];
	var $it0 = xray.Client.model.types.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		var id = key.toLowerCase();
		var name = id.split(".").pop();
		var type = xray.Client.model.types.get(key);
		if(query == name) {
			results = [type];
			break;
		}
		if(id.indexOf(query) > -1) results.push(type);
	}
	if(results.length > 1) {
		var chunks = [];
		xray.Client.currentId = -1;
		var _g = 0;
		while(_g < results.length) {
			var result = results[_g];
			++_g;
			var base = xray.TypeTools.baseType(result);
			if(base != null) {
				var name = base.pack.concat([base.name]).join(".");
				chunks.push("<li><a href=\"javascript:client.filter('" + name + "');\">" + name + "</a></li>");
			}
		}
		var output = js.Browser.document.getElementById("results");
		output.innerHTML = chunks.join("\n");
	} else {
		var result = results[0];
		var pos = dox.TypeTools.toBaseType(result).pos;
		var id = pos.file;
		if(id != xray.Client.currentId) {
			xray.Client.currentId = id;
			var file = xray.Client.model.files.get(id);
			var path = file.path;
			var source = file.source;
			var output = js.Browser.document.getElementById("results");
			output.innerHTML = "<pre><code>" + xray.Source.markup(source,path) + "</code></pre>";
		}
	}
}
xray.Client.currentId = null;
xray.RefModel = function(t) {
	this.t = t;
};
$hxClasses["xray.RefModel"] = xray.RefModel;
xray.RefModel.__name__ = ["xray","RefModel"];
xray.RefModel.of = function(inst) {
	return new xray.RefModel(inst);
}
xray.RefModel.prototype = {
	toString: function() {
		return Std.string(this.t);
	}
	,get: function() {
		return this.t;
	}
	,t: null
	,__class__: xray.RefModel
}
xray.Source = function(source,file) {
	this.active = true;
	this.defines = new haxe.ds.StringMap();
	this.source = source;
	this.max = 0;
	this.buf = new StringBuf();
	this.stack = [];
	var input = new haxe.io.StringInput(source);
	this.stream = new hxparse.LexerStream(new xhx.HaxeLexer(input,file),xhx.HaxeLexer.tok);
	this.defines.set("neko",true);
	this.defines.set("sys",true);
};
$hxClasses["xray.Source"] = xray.Source;
xray.Source.__name__ = ["xray","Source"];
xray.Source.markup = function(source,file) {
	if(source == "" || source == null) return "";
	var parser = new xray.Source(source,file);
	return parser.parse();
}
xray.Source.prototype = {
	parse: function() {
		var token = this.stream.peek();
		while(token.tok != xhx.TokenDef.Eof) {
			var $e = (token.tok);
			switch( $e[1] ) {
			case 2:
				var s = $e[2];
				this.add(token,"macro");
				if(s == "if") {
					this.stack.unshift(this.parseMacro());
					if(!this.stack[0]) this.skipTokens();
				} else if(s == "elseif") {
					var bool = this.parseMacro();
					if(this.stack[0]) this.skipTokens(); else {
						this.stack[0] = bool;
						if(!this.stack[0]) this.skipTokens();
					}
				} else if(s == "else") {
					if(this.stack[0]) this.skipTokens(); else this.stack[0] = true;
				} else if(s == "end") this.stack.shift();
				break;
			case 0:
				var token_ftok_eKwd_0 = $e[2];
				switch( (token_ftok_eKwd_0)[1] ) {
				case 1:
				case 13:
				case 26:
				case 40:
				case 32:
				case 34:
					this.add(token,"d");
					break;
				default:
					this.add(token,"k");
				}
				break;
			case 1:
				var token_ftok_eConst_0 = $e[2];
				var $e = (token_ftok_eConst_0);
				switch( $e[1] ) {
				case 3:
					var s = $e[2];
					switch(s) {
					case "trace":
						this.add(token,"k");
						break;
					default:
						var code = HxOverrides.cca(s,0);
						if(code > 64 && code < 91) this.add(token,"t"); else this.add(token,"i");
					}
					break;
				case 2:
					this.add(token,"s");
					break;
				default:
					this.add(token,"c");
				}
				break;
			case 7:
			case 6:
				this.add(token,"comment");
				break;
			default:
				this.add(token);
			}
			token = this.stream.peek();
		}
		return this.buf.b;
	}
	,skipTokens: function() {
		var token = this.stream.peek();
		var start = this.stack.length;
		try {
			while(token.tok != xhx.TokenDef.Eof) {
				if(this.stack.length == start) {
					var $e = (token.tok);
					switch( $e[1] ) {
					case 2:
						var token_ftok_eSharp_0 = $e[2];
						switch(token_ftok_eSharp_0) {
						case "elseif":case "else":case "end":
							throw "__break__";
							break;
						default:
						}
						break;
					default:
					}
				}
				var $e = (token.tok);
				switch( $e[1] ) {
				case 2:
					var token_ftok_eSharp_0 = $e[2];
					switch(token_ftok_eSharp_0) {
					case "if":
						this.add(token,"macro");
						this.stack.unshift(this.parseMacro());
						break;
					case "elseif":
						this.add(token,"macro");
						if(!this.stack[0]) this.stack[0] = this.parseMacro();
						break;
					case "else":
						this.add(token,"macro");
						if(!this.stack[0]) this.stack[0] = true;
						break;
					case "end":
						this.add(token,"macro");
						this.stack.shift();
						break;
					default:
						this.add(token,"inactive");
					}
					break;
				default:
					this.add(token,"inactive");
				}
				token = this.stream.peek();
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	}
	,parseMacro: function() {
		var token = this.stream.peek();
		return (function($this) {
			var $r;
			var $e = (token.tok);
			switch( $e[1] ) {
			case 1:
				var token_ftok_eConst_0 = $e[2];
				$r = (function($this) {
					var $r;
					var $e = (token_ftok_eConst_0);
					switch( $e[1] ) {
					case 3:
						var s = $e[2];
						$r = (function($this) {
							var $r;
							$this.add(token,"macro");
							$r = $this.defines.exists(s);
							return $r;
						}($this));
						break;
					default:
						$r = false;
					}
					return $r;
				}($this));
				break;
			case 0:
				var token_ftok_eKwd_0 = $e[2];
				$r = (function($this) {
					var $r;
					switch( (token_ftok_eKwd_0)[1] ) {
					case 41:
						$r = (function($this) {
							var $r;
							$this.add(token,"macro");
							$r = $this.defines.exists("macro");
							return $r;
						}($this));
						break;
					default:
						$r = false;
					}
					return $r;
				}($this));
				break;
			case 4:
				var token_ftok_eUnop_0 = $e[2];
				$r = (function($this) {
					var $r;
					switch( (token_ftok_eUnop_0)[1] ) {
					case 2:
						$r = (function($this) {
							var $r;
							$this.add(token,"macro");
							$r = !$this.parseMacro();
							return $r;
						}($this));
						break;
					default:
						$r = false;
					}
					return $r;
				}($this));
				break;
			case 18:
				$r = (function($this) {
					var $r;
					$this.add(token,"macro");
					var val = $this.parseMacro();
					token = $this.stream.peek();
					try {
						while(token.tok != xhx.TokenDef.Eof) {
							var $e = (token.tok);
							switch( $e[1] ) {
							case 5:
								var token_ftok_eBinop_0 = $e[2];
								switch( (token_ftok_eBinop_0)[1] ) {
								case 14:
									$this.add(token,"macro");
									val = val && $this.parseMacro();
									break;
								case 15:
									$this.add(token,"macro");
									val = val || $this.parseMacro();
									break;
								default:
									throw "invalid macro condition " + Std.string(token.tok);
								}
								break;
							case 19:
								$this.add(token,"macro");
								throw "__break__";
								break;
							default:
								throw "invalid macro condition " + Std.string(token.tok);
							}
							token = $this.stream.peek();
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
					$r = val;
					return $r;
				}($this));
				break;
			default:
				$r = false;
			}
			return $r;
		}(this));
	}
	,add: function(token,span) {
		if(token.pos.min > this.max) this.buf.b += Std.string(this.source.substring(this.max,token.pos.min));
		this.max = token.pos.max;
		var str = StringTools.htmlEscape(this.source.substring(token.pos.min,this.max));
		if(span == null) this.buf.b += Std.string(str); else this.buf.b += Std.string("<span class=\"" + span + "\">" + str + "</span>");
		this.stream.offset++;
	}
	,stack: null
	,stream: null
	,buf: null
	,max: null
	,source: null
	,defines: null
	,active: null
	,__class__: xray.Source
}
xray.TypeTools = function() { }
$hxClasses["xray.TypeTools"] = xray.TypeTools;
xray.TypeTools.__name__ = ["xray","TypeTools"];
xray.TypeTools.toString = function(type) {
	var base = xray.TypeTools.baseType(type);
	if(base != null) return base.pack.concat([base.name]).join(".");
	return Std.string(type);
}
xray.TypeTools.baseType = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 3:
			var type_eTType_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 2:
			var type_eTInst_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 1:
			var type_eTEnum_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		case 8:
			var type_eTAbstract_1 = $e[3], t = $e[2];
			$r = t.get();
			break;
		default:
			$r = null;
		}
		return $r;
	}(this));
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
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
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
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
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0, _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
}; else null;
if(Array.prototype.filter == null) Array.prototype.filter = function(f) {
	var a = [];
	var _g1 = 0, _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		var e = this[i];
		if(f(e)) a.push(e);
	}
	return a;
}; else null;
dox.Printer.baseurl = "http://localhost/mdk/doc";
dox.Printer.out = "doc";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
haxe.ds.ObjectMap.count = 0;
hxparse.LexEngine.MAX_CODE = 255;
hxparse.LexEngine.EMPTY = [];
hxparse.LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
js.Browser.location = typeof window != "undefined" ? window.location : null;
js.Browser.navigator = typeof window != "undefined" ? window.navigator : null;
xhx.HaxeLexer.keywords = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("abstract",xhx.Keyword.Abstract);
	_g.set("break",xhx.Keyword.Break);
	_g.set("case",xhx.Keyword.Case);
	_g.set("cast",xhx.Keyword.Cast);
	_g.set("catch",xhx.Keyword.Catch);
	_g.set("class",xhx.Keyword.Class);
	_g.set("continue",xhx.Keyword.Continue);
	_g.set("default",xhx.Keyword.Default);
	_g.set("do",xhx.Keyword.Do);
	_g.set("dynamic",xhx.Keyword.Dynamic);
	_g.set("else",xhx.Keyword.Else);
	_g.set("enum",xhx.Keyword.Enum);
	_g.set("extends",xhx.Keyword.Extends);
	_g.set("extern",xhx.Keyword.Extern);
	_g.set("false",xhx.Keyword.False);
	_g.set("for",xhx.Keyword.For);
	_g.set("function",xhx.Keyword.Function);
	_g.set("if",xhx.Keyword.If);
	_g.set("implements",xhx.Keyword.Implements);
	_g.set("import",xhx.Keyword.Import);
	_g.set("in",xhx.Keyword.In);
	_g.set("inline",xhx.Keyword.Inline);
	_g.set("interface",xhx.Keyword.Interface);
	_g.set("macro",xhx.Keyword.Macro);
	_g.set("new",xhx.Keyword.New);
	_g.set("null",xhx.Keyword.Null);
	_g.set("override",xhx.Keyword.Override);
	_g.set("package",xhx.Keyword.Package);
	_g.set("private",xhx.Keyword.Private);
	_g.set("public",xhx.Keyword.Public);
	_g.set("return",xhx.Keyword.Return);
	_g.set("static",xhx.Keyword.Static);
	_g.set("switch",xhx.Keyword.Switch);
	_g.set("this",xhx.Keyword.This);
	_g.set("throw",xhx.Keyword.Throw);
	_g.set("true",xhx.Keyword.True);
	_g.set("try",xhx.Keyword.Try);
	_g.set("typedef",xhx.Keyword.Typedef);
	_g.set("untyped",xhx.Keyword.Untyped);
	_g.set("using",xhx.Keyword.Using);
	_g.set("var",xhx.Keyword.Var);
	_g.set("while",xhx.Keyword.While);
	$r = _g;
	return $r;
}(this));
xhx.HaxeLexer.buf = new StringBuf();
xhx.HaxeLexer.ident = "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*";
xhx.HaxeLexer.idtype = "_*[A-Z][a-zA-Z0-9_]*";
xhx.HaxeLexer.tok = hxparse.Lexer.build([{ rule : "", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Eof);
}},{ rule : "[\r\n\t ]", func : function(lexer) {
	return lexer.token(xhx.HaxeLexer.tok);
}},{ rule : "0x[0-9a-fA-F]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CInt(lexer.current)));
}},{ rule : "[0-9]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CInt(lexer.current)));
}},{ rule : "[0-9]+.[0-9]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CFloat(lexer.current)));
}},{ rule : ".[0-9]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CFloat(lexer.current)));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CFloat(lexer.current)));
}},{ rule : "[0-9]+.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CFloat(lexer.current)));
}},{ rule : "[0-9]+...", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.IntInterval(HxOverrides.substr(lexer.current,0,-3)));
}},{ rule : "//[^\n\r]*", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.CommentLine(HxOverrides.substr(lexer.current,2,null)));
}},{ rule : "+\\+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Unop(haxe.macro.Unop.OpIncrement));
}},{ rule : "--", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Unop(haxe.macro.Unop.OpDecrement));
}},{ rule : "~", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Unop(haxe.macro.Unop.OpNegBits));
}},{ rule : "%=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMod)));
}},{ rule : "&=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAnd)));
}},{ rule : "|=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpOr)));
}},{ rule : "^=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpXor)));
}},{ rule : "+=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAdd)));
}},{ rule : "-=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpSub)));
}},{ rule : "*=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMult)));
}},{ rule : "/=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpDiv)));
}},{ rule : "==", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpEq));
}},{ rule : "!=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpNotEq));
}},{ rule : "<=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpLte));
}},{ rule : "&&", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpBoolAnd));
}},{ rule : "|\\|", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpBoolOr));
}},{ rule : "<<", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpShl));
}},{ rule : "->", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Arrow);
}},{ rule : "...", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpInterval));
}},{ rule : "=>", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpArrow));
}},{ rule : "!", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Unop(haxe.macro.Unop.OpNot));
}},{ rule : "<", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpLt));
}},{ rule : ">", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpGt));
}},{ rule : ";", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Semicolon);
}},{ rule : ":", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.DblDot);
}},{ rule : ",", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Comma);
}},{ rule : ".", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Dot);
}},{ rule : "%", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpMod));
}},{ rule : "&", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAnd));
}},{ rule : "|", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpOr));
}},{ rule : "^", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpXor));
}},{ rule : "+", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAdd));
}},{ rule : "*", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpMult));
}},{ rule : "/", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpDiv));
}},{ rule : "-", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpSub));
}},{ rule : "=", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Binop(haxe.macro.Binop.OpAssign));
}},{ rule : "[", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.BkOpen);
}},{ rule : "]", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.BkClose);
}},{ rule : "{", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.BrOpen);
}},{ rule : "}", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.BrClose);
}},{ rule : "(", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.POpen);
}},{ rule : ")", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.PClose);
}},{ rule : "?", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Question);
}},{ rule : "@", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.At);
}},{ rule : "\"", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf = new StringBuf();
		var pmin = lexer.curPos();
		var pmax = (function($this) {
			var $r;
			try {
				$r = lexer.token(xhx.HaxeLexer.string);
			} catch( e ) {
				if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
					$r = (function($this) {
						var $r;
						throw new xhx.LexerError(xhx.LexerErrorMsg.UnterminatedString,{ file : pmin.psource, min : pmin.pmin, max : pmin.pmax});
						return $r;
					}($this));
				} else throw(e);
			}
			return $r;
		}($this));
		var token = xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CString(xhx.HaxeLexer.buf.b)));
		token.pos.min = pmin.pmin;
		$r = token;
		return $r;
	}(this));
}},{ rule : "'", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf = new StringBuf();
		var pmin = lexer.curPos();
		var pmax = (function($this) {
			var $r;
			try {
				$r = lexer.token(xhx.HaxeLexer.string2);
			} catch( e ) {
				if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
					$r = (function($this) {
						var $r;
						throw new xhx.LexerError(xhx.LexerErrorMsg.UnterminatedString,{ file : pmin.psource, min : pmin.pmin, max : pmin.pmax});
						return $r;
					}($this));
				} else throw(e);
			}
			return $r;
		}($this));
		var token = xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CString(xhx.HaxeLexer.buf.b)));
		token.pos.min = pmin.pmin;
		$r = token;
		return $r;
	}(this));
}},{ rule : "~/", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf = new StringBuf();
		var pmin = lexer.curPos();
		var pmax = (function($this) {
			var $r;
			try {
				$r = lexer.token(xhx.HaxeLexer.regexp);
			} catch( e ) {
				if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
					$r = (function($this) {
						var $r;
						throw new xhx.LexerError(xhx.LexerErrorMsg.UnterminatedRegExp,{ file : pmin.psource, min : pmin.pmin, max : pmin.pmax});
						return $r;
					}($this));
				} else throw(e);
			}
			return $r;
		}($this));
		var token = xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CRegexp(xhx.HaxeLexer.buf.b,"")));
		token.pos.min = pmin.pmin;
		$r = token;
		return $r;
	}(this));
}},{ rule : "/\\*", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf = new StringBuf();
		var pmin = lexer.curPos();
		var pmax = (function($this) {
			var $r;
			try {
				$r = lexer.token(xhx.HaxeLexer.comment);
			} catch( e ) {
				if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
					$r = (function($this) {
						var $r;
						throw new xhx.LexerError(xhx.LexerErrorMsg.UnclosedComment,{ file : pmin.psource, min : pmin.pmin, max : pmin.pmax});
						return $r;
					}($this));
				} else throw(e);
			}
			return $r;
		}($this));
		var token = xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Comment(xhx.HaxeLexer.buf.b));
		token.pos.min = pmin.pmin;
		$r = token;
		return $r;
	}(this));
}},{ rule : "#_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Sharp(HxOverrides.substr(lexer.current,1,null)));
}},{ rule : "$_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Dollar(HxOverrides.substr(lexer.current,1,null)));
}},{ rule : "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer) {
	return (function($this) {
		var $r;
		var kwd = xhx.HaxeLexer.keywords.get(lexer.current);
		$r = kwd != null?xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Kwd(kwd)):xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CIdent(lexer.current)));
		return $r;
	}(this));
}},{ rule : "_*[A-Z][a-zA-Z0-9_]*", func : function(lexer) {
	return xhx.HaxeLexer.mk(lexer,xhx.TokenDef.Const(haxe.macro.Constant.CIdent(lexer.current)));
}}]);
xhx.HaxeLexer.string = hxparse.Lexer.build([{ rule : "\\\\\\\\", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\\";
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}},{ rule : "\\\\n", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\n";
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}},{ rule : "\\\\r", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\r";
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}},{ rule : "\\\\t", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\t";
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}},{ rule : "\\\\\"", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\"";
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}},{ rule : "\"", func : function(lexer) {
	return lexer.curPos().pmax;
}},{ rule : "[^\\\\\"]+", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.string);
		return $r;
	}(this));
}}]);
xhx.HaxeLexer.string2 = hxparse.Lexer.build([{ rule : "\\\\\\\\", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\\";
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}},{ rule : "\\\\n", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\n";
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}},{ rule : "\\\\r", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\r";
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}},{ rule : "\\\\t", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\t";
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}},{ rule : "\\\\'", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\"";
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}},{ rule : "'", func : function(lexer) {
	return lexer.curPos().pmax;
}},{ rule : "[^\\\\']+", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.string2);
		return $r;
	}(this));
}}]);
xhx.HaxeLexer.comment = hxparse.Lexer.build([{ rule : "*/", func : function(lexer) {
	return lexer.curPos().pmax;
}},{ rule : "*", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "*";
		$r = lexer.token(xhx.HaxeLexer.comment);
		return $r;
	}(this));
}},{ rule : "[^\\*]", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.comment);
		return $r;
	}(this));
}}]);
xhx.HaxeLexer.regexp = hxparse.Lexer.build([{ rule : "\\\\/", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "/";
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "\\\\r", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\r";
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "\\\\n", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\n";
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "\\\\t", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += "\t";
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "\\\\[\\$\\.*+\\^|{}\\[\\]()?\\-0-9]", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "\\\\[wWbBsSdDx]", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}},{ rule : "/", func : function(lexer) {
	return (function($this) {
		var $r;
		lexer.token(xhx.HaxeLexer.regexp_options);
		$r = lexer.curPos().pmax;
		return $r;
	}(this));
}},{ rule : "[^\\\\/\r\n]+", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.token(xhx.HaxeLexer.regexp);
		return $r;
	}(this));
}}]);
xhx.HaxeLexer.regexp_options = hxparse.Lexer.build([{ rule : "[gimsu]*", func : function(lexer) {
	return (function($this) {
		var $r;
		xhx.HaxeLexer.buf.b += Std.string(lexer.current);
		$r = lexer.curPos().pmax;
		return $r;
	}(this));
}}]);
xray.Client.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
