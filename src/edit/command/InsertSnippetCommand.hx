package edit.command;

class InsertSnippetCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var stops = ~/\$(?:\{(\d):(.+?)\}|(\d))/;
		var vars = ~/\$([A-Z_]+)/;

		var contents:String = args.contents;
		
		// var size = characters.length;
		// var index = size;
		// if (ereg.match(contents)) index = ereg.matchedPos().pos;
		
		// var offset = 0;
		for (region in view.selection)
		{
			var chars = contents;

			// replace vars in snippet
			chars = vars.map(chars, function(ereg){
				return switch (ereg.matched(1))
				{
					case "SELECTION": view.substr(region);
					default: ereg.matched(0);
				}
			});

			var pos = region.begin();
			var a = 0;
			var b = 0;

			// find tab stop regions
			chars = stops.map(chars, function(ereg){
				a = b = region.begin() + ereg.matchedPos().pos;
				if (ereg.matched(2) != null)
				{
					b += ereg.matched(2).length;
					return ereg.matched(2);
				}
				return "";
			});
			trace(">"+chars);
			if (region.size() > 0) view.erase(edit, region);
			view.insert(edit, pos, chars);
			
			region.a = a;
			region.b = b;
		}

		view.render();
	}
}
