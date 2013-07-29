package edit.command;

class AddLineInBracesCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		view.runCommand("insert", {characters:"\n\t\n"});
		view.runCommand("move", {by:"lines", forward:false});
		view.runCommand("move_to", {to:"eol", extend:false});
		view.runCommand("reindent", {single_line:true});
	}
}
