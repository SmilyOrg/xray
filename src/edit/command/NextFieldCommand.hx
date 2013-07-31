package edit.command;

class NextFieldCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		view.currentField += 1;
		view.selection = view.fields[view.currentField].clone();
		view.render();
		
		if (view.currentField == view.fields.length - 1)
		{
			view.fields = [];
			view.currentField = 0;
		}
	}
}
