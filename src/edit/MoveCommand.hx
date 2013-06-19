package edit;

class MoveCommand extends TextCommand
{
	public function new(view:Editor)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		for (region in view.selection) moveRegion(region, args);
		view.render();
	}

	function moveRegion(region:Region, args:Dynamic)
	{
		var dir = args.forward ? 1 : -1;
		var extend = args.extend;
		var index = region.b;

		switch (args.by)
		{
			case "lines":
				var line = view.fullLine(index);
				var col = index - line.a;
				
				if (dir > 0)
				{
					var next = view.line(line.b);
					trace(next);
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
				region.b = index + dir;
			default:
		}

		if (!extend) region.a = region.b;
	}
}