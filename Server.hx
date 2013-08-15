class Server
{
	static function main() new Server();

	var params:Map<String, String>;

	public function new()
	{
		params = neko.Web.getParams();

		try run() catch (msg:String) error(msg);
	}

	function run()
	{
		var action = param('action');

		switch (action)
		{
			case 'files':
				getFiles(param('hxml'));
			default:
		}
	}

	function error(msg:String)
	{
		result({error:{msg:msg}});
	}

	function result(data:Dynamic)
	{
		Sys.print(haxe.Json.stringify(data));
	}

	function param(key:String):String
	{
		if (!params.exists(key)) throw 'no param \'$key\'';
		return params.get(key);
	}

	function getFiles(hxml:String)
	{
		var args = hxml.split(' ');
		
	}
}