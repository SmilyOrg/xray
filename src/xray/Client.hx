package xray;

import haxe.macro.Type;

import js.html.InputElement;
using xray.TypeTools;
using xray.Data;
using Lambda;
using StringTools;

@:expose('client') class Client
{
	public static function main()
	{
		FieldKind;
		RefData;
		new Client();
	}

	var model:Model;
	var sources:Array<SourceFile>;
	var files:Map<String, String>;
	var output:js.html.DivElement;
	var export:Map<String, Array<String>>;

	function new()
	{
		files = new Map();

		var window = js.Browser.window;
		window.addEventListener("hashchange", updateLocation);

		output = cast js.Browser.document.getElementById("results");
		loadSources();
	}

	function loadSources()
	{
		var http = new haxe.Http("source.txt");
		http.onData = parseSources;
		http.request();
	}

	function parseSources(data:String)
	{
		// var unserializer = new Unserializer(data);
		// model = unserializer.getModel();

		sources = haxe.Unserializer.run(data);
		loadExport();
	}

	function loadExport()
	{
		var http = new haxe.Http("export.txt");
		http.onData = parseExport;
		http.request();
	}

	function parseExport(data)
	{
		export = haxe.Unserializer.run(data);
		updateLocation(null);
	}

	function updateLocation(_)
	{
		var window = js.Browser.window;
		var path = window.location.pathname;
		var hash = window.location.hash;
		var file = hash.substr(1);
		showPath(file);
	}

	function showPath(url:String)
	{
		var matches = [];

		for (source in sources)
		{
			if (StringTools.startsWith(source.local, url))
			{
				matches.push(source);
			}
		}

		if (matches.length == 0) return;
		
		if (matches.length == 1)
		{
			showSource(matches[0].local);
		}
		else
		{
			var items = matches.map(function(source){
				return '<a href="#${source.local}">${source.local}</a>';
			});
			output.innerHTML = '<pre>' + items.join('\n') + '</pre>';
		}
	}

	function showSource(url:String)
	{
		if (!files.exists(url))
		{
			loadSource(url);
			return;
		}

		output.innerHTML = xhx.HaxeMarkup.markup(files.get(url), url, export);
	}

	function loadSource(url:String)
	{
		var http = new haxe.Http("src" + url);
		http.onData = sourceLoaded.bind(_, url);
		http.request();
	}

	function sourceLoaded(data:String, url:String)
	{
		files.set(url, data);
		showSource(url);
	}
}
