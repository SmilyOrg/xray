package edit.command;

class LoadCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(edit:edit.Edit, args:Dynamic)
	{
		var http = new haxe.Http(args.url);
		http.onData = function(data:String) view.setContent(data); 
		http.request();
	}
}
