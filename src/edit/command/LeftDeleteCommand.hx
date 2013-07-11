package edit.command;

class LeftDeleteCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		for (region in view.selection)
		{
			if (!region.isEmpty())
			{
				view.runCommand("insert", {characters:""});
				return;
			}
		}

		for (region in view.selection)
		{
			if (region.a > 0) region.a -=1;
		}
		
		view.runCommand("insert", {characters:""});
	}
}
