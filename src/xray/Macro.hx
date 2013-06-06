package xray;

import haxe.macro.Context;
import haxe.macro.Type;

class Macro
{
	public static function build()
	{
		Import.importAll();
		Context.onGenerate(generate);
	}

	static function generate(types:Array<Type>)
	{
		var model = new Processor().process(types);
		var serializer = new Serializer();
		serializer.serialize(model);
		sys.io.File.saveContent("pages/" + Import.platform + ".txt",  serializer.toString());
	}
}
