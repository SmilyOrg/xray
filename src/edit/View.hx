package edit;

import js.html.ImageData;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

class View
{
	static function main() new View();

	public var selection:RegionSet;
	public var buffer:Buffer;
	public var fontSize:Int;
	public var edits:Array<Edit>;

	var gutterWidth:Int;
	var canvas:CanvasElement;
	var canvas2:CanvasElement;
	var context:CanvasRenderingContext2D;
	var context2:CanvasRenderingContext2D;
	var fontCanvas:CanvasElement;

	var scale:Float;
	var width:Int;
	var height:Int;

	var charWidth:Int;
	var charHeight:Int;

	var scrollX:Int;
	var scrollY:Int;

	var maxScrollX:Int;
	var maxScrollY:Int;
	var language:Language;

	var theme:Map<String, Int>;
	var colors:Map<Int, Int>;

	public function new()
	{
		// config
		fontSize = 16;
		gutterWidth = 30;

		var document = js.Browser.document;
		var window = js.Browser.window;
		var body = document.body;

		// scroll position
		scrollX = 0;
		scrollY = 0;

		maxScrollX = 0;
		maxScrollY = 0;

		// handle device pixel ratio
		scale = window.devicePixelRatio;

		// generate font
		generateFont();
		
		// init selection
		selection = new RegionSet();
		selection.add(new Region(0, 0));

		// init edit
		edits = [];

		// create canvas
		canvas = document.createCanvasElement();
		context = canvas.getContext2d();
		
		canvas2 = document.createCanvasElement();
		context2 = canvas2.getContext2d();
		
		body.appendChild(canvas);

		// create canvas
		canvas.width = canvas2.width = Std.int(window.innerWidth * scale);
		canvas.height = canvas2.height = Std.int(window.innerHeight * scale);

		// create theme
		theme = new Map<String, Int>();
		theme.set("string", 1);
		theme.set("keyword", 2);
		theme.set("operator", 3);
		theme.set("constant", 4);
		theme.set("comment", 5);
		theme.set("directive", 6);
		theme.set("type", 7);
		theme.set("special", 8);

		// create colors
		colors = new Map<Int, Int>();
		colors.set(1, 0xe7dc6a);
		colors.set(2, 0xfb2b72);
		colors.set(3, 0xfb2b72);
		colors.set(4, 0xae7eff);
		colors.set(5, 0x757158);
		colors.set(6, 0x61d8f1);
		colors.set(7, 0xa6e22e);
		colors.set(8, 0xd1922e);

		language = new Language(haxe.Resource.getString("haxe"));

		var invScale = 1 / scale;
		untyped canvas.style.webkitTransformOrigin = "top left";
		untyped canvas.style.webkitTransform = 'scale($invScale,$invScale)';

		setContent("");
		new Input(this);

		runCommand("load", {url:"Test.hx"});
	}

	public function beginEdit(?command:String, ?args:Dynamic):Edit
	{
		var edit = new Edit(this);
		edits.unshift(edit);
		return edit;
	}

	public function endEdit(edit:Edit)
	{
		edit.end();
	}

	public function insert(edit:Edit, point:Int, string:String)
	{
		// if (string == " " && edit != null)
		// {
		// 	endEdit(edit);
		// 	this.edit = edit = beginEdit();
		// }

		if (edit != null) edit.insert(point, string);
		for (region in selection)
		{
			if (point <= region.begin()) region.a += string.length;
			if (point < region.end()) region.b += string.length;
		}
		buffer.insert(point, 0, string);
	}

	public function erase(edit:Edit, region:Region)
	{
		if (edit != null) edit.erase(region);
		buffer.insert(region.begin(), region.size(), "");
		for (r in selection) r.subtract(region);
	}

	public function replace(edit:Edit, region:Region, string:String)
	{
		if (edit != null) erase(edit, region);
		insert(edit, region.begin(), string);
	}

	public function setContent(string:String)
	{
		buffer = new Buffer(string);
		render();
	}

	public function runCommand(name:String, ?args:Dynamic)
	{
		if (edits.length == 0) beginEdit();

		var className = "edit.command.";
		for (part in name.split("_"))
			className += part.charAt(0).toUpperCase() + part.substr(1);
		className += "Command";

		var command = Type.resolveClass(className);
		if (command == null)
		{
			trace("command not found: " + name);
			return;
		}
		
		if (args != null) trace(name + ":" + args);
		else trace(name);
		
		if (args == null) args = {};
		var command:Dynamic = Type.createInstance(command, [this]);
		command.run(edits[0], args);
	}

	function getPosition(index:Int):{col:Int, row:Int}
	{
		var lines = buffer.content.split("\n");
		for (i in 0...lines.length)
		{
			index -= lines[i].length + 1;
			if (index < 0) return {col:lines[i].length+index+1, row:i};
		}
		return null;
	}

	function getIndex(col:Int, row:Int):Int
	{
		if (row < 0) return 0;

		var index = 0;
		var lines = buffer.content.split("\n");

		if (row > lines.length - 1) return buffer.content.length;

		for (i in 0...lines.length)
		{
			var line = lines[i];
			if (i == row)
			{
				if (col > line.length) col = line.length;
				if (col < 0) col = 0;
				return index + col;
			}
			else index += line.length + 1;
		}
		return index;
	}

	public function layoutToText(x:Float, y:Float):Int
	{
		x *= scale;
		y *= scale;
		x -= gutterWidth;
		x += scrollX;
		y += scrollY;

		var row = Math.floor(y / charHeight);
		var col = x / charWidth;

		var line = getLine(row);
		if (line == null) return size();

		var charCol = 0;
		var charX = 0;
		for (i in 0...line.length)
		{
			var code = line.charCodeAt(i);
			var w = 1;
			if (code == 9) w = (Math.floor(charX/4)*4+4) - charX;
			if (charX + w / 2 >= col) break;
			charCol += 1;
			charX += w;
		}
		
		return getIndex(charCol, row);
	}

	public function line(index:Int):Region
	{
		var full = fullLine(index);
		if (char(full.b - 1) == "\n") full.b -= 1;
		return full;
	}

	public function fullLine(index:Int):Region
	{
		var a = findLeft(index, "\n");
		var b = findRight(index, "\n") + 1;
		return new Region(a, b);
	}

	public function word(index:Int):Region
	{
		var wordChars = " \n./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?";
		return new Region(findLeft(index, wordChars), findRight(index, wordChars));
	}

	function findLeft(index:Int, chars:String):Int
	{
		while (index > 0)
		{
			if (chars.indexOf(char(index - 1)) > -1) break;
			index -= 1;
		}
		return index;
	}

	function findRight(index:Int, chars:String):Int
	{
		var size = size();
		while (index <= size)
		{
			if (chars.indexOf(char(index)) > -1) break;
			index += 1;
		}
		return index;
	}

	function getLine(index:Int)
	{
		return buffer.content.split("\n")[index];
	}

	public function scroll(x:Int, y:Int)
	{
		var oldScrollX = scrollX;
		var oldScrollY = scrollY;

		scrollX = Std.int(Math.max(0, Math.min(maxScrollX, scrollX - x)));
		scrollY = Std.int(Math.max(0, Math.min(maxScrollY, scrollY - y)));
		
		x = oldScrollX - scrollX;
		y = oldScrollY - scrollY;

		context2.clearRect(0, 0, canvas.width, canvas.height);
		context2.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(canvas2, x, y);

		if (y > 0)
		{
			var start = getIndex(0, Math.floor(oldScrollY / charHeight));
			var end = getIndex(0, Math.floor(scrollY / charHeight));
			renderRegion(line(start).cover(line(end)));
		}
		else if (y < 0)
		{
			var start = getIndex(0, Math.floor((oldScrollY + canvas.height) / charHeight));
			var end = getIndex(0, Math.floor((scrollY + canvas.height) / charHeight));
			renderRegion(line(start).cover(line(end)));
		}
	}

	public function getRegions(regions:RegionSet)
	{
		var text = new StringBuf();
		for (region in regions) text.add(substr(region));
		return text.toString();
	}

	public function substr(region:Region)
	{
		return buffer.content.substring(region.begin(), region.end());
	}

	public function char(index:Int)
	{
		return buffer.content.charAt(index);
	}
	
	public function size()
	{
		return buffer.content.length;
	}

	public function generateFont()
	{
		fontCanvas = js.Browser.document.createCanvasElement();

		var context = fontCanvas.getContext2d();
		var size = Std.int(fontSize * scale);
		context.font = '${size}px Consolas';

		charWidth = Math.ceil(context.measureText(".").width);
		charHeight = Math.ceil(size);

		var totalWidth = 127 * charWidth;
		fontCanvas.width = totalWidth;
		fontCanvas.height = charHeight;

		context.fillStyle = "white";
		context.textBaseline = "top";
		context.font = '${size}px Consolas';

		for (i in 0...127)
		{
			context.fillText(String.fromCharCode(i), i * charWidth, 0);
		}
	}

	public function render()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);

		var size = Std.int(fontSize * scale);
		context.font = '${size}px Consolas';
		context.textBaseline = "top";

		var selected = new Map<Int, Bool>();
		var carets = new Map<Int, Bool>();
		buffer.clearFlags();
		for (region in selection)
		{
			buffer.setFlag(region, Selected);
			buffer.setFlagAt(region.b, Caret);
		}
		
		var scopes = language.process(buffer.content);
		for (scope in scopes)
		{
			buffer.setColor(scope.region, theme.get(scope.name));
		}

		renderRegion(new Region(0, buffer.content.length));

		var lines = buffer.content.split("\n").length;
		maxScrollY = (lines + 1) * charHeight - canvas.height;
	}

	function renderRegion(region:Region)
	{
		context.save();
		context.translate(-scrollX, -scrollY);

		var position = getPosition(region.a);
		
		var x = position.col;
		var y = position.row;

		for (i in region.a...region.b)
		{
			var code = buffer.content.charCodeAt(i);
			var w = 1;
			if (code == 9) w = (Math.floor(x/4)*4+4) - x;

			if (buffer.hasFlagAt(i, Selected))
			{
				context.fillStyle = "#38382f";
				context.fillRect(gutterWidth + x * charWidth, y * charHeight, charWidth * w, charHeight);
			}

			if (code != 10 && code != 9)
			{
				var color = buffer.colors.get(i);
				if (color == 0) context.fillStyle = "white";
				else context.fillStyle = "#" + StringTools.hex(colors.get(color));

				context.fillText(String.fromCharCode(code), gutterWidth + x * charWidth, y * charHeight);
			}

			if (buffer.hasFlagAt(i, Caret))
			{
				context.fillStyle = "white";
				context.fillRect(gutterWidth + x * charWidth, y * charHeight, 2, charHeight);
			}
			
			if (code == 10)
			{
				x = 0;
				y ++;
			}
			else
			{
				x += w;
			}
		}

		context.restore();
	}
}
