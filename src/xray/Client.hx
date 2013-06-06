package xray;

import haxe.macro.Type;

import js.html.InputElement;
using xray.TypeTools;
using xray.Data;
using Lambda;

@:expose('client') class Client
{
	public static function main()
	{
		FieldKind;
		RefData;

		var http = new haxe.Http("neko.txt");
		http.onData = parseData;
		http.request();
	}

	static var model:Model;
	// static var printer:dox.Printer;

	static function parseData(data:String)
	{
		var unserializer = new Unserializer(data);
		model = unserializer.getModel();

		// codeModel = new dox.Model(model.types.array());
		// printer = new dox.Printer(codeModel);

		var search:InputElement = cast js.Browser.document.getElementById("search");
		search.onkeyup = function(_) {
			filter(search.value);
		}
	}

	static function filter(query:String)
	{
		var search:InputElement = cast js.Browser.document.getElementById("search");
		if (search.value != query) search.value = query;

		query = query.toLowerCase();
		var results = [];

		for (key in model.type.keys())
		{
			var id = key.toLowerCase();
			var name = id.split(".").pop();
			var type = model.type.get(key);

			if (query == name)
			{
				results = [type];
				break;
			}

			if (id.indexOf(query) > -1)
			{
				results.push(type);
			}
		}

		// results.sort(function(a,b){
		// 	return Reflect.compare(a.module,b.module);
		// });

		if (results.length > 1)
		{
			var chunks = [];
			currentId = null;

			for (result in results)
			{
				var base = result.toBaseType();
				if (base != null)
				{
					var name = base.pack.concat([base.name]).join(".");
					chunks.push('<li><a href="javascript:client.filter(\'$name\');">$name</a></li>');
				}
			}

			var output = js.Browser.document.getElementById("results");
			output.innerHTML = chunks.join("\n");
		}
		else
		{
			var result = results[0];
			var pos = result.toBaseType().pos;
			var id = pos.file;

			if (id != currentId)
			{
				currentId = id;

				var source = model.file.get(id);
				var output = js.Browser.document.getElementById("results");
				output.innerHTML = '<pre><code>'+xhx.HaxeMarkup.markup(source, id)+'</code></pre>';
			}
			
			// printer.printType(results[0]);
			// chunks.push(printer.getString());
		}
	}

	static var currentId:String;
}
