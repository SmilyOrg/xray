package edit.command;

class SingleSelectionCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var first = view.selection.get(0);
		view.selection.clear();
		view.selection.add(first);
		view.render();
	}
}
