package edit.command;

class InsertSnippetCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var stops = ~/\$(?:\{(\d):(.+?)\}|(\d))/g;
		var vars = ~/\$([A-Z_]+)/;
		var contents:String = args.contents;
		
		var fields = [];
		var regionIndex = 0;

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
			
			var offset = 0;
			var a = 0;
			var b = 0;

			// find tab stop regions
			chars = stops.map(chars, function(ereg){
				var index = Std.parseInt(ereg.matched(1)) - 1;
				if (index == -1) index = fields.length;
				if (fields[index] == null) fields.insert(index, new RegionSet());
				var field = fields[index];

				a = b = (region.begin() + ereg.matchedPos().pos) - offset;
				if (ereg.matched(2) != null)
				{
					b += ereg.matched(2).length;
					field.add(new Region(a, b));
					offset += 5;
					return ereg.matched(2);
				}
				field.add(new Region(a, b));
				return "";
			});
			
			view.replace(edit, region, chars);
			
			region.a = fields[0].get(regionIndex).a;
			region.b = fields[0].get(regionIndex).b;
			regionIndex += 1;
		}

		view.fields = fields;
		view.currentField = 0;
		view.render();
	}
}
