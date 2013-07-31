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
		var vars = ~/\$[A-Z_]+/;
		var contents:String = args.contents;
		
		var fields = [];
		var regionIndex = 0;

		for (region in view.selection)
		{
			var chars = contents;

			// replace vars in snippet
			chars = vars.map(chars, function(ereg){
				return getVariable(ereg.matched(0), region);
			});
			
			var offset = 0;
			var a = 0;
			var b = 0;

			// find tab stop regions
			chars = stops.map(chars, function(ereg){
				var num = ereg.matched(1);
				if (num == null) num = ereg.matched(3);
				var index = Std.parseInt(num);
				if (fields[index] == null) fields[index] = new RegionSet();
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

			if (fields[0] == null) fields[0] = new RegionSet();
			if (fields[0].get(regionIndex) == null)
			{
				var exit = region.a + chars.length;
				fields[0].add(new Region(exit, exit));
			}
			
			view.replace(edit, region, chars);
			regionIndex += 1;
		}

		if (fields.length > 1) fields.push(fields.shift());
		view.fields = fields;
		view.selection = fields[0].clone();
		view.currentField = 0;
		view.render();
	}

	function getVariable(name:String, region:Region):String
	{
		return switch (name)
		{
			case "$SELECTION", "$SELECTED_TEXT": view.substr(region);
			case "$CURRENT_LINE": view.substr(view.line(region.b));
			case "$CURRENT_WORD": view.substr(view.word(region.b));
			case "$FILENAME": "Todo.hx";
			case "$FILEPATH": "/ws/project/src/Todo.hx";
			case "$FULLNAME": "David Peek";
			case "$LINE_INDEX": Std.string(view.getPosition(region.b).row);
			case "$LINE_NUMBER": Std.string(view.getPosition(region.b).row + 1);
			case "$SOFT_TABS": "NO";
			case "$TAB_SIZE": Std.string(4);
			default: name;
		}
	}
}
