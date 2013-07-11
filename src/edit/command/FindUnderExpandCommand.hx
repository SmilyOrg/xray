package edit.command;

class FindUnderExpandCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		var last = view.selection.last();
		var term = view.substr(last);
		var index = view.buffer.content.indexOf(term, last.end());
		if (index == -1) return;
		view.selection.add(new Region(index, index + last.size()));
		view.render();
	}
}
