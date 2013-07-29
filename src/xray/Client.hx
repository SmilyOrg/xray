package xray;

import haxe.macro.Type;
import js.html.InputElement;
using xray.TypeTools;
using xray.Data;
using Lambda;
using StringTools;

typedef TypeExports = Map<String, Array<{name:String, pos:Array<Int>}>>;

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
	var export:TypeExports;
	var styles:js.html.StyleElement;

	function new()
	{
		files = new Map();

		var window = js.Browser.window;
		window.addEventListener("hashchange", updateLocation);

		styles = cast js.Browser.document.getElementById("dynamicStylesheet");
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

	function clearLines()
	{
		if (styles.firstChild != null) styles.removeChild(styles.firstChild);
	}

	function highlightLines(min:Int, max:Int)
	{
		var lines = "";
		for (i in min...max + 1) lines += '#L$i { background: #444; } ';
		styles.appendChild(js.Browser.document.createTextNode(lines));
		trace(min + ":" + max);
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

	var line:Int;

	function showPath(url:String)
	{
		clearLines();
		
		var parts = url.split(":");
		line = -1;
		if (parts.length > 1)
		{
			url = parts[0];
			var lines = parts[1].split("-");

			var min = Std.parseInt(lines[0]);
			var max = lines.length > 1 ? Std.parseInt(lines[1]) : min;
			highlightLines(min, max);

			line = min;
		}

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
		if (line > -1) js.Browser.document.getElementById("L" + line).scrollIntoView();
		else js.Browser.document.getElementById("L1").scrollIntoView();
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
