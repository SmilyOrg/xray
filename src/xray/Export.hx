package xray;

import haxe.macro.Context;
import haxe.macro.Type;
import haxe.macro.Expr;
using xray.TypeTools;

typedef TypeExports = Map<String, Array<{name:String, pos:Array<Int>}>>;

/**
	Generates a model of exportable types, methods and enumvalues.
**/
class Export
{
	public static function build()
	{
		Import.importAll();
		Context.onGenerate(generate);
	}

	public static function generate(types:Array<Type>)
	{
		var module = new Map<String, Array<{name:String, pos:Array<Int>}>>();

		for (type in types)
		{
			var base = type.toBaseType();
			if (!module.exists(base.module))
				module.set(base.module, []);
			var pos = getPos(base.pos);
			module.get(base.module).push({name:type.getName(), pos:pos});
		}

		var data = haxe.Serializer.run(module);
		sys.io.File.saveContent("pages/export.txt", data);
		// trace(module.get("StdTypes"));
	}

	static function getPos(position:Position)
	{
		var pat = ~/:([0-9]+): (lines|characters) [0-9]+\-([0-9]+)/;
		if (pat.match(Std.string(position)))
		{
			var min = Std.parseInt(pat.matched(1));
			var pos = [min];
			if (pat.matched(2) == "lines") pos.push(Std.parseInt(pat.matched(3)));
			return pos;
		}
		
		return [1, 1];
	}
}