package edit.command;

class MoveCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		for (region in view.selection) moveRegion(region, args);
		view.render();
		// trace("word: >" + view.substr(view.word(view.selection.get(0).b)) + "<");
	}

	function moveRegion(region:Region, args:Dynamic)
	{
		var dir = args.forward ? 1 : -1;
		var index = region.b;

		switch (args.by)
		{
			case "lines":
				if (!args.extend && region.size() > 0)
				{
					index = dir < 0 ? region.begin() : region.end();
				}

				var line = view.fullLine(index);
				var col = index - line.a;
				
				if (dir > 0)
				{
					var next = view.line(line.b);
					region.b = next.a + col;
					if (region.b > next.b) region.b = next.b;
				}
				else
				{
					var prev = view.line(line.a - 1);
					region.b = prev.a + col;
					if (region.b > prev.b) region.b = prev.b;
				}
			case "characters":
				if (!args.extend && region.size() > 0)
				{
					index = dir < 0 ? region.begin() : region.end();
					dir = 0;
				}
				
				region.b = index + dir;
			case "words":
				var word = view.word(index + dir);
				if (dir == -1) region.b = word.a;
				else region.b = word.b;
			case "word_ends":
				var word = view.word(index + dir);
				if (dir == -1) region.b = word.a;
				else region.b = word.b;
			default:
		}

		if (region.b < 0) region.b = 0;
		if (region.b > view.size()) region.b = view.size();
		if (!args.extend) region.a = region.b;
	}
}