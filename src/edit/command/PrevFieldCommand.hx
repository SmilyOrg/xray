package edit.command;

class PrevFieldCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		view.currentField -= 1;
		view.selection = view.fields[view.currentField].clone();
		view.render();
	}
}
