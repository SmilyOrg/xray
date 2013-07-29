package edit.command;

class InsertCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		for (region in view.selection) view.replace(edit, 
			new Region(region.begin(), region.end()), args.characters);
		view.render();
	}
}
