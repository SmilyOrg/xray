package edit.command;

class DuplicateLineCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		for (region in view.selection)
		{
			if (region.isEmpty())
			{
				var line = view.line(region.a);
				var content = view.substr(line) + "\n";
				view.insert(null, line.begin(), content);
			}
			else
			{
				view.insert(null, region.begin(), view.substr(region));
			}
		}
		
		view.render();
	}
}
