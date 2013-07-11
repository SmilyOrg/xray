package edit.command;

class SelectAllCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		view.selection.clear();
		view.selection.add(new Region(0, view.size()));
		view.render();
	}
}
