package res;

import haxe.Http;

class Test
{
	// this is a comment!
	static function main() trace("Hello" + "World");
}

enum MyEnum
{
	MyValue;
}

abstract MyAbstract(String)
{
	public function new()
	{
		this = "";
	}
}

typedef MyTypedef =
{
	var field:String
}