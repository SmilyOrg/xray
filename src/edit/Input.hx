package edit;

import js.html.KeyboardEvent;
import js.html.MouseEvent;
import js.html.WheelEvent;
using Lambda;

class Input
{
	var view:View;
	var mappings:Array<KeyMapping>;
	var mouseSelection:Region;

	public function new(view:View)
	{
		this.view = view;
		this.mappings = [];

		var body = js.Browser.document.body;
		
		body.addEventListener("keydown", keyDown);
		body.addEventListener("keypress", keyPress);
		
		body.addEventListener("mousedown", mouseDown);
		body.addEventListener("mouseup", mouseUp);
		body.addEventListener("mousewheel", mouseWheel);
		body.addEventListener("scroll", scroll);

		var platform = js.Browser.window.navigator.platform;
		var os = platform.indexOf("Mac") > -1 ? "mac" : "win";
		var http = new haxe.Http('keymap-$os.json');
		http.onData = function(data) {
			mappings = haxe.Json.parse(data);
		}
		http.request();
	}

	function scroll(e)
	{
		js.Browser.document.body.scrollTop = 0;
		js.Browser.document.body.scrollLeft = 0;
	}

	function keyDown(e:KeyboardEvent)
	{
		// trace(e.keyCode);
		var down = [];
		if (e.metaKey) down.push(91);
		if (e.shiftKey) down.push(16);
		if (e.ctrlKey) down.push(17);
		if (e.altKey) down.push(18);
		down.push(e.keyCode);

		for (mapping in mappings)
		{
			var codes = parseKeys(mapping.keys[0]);
			if (codes.length != down.length) continue;

			var execute = true;
			for (code in codes)
			{
				if (!down.has(code))
				{
					execute = false;
					break;
				}
			}

			if (execute && mapping.context != null)
			{
				for (context in mapping.context)
				{
					for (region in view.selection)
					{
						var value:Dynamic = switch (context.key)
						{
							case "selection_empty":
								region.size() == 0;
							case "preceding_text":
								view.substr(new Region(0, region.begin()));
							case "following_text":
								view.substr(new Region(region.end(), view.size()));
							case "text":
								view.substr(region);
							case "num_selections":
								view.selection.count();
							default:
								null;
						}
						var result = switch (context.operator)
						{
							case "equal":
								value == context.operand;
							case "not_equal":
								value != context.operand;
							case "regex_contains":
								new EReg(context.operand, "").match(value);
							case "not_regex_contains":
								trace(value);
								!new EReg(context.operand, "").match(value);
							default:
								true;
						}

						if (!result) execute = false;
						if (!execute) break;
					}
					if (!execute) break;
				}
			}

			if (execute)
			{
				e.stopPropagation();
				e.preventDefault();

				view.runCommand(mapping.command, mapping.args);
				break;
			}
		}
	}

	function keyPress(e:KeyboardEvent)
	{
		var code = e.keyCode;
		if (code == 13) code  = 10;
		
		var char = String.fromCharCode(code == 190 ? 46 : code);
		view.runCommand("insert", {characters:char});
	}

	function mouseDown(e:MouseEvent)
	{
		var index = view.layoutToText(e.clientX, e.clientY);
		if (e.shiftKey)
		{
			mouseSelection = view.selection.last();
			mouseSelection.b = index;
		}
		else
		{
			view.selection.clear();
			mouseSelection = new Region(index, index);
			view.selection.add(mouseSelection);
		}
		
		view.render();
		js.Browser.document.body.addEventListener("mousemove", mouseMove);
	}

	function mouseMove(e:MouseEvent)
	{
		mouseSelection.b = view.layoutToText(e.clientX, e.clientY);
		view.render();
	}

	function mouseWheel(e:WheelEvent)
	{
		e.preventDefault();
		view.scroll(e.wheelDeltaX, e.wheelDeltaY);
	}

	var lastUp:Float = 0.0;
	var clickCount:Int;

	function mouseUp(e:MouseEvent)
	{
		var stamp = haxe.Timer.stamp();
		if (stamp - lastUp < 0.3) clickCount ++;
		else clickCount = 1;
		lastUp = stamp;

		if (clickCount == 2)
		{
			var word = view.word(mouseSelection.b);
			mouseSelection.a = word.a;
			mouseSelection.b = word.b;
			view.render();
		}
		else if (clickCount == 3)
		{
			var word = view.fullLine(mouseSelection.b);
			mouseSelection.a = word.a;
			mouseSelection.b = word.b;
			view.render();	
		}

		mouseSelection = null;
		js.Browser.document.body.removeEventListener("mousemove", mouseMove);
	}

	function parseKeys(keys:String)
	{
		var keys = keys.split("+");
		var codes = [];
		for (key in keys)
		{
			var keyCodes = switch (key)
			{
				case "left": [37];
				case "right": [39];
				case "up": [38];
				case "down": [40];
				case "backspace": [8];
				case "escape": [27];
				case "delete": [46];
				case "shift": [16];
				case "ctrl": [17];
				case "alt": [18];
				case "super": [91];
				case "enter": [13];
				case "end": [35];
				case "home": [36];
				case "-": [ 189];
				case "=": [187];
				case "tab": [9];
				case "[": [219];
				case "]": [221];
				case "{": [16, 219];
				case "}": [16, 221];
				case "(": [16, 57];
				case ")": [16, 48];
				case "'": [222];
				case "\"": [16, 222];
				default:
					[key.toUpperCase().charCodeAt(0)];
			}
			for (code in keyCodes) codes.push(code);
		}
		return codes;
	}
}

typedef KeyMapping = {
	keys:Array<String>,
	command:String,
	?args:Dynamic,
	?context:Array<KeyContext>
}

typedef KeyContext = {
	key:String,
	operator:String,
	operand:Dynamic,
	?match_all:Bool
}
