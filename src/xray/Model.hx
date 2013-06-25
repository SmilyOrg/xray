package xray;

import haxe.macro.Type;

class Model
{
	public var type(default, null):Map<String, Type>;
	public var baseType(default, null):Map<String, BaseType>;
	public var file(default, null):Map<String, String>;

	public function new()
	{
		type = new Map();
		baseType = new Map();
		file = new Map();
	}
}
