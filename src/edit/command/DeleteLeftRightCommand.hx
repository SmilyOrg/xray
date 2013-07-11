package edit.command;

class DeleteLeftRightCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		view.runCommand("left_delete", {});
		view.runCommand("right_delete", {});
	}
}
