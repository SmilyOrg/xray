package edit.command;

class InsertCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		var characters:String = args.characters;
		
		var offset = 0;
		var size = characters.length;
		for (region in view.selection)
		{
			var delta = size - region.size();
			view.replace(view.edit, new Region(region.begin() + offset, region.end() + offset), characters);
			region.a = region.b = offset + region.begin() + size;
			offset += delta;
		}
		view.render();
	}
}
