package edit.command;

class UndoCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		if (view.edits.length > 0)
		{
			var edit = view.edits.shift();
			edit.undo();
			view.render();
		}
	}
}
