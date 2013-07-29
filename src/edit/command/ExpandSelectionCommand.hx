package edit.command;

class ExpandSelectionCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var to:String = args.to;

		switch (to)
		{
			case "line":
				for (region in view.selection)
				{
					var line = view.fullLine(region.b);
					region.a = line.a;
					region.b = line.b;
				}
			default:
		}
	}
}
