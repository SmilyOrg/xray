package edit.command;

class InsertSnippetCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var ereg = ~/\$\d/g;
		var contents:String = args.contents;
		var characters:String = ereg.replace(contents, "");
		
		var size = characters.length;
		var index = size;
		if (ereg.match(contents)) index = ereg.matchedPos().pos;
		
		var offset = 0;
		for (region in view.selection)
		{
			view.buffer.insert(region.begin() + offset, region.size(), characters);
			region.a = region.b = offset + region.begin() + index;
			offset += region.size() - size;
		}
		view.render();
	}
}
