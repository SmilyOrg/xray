package edit.command;

class LoadCommand extends TextCommand
{
	public function new(view:View)
	{
		super(view);
	}

	public function run(args:Dynamic)
	{
		var http = new haxe.Http(args.url);
		http.onData = function(data:String) view.setContent(data); 
		http.request();
	}
}
