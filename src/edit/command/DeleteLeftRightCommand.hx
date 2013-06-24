package edit.command;

class DeleteLeftRightCommand extends TextCommand
{
	public function new(view:Editor)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		view.runCommand("left_delete", {});
		view.runCommand("right_delete", {});
	}
}
