package xhx;

import byte.ByteData;
import haxeparser.Data.Token;
import haxeparser.Data.TokenDef;
import haxeparser.HaxeLexer;
import hxparse.Parser.Parser;
import hxparse.Position;
import hxparse.TokenSource;
import haxe.macro.Expr;
using Lambda;
using StringTools;

typedef TypeExports = Map<String, Array<{name:String, pos:Array<Int>}>>;

class HaxeMarkup extends Parser<HaxeLexer, Token>
{
	public inline static var DIRECTIVE = "directive";
	public inline static var KEYWORD = "keyword";
	public inline static var IDENTIFIER = "identifier";
	public inline static var STRING = "string";
	public inline static var CONSTANT = "constant";
	public inline static var COMMENT = "comment";
	public inline static var MACRO = "macro";
	public inline static var TYPE = "type";

	public static function markup(source:String, file:String, exports:TypeExports)
	{
		if (source == "" || source == null) return "";
		var parser = new HaxeMarkup(source, file, exports);
		source = parser.parse();
		return '<code><pre>$source</pre></core>';
	}

	static function punion(p1:Position, p2:Position)
	{
		return {
			file: p1.file,
			min: p1.min < p2.min ? p1.min : p2.min,
			max: p1.max > p2.max ? p1.max : p2.max,
		};
	}

	function src(p:Position)
	{
		return source.substring(p.min, p.max);
	}

	var imports:Array<String>;
	var active:Bool;
	var defines:Map<String, Bool>;
	var source:String;
	var max:Int;
	var buf:StringBuf;
	var stack:Array<Bool>;
	var pad:Int;
	var exports:TypeExports;
	
	var module:String;
	var pack:String;
	var name:String;

	public function new(source:String, file:String, exports:TypeExports)
	{
		this.exports = exports;
		this.active = true;
		this.defines = new Map<String, Bool>();
		this.source = source;
		this.max = 0;
		this.buf = new StringBuf();
		this.stack = [];
		
		super(new HaxeLexer(ByteData.ofString(source), file), HaxeLexer.tok);
		
		//var input = new haxe.io.StringInput(source);
		//stream = new LexerStream(new HaxeLexer(input, file), HaxeLexer.tok);

		imports = ["StdTypes"];
		pad = Std.string(source.split("\n").length).length;
		defines.set("neko", true);
		defines.set("sys", true);

		var parts = file.substr(1, file.length - 4).split("/");
		module = parts.join(".");
		name = parts.pop();
		pack = parts.join(".");
	}

	public function add(token:Token, ?span:String)
	{
		// add any non token chars to buffer (whitespace etc.)
		if (token.pos.min > max)
		{
			var str = source.substring(max, token.pos.min);
			buf.add(str);
		}

		// add token string
		max = token.pos.max;
		var str = StringTools.htmlEscape(source.substring(token.pos.min, max));
		if (span == null)
		{
			buf.add(str);
		}
		else
		{
			var line = '</span>\n<span class="$span">';
			str = str.split("\n").join(line);

			if (span == TYPE)
			{
				var href = resolveType(str);
				if (href != null)
				{
					buf.add('<a href="$href"><span class="$span">$str</span></a>');
				}
				else
				{
					buf.add('<span class="$span">$str</span>');
				}
			}
			else
			{
				buf.add('<span class="$span">$str</span>');
			}
		}

		junk();
	}

	function isDefined(flag:String)
	{
		return true;
		return defines.exists(flag);
	}

	function parseMacro():Bool
	{
		var token = peek(0);
		return switch (token.tok)
		{
			case Const(CIdent(s)):
				add(token, MACRO);
				isDefined(s);
			case Kwd(KwdMacro):
				add(token, MACRO);
				defines.exists(MACRO);
			case Unop(OpNot):
				add(token, MACRO);
				!parseMacro();
			case POpen:
				add(token, MACRO);
				var val = parseMacro();
				token = peek(0);
				while (token.tok != Eof)
				{
					switch (token.tok)
					{
						case Binop(OpBoolAnd):
							add(token, MACRO);
							val = val && parseMacro();
						case Binop(OpBoolOr):
							add(token, MACRO);
							val = parseMacro() || val;
						case PClose:
							add(token, MACRO);
							break;
						case _:
							throw "invalid macro condition " + token.tok;
					}
					token = peek(0);
				}
				val;
			case _: false;
		}
	}

	public function parseTypeId():String
	{
		var tokens = [];
		var index = 0;
		var token = peek(0);

		while (token.tok != Eof)
		{
			tokens.push(token);

			switch (token.tok)
			{	
				case Const(CIdent(s)):
					var code = s.charCodeAt(0);
					if (code > 64 && code < 91)
					{
						//var token:Token = { tok: null, pos: punion(tokens[0].pos, tokens[tokens.length - 1].pos) };
						var token = new Token(null, punion(tokens[0].pos, tokens[tokens.length - 1].pos));
						add(token, TYPE);
						tokens.pop();
						for (token in tokens) junk();
						return src(token.pos);
					}
				case Kwd(KwdMacro), Dot:
				case _:
					return null;
			}

			index += 1;
			token = peek(index);
		}

		return null;
	}

	public function skipTokens()
	{
		var token = peek(0);
		var start = stack.length;

		while (token.tok != Eof)
		{
			if (stack.length == start)
			{
				switch (token.tok)
				{
					case Sharp("elseif"), Sharp("else"), Sharp("end"): break;
					case _:
				}
			}
			
			switch (token.tok)
			{
				case Sharp("if"):
					add(token, MACRO);
					stack.unshift(parseMacro());
				case Sharp("elseif"):
					add(token, MACRO);
					if (!stack[0]) stack[0] = parseMacro();
				case Sharp("else"):
					add(token, MACRO);
					if (!stack[0]) stack[0] = true;
				case Sharp("end"):
					add(token, MACRO);
					stack.shift();
				case _:
					add(token, "inactive");
			}

			token = peek(0);
		}
	}

	public function parse()
	{
		var token = peek(0);

		while (token.tok != Eof)
		{
			switch (token.tok)
			{
				case Sharp(s):
					add(token, MACRO);

					if (s == "if")
					{
						stack.unshift(parseMacro());
						if (!stack[0]) skipTokens();
					}
					else if (s == "elseif")
					{
						var bool = parseMacro();
						if (stack[0])
						{
							skipTokens();
						}
						else
						{
							stack[0] = bool;
							if (!stack[0]) skipTokens();
						}
					}
					else if (s == "else")
					{
						if (stack[0])
						{
							skipTokens();
						}
						else
						{
							stack[0] = true;
						}
					}
					else if (s == "end")
					{
						stack.shift();
					}
				case Kwd(KwdImport):
					add(token, DIRECTIVE);
					imports.push(parseTypeId());

				case Kwd(KwdClass), Kwd(KwdEnum), Kwd(KwdAbstract), Kwd(KwdTypedef), Kwd(KwdPackage):
					add(token, DIRECTIVE);
				case Kwd(_), Const(CIdent("trace")):
					add(token, KEYWORD); 
				case Const(CIdent(s)):
					if (parseTypeId() == null) add(token, IDENTIFIER); 
				case Const(CString(_)):
					add(token, STRING); 
				case Const(_):
					add(token, CONSTANT); 
				case CommentLine(_), Comment(_):
					add(token, COMMENT); 
				case _:
					add(token);
			}
			
			token = peek(0);
		}

		var pad = 4;
		var l = 1;
		var lines = buf.toString().split("\n");
		buf = new StringBuf();
		for (line in lines)
		{
			var num = StringTools.lpad(Std.string(l), " ", pad);
			num = '<span class="num">$num</span>';
			buf.add('<span id="L$l">' + num + " " + line + "</span>\n");
			l += 1;
		}
		
		return buf.toString();
	}

	function resolveHref(module:String, pos:Array<Int>)
	{
		return "#/" + module.split(".").join("/") + ".hx:" + pos.join("-");
	}

	function resolveType(type:String)
	{
		if (type == name) return resolveHref(module, exports.get(module)[0].pos);

		// current module
		if (exports.exists(module))
		{
			for (export in exports.get(module))
			{
				if (export.name == type)
				{
					return resolveHref(module, export.pos);
				}
			}
		}

		// imports
		for (i in imports)
		{
			if (!exports.exists(i))
			{
				// trace('No export for import $i');
				return null;
			}

			for (export in exports.get(i))
			{
				if (export.name == type)
				{
					return resolveHref(i, export.pos);
				}
			}
		}

		// top level or fully qualified
		if (exports.exists(type))
		{
			// trace('Found $type in top level');
			return resolveHref(type, exports.get(type)[0].pos);
		}

		// package
		var name = pack + "." + type;
		
		if (exports.exists(name))
		{
			// trace('Found $type in current package');
			return resolveHref(name, exports.get(name)[0].pos);
		}

		// trace('couldn\'t find $type');
		return null;
	}
}
