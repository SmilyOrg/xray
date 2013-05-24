package xray;

import haxe.macro.Context;
import haxe.macro.Type;

class Inspector
{
	static function processType(type:Type)
	{
		if (type == null) return;

		switch (type)
		{
			case TType(t, _): processDefType(t.get());
			case TMono(t): processType(t.get());
			case TLazy(f): processType(f());
			case TInst(t, _): processClassType(t.get());
			case TFun(args, ret): processFunction(args, ret);
			case TEnum(t, _): processEnumType(t.get(););
			case TDynamic(t): processType(t.get());
			case TAnonymous(t): processAnonType(a.get());
			case TAbstract(t, _): processAbstractType(t.get());
		}
	}

	static function processDefType(type:ClassType)
	{

	}

	static function processClassType(type:ClassType)
	{
		
	}

	static function processEnumType(type:EnumType)
	{
		
	}

	static function processAnonType(type:AnonType)
	{

	}

	static function processAbstractType(type:AbstractType)
	{

	}

	static function processFunction(args:Array<{ t : Type, opt : Bool, name : String }>, ret:Type)
	{

	}
}
