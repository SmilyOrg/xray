package edit.command;

class MoveToCommand extends TextCommand
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
		switch (args.to)
		{
			case "bol":
				region.b = view.line(region.b).a;
			case "eol":
				region.b = view.line(region.b).b;
			case "bof":
				region.b = 0;
			case "eof":
				region.b = view.size();
		}
		if (!args.extend) region.a = region.b;
	}
}
