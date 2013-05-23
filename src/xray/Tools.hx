package xray;

import haxe.macro.Type;

class TypeTools
{
	public static function toString(type:Type):String
	{
		var base = baseType(type);
		if (base != null) return base.pack.concat([base.name]).join(".");
		return Std.string(type);
	}

	public static function baseType(type:Type):BaseType
	{
		return switch (type)
		{
			case TType(t, _): t.get();
			case TInst(t, _): t.get();
			case TEnum(t, _): t.get();
			case TAbstract(t, _): t.get();
			case _: null;
		}
	}
}