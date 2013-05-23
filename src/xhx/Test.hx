package xhx;

class Test
{
	static function main()
	{
		// var src = "var url_regexp = ~/^(https?:\\/\\/)?([a-zA-Z\\.0-9-]+)(:[0-9]+)?(.*)$/;";
		var src = "var a = #if neko 10 #end + 20";
		trace(xray.Source.markup(src, "Test.hx"));
	}
}