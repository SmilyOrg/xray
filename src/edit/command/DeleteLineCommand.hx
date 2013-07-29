package edit.command;

class DeleteLineCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		view.runCommand("expand_selection", {to:"line"});
		// view.runCommand("add_to_kill_ring", {forward:true});
		view.runCommand("left_delete");
	}
}
