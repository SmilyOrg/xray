package edit.command;

class DecreaseFontSizeCommand extends TextCommand
{
	public function new(view:Editor)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		if (view.fontSize <= 6) return;
		view.fontSize -= 1;
		view.generateFont();
		view.render();
	}
}
