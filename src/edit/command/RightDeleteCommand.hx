package edit.command;

class RightDeleteCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run()
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
			if (region.b < view.size()) region.b += 1;
		}
		
		view.runCommand("insert", {characters:""});
	}
}
