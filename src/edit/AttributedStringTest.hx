package edit;

class AttributedStringTest
{
	static function main()
	{
		var buf = new AttributedString("Hello World", ["foo" => "bar"]);
		buf.addAttributes(["baz" => "boo"], new Region(0,5));

		for (i in 0...buf.length)
		{
			trace(buf.string.charAt(i));
			trace(buf.attributesAtIndex(i));
		}
	}
}