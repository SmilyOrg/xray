package xray;

import haxe.macro.Context;
import haxe.macro.Type;
using xray.TypeTools;

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
		var module = new Map<String, Array<String>>();

		for (type in types)
		{
			var base = type.toBaseType();
			if (!module.exists(base.module))
				module.set(base.module, []);
			module.get(base.module).push(type.getName());
		}

		var data = haxe.Serializer.run(module);
		sys.io.File.saveContent("pages/export.txt", data);
		// trace(module.get("StdTypes"));
	}
}