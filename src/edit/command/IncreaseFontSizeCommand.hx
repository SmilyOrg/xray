package edit.command;

class IncreaseFontSizeCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		view.fontSize += 1;
		view.render();
	}
}
