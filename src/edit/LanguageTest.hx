package edit;

class LanguageTest
{
	static function main()
	{
		var source = sys.io.File.getContent("res/haxe.json");
		var language = new edit.Language(source);
		language.process("if (true) trace('hello!' + 'foo');");
	}
}