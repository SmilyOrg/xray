package edit.command;

class IncreaseFontSizeCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		view.fontSize += 1;
		view.generateFont();
		view.render();
	}
}
