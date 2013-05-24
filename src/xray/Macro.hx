package xray;

import haxe.macro.Context;
import haxe.macro.Type;
import haxe.macro.Expr;
import sys.FileSystem;
using Lambda;
using StringTools;

import xray.Data;
using xray.Tools;

class Macro
{
	static var platform = getPlatform();

	public static function build()
	{
		Sys.println(platform);

		var classPaths = Context.getClassPath();
		classPaths = classPaths.filter(FileSystem.exists);
		classPaths = classPaths.map(normalizePath);
		for (path in classPaths) includePath(path);

		Context.onGenerate(generate);
	}

	static function getPlatform()
	{
		var platforms = ["js", "flash8", "flash", "cpp", "cs", "java", "neko", "php"];
		for (platform in platforms)
			if (Context.defined(platform)) return platform;
		throw "Unknown platform";
	}

	static function normalizePath(path:String)
	{
		path = path.split("\\").join("/");
		if (StringTools.endsWith(path, "/"))
			path = path.substr(0, -1);
		if (path == "")
			path = ".";
		return path;
	}

	static function includePath(path:String, ?pack:String="")
	{
		if (path == "src") return;
		if (path == ".") return;
		if (path.endsWith("_std")) return;
		
		for (file in FileSystem.readDirectory(path))
		{
			if (file == "web") continue;
			if (file == "SocketWrapper.hx") continue;
			if (file == "SyncSocketConnection.hx") continue;
			if (file == "ExampleJSGenerator.hx") continue;

			if (file.charAt(0) == "_" || file.charAt(0) == "." || file.indexOf("-") > -1) continue;
			var entry = path + "/" + file;

			if (FileSystem.isDirectory(entry))
			{
				if (path == "/usr/lib/haxe/std" && file != platform && file != "haxe") continue;
				includePath(entry, (pack == "" ? file : pack + "." + file));
			}
			else
			{
				if (!file.endsWith(".hx")) continue;

				var module = file.substr(0, -3);
				module = (pack == "" ? module : pack + "." + module);
				Context.getModule(module);
			}
		}
	}

	static function generate(types:Array<Type>)
	{
		for (type in types)
		{
			var base = type.baseType();
			if (base == null) continue;

			var pos = Context.getPosInfos(base.pos);
			if (pos.file != "/usr/lib/haxe/std/haxe/Http.hx") continue;

			processType(type);
		}

		return;

		types = types.map(typeModel);

		var models = new Map<String, Dynamic>();
		var sources = new Map<Int, {path:String, source:String}>();
		
		for (type in types)
		{
			var base = type.baseType();
			if (base == null) continue;

			var key = typeId(base);
			models.set(key, type);

			var num = untyped base.pos.file;
			
			if (!sources.exists(num))
			{
				var path = fileByNum.get(num);
				
				var source = sys.io.File.getContent(path);
				sources.set(num, {path:path, source:source});
			}
		}

		var model = {types:models, files:sources};

		haxe.Serializer.USE_CACHE = true;
		var data = haxe.Serializer.run(model);
		sys.io.File.saveContent("bin/"+platform+".txt", data);
	}

	static var cache = new Map<String, Type>();

	static function typeModel(type:Type):Type
	{
		if (type == null) return type;

		var base = type.baseType();
		var id:String = null;

		if (base != null)
		{
			id = typeId(base);
			if (cache.exists(id)) return cache.get(id);
		}

		var ref = new RefModel<Dynamic>(null);
		var result = switch (type)
		{
			case TInst(t, params):
				TInst(ref, params.map(typeModel));
			case TType(t, params):
				TType(ref, params.map(typeModel));
			case TMono(t):
				TMono(ref);
			case TEnum(t, params):
				TEnum(ref, params.map(typeModel));
			case TAbstract(t, params):
				TAbstract(ref, params.map(typeModel));
			case TFun(args, ret):
				TFun(args.map(argModel), typeModel(ret));
			case TDynamic(t):
				TDynamic(typeModel(t));
			case TAnonymous(a):
				Type.TAnonymous(ref);
			case _:
				trace(type); null;
		}
		
		if (id != null)
		{
			cache.set(id, result);
		}

		switch (type)
		{
			case TInst(t, _):
				ref.t = classTypeModel(t.get());
			case TType(t, _):
				ref.t = defTypeModel(t.get());
			case TMono(t):
				ref.t = typeModel(t.get());
			case TEnum(t, _):
				ref.t = enumTypeModel(t.get());
			case TAbstract(t, _):
				ref.t = baseTypeModel(t.get());
			case TAnonymous(a):
				ref.t = anonTypeModel(a.get());
			case _:
		}

		return result;
	}

	static function argModel(arg:{t:Type, opt:Bool, name:String})
	{
		arg = Reflect.copy(arg);
		arg.t = typeModel(arg.t);
		return arg;
	}

	static function baseTypeModel<T:BaseType>(t:T):T
	{
		t = Reflect.copy(t);
		untyped
		{
			t.__t = null;
			t.pos = getPos(t.pos);
			t.params = [];
			t.meta = null;
			t.exclude = null;
		}
		return t;
	}

	static function defTypeModel(t:DefType):DefType
	{
		t = baseTypeModel(t);
		untyped
		{
			t.type = typeModel(t.type);
		}
		return t;
	}

	static function classTypeModel(t:ClassType):ClassType
	{
		t = baseTypeModel(t);
		
		untyped
		{
			if (t.superClass != null)
			{
				t.superClass = classRefModel(t.superClass);
			}

			t.statics = RefModel.of(t.statics.get().map(classFieldModel));
			t.kind = null;
			t.interfaces = t.interfaces.map(classRefModel);
			t.init = null;
			t.fields = RefModel.of(t.fields.get().map(classFieldModel));
			t.exclude = null;

			if (t.constructor != null)
			{
				t.constructor = RefModel.of(classFieldModel(t.constructor.get()));
			}
		}
		return t;
	}

	static function classRefModel(ref:{t:Ref<ClassType>, params:Array<Type>})
	{
		return {
			t:RefModel.of(classTypeModel(ref.t.get())),
			params:ref.params.map(typeModel)
		}
	}

	static function classFieldModel(t:ClassField):ClassField
	{
		t = Reflect.copy(t);
		untyped
		{
			t.type = typeModel(t.type);
			t.pos = getPos(t.pos);
			t.params = [];
			t.meta = null;
			t.expr = null;
		}
		return t;
	}

	static function enumTypeModel(t:EnumType):EnumType
	{
		t = baseTypeModel(t);
		untyped
		{
			t.exclude = null;
			var constructs = t.constructs;
			t.constructs = new Map<String, EnumField>();
			for (key in constructs.keys())
				t.constructs.set(key, enumFieldModel(constructs.get(key)));
		}
		return t;
	}

	static function enumFieldModel(f:EnumField):EnumField
	{
		f = Reflect.copy(f);
		untyped
		{
			f.type = typeModel(f.type);
			f.pos = getPos(f.pos);
			f.params = [];
			f.meta = null;
		}
		return f;
	}

	static function anonTypeModel(t:AnonType):AnonType
	{
		t = Reflect.copy(t);
		t.fields = t.fields.map(classFieldModel);
		return t;
	}

	static function typeId(type:BaseType):String
	{
		return typePath(type).join(".");
	}

	static function typePath(type:BaseType):Array<String>
	{
		var path = type.pack.copy();
		path.push(type.name);
		return path;
	}

	static var numFiles = 0;
	static var files = new Map<String, Int>();
	static var fileByNum = new Map<Int, String>();

	static function getPos(pos:Position)
	{
		var info = Context.getPosInfos(pos);
		var num:Int = 0;

		if (files.exists(info.file))
		{
			num = files.get(info.file);
		}
		else
		{
			numFiles ++;
			num = numFiles;
			files.set(info.file, num);
			fileByNum.set(num, info.file);
		}

		return {file:num, min:info.min, max:info.max};
	}
}
