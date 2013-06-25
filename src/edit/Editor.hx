package edit;

import js.html.ImageData;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

class Editor
{
	static function main() new Editor();

	public var selection:RegionSet;
	public var buffer:Buffer;
	public var fontSize:Int;
	public var edits:Array<Edit>;
	public var edit:Edit;

	var gutterWidth:Int;
	var canvas:CanvasElement;
	var context:CanvasRenderingContext2D;
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

	public function new()
	{
		// config
		fontSize = 16;
		gutterWidth = 30;

		var document = js.Browser.document;
		var window = js.Browser.window;
		var body = document.body;

		edit = new Edit(this);
		edits = [edit];

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

		// create canvas
		canvas = document.createCanvasElement();
		body.appendChild(canvas);

		// create canvas
		canvas.width = Std.int(window.innerWidth * scale);
		canvas.height = Std.int(window.innerHeight * scale);

		var invScale = 1 / scale;
		untyped canvas.style.webkitTransformOrigin = "top left";
		untyped canvas.style.webkitTransform = 'scale($invScale,$invScale)';
		
		context = canvas.getContext2d();

		document.addEventListener("paste", paste);
		document.addEventListener("copy", copy);
		document.addEventListener("cut", cut);

		setContent("");
		new Input(this);
	}

	public function beginEdit(?command:String, ?args:Dynamic):Edit
	{
		return new Edit(this);
	}

	public function endEdit(edit:Edit)
	{
		edits.push(edit);
	}

	public function insert(edit:Edit, point:Int, string:String)
	{
		if (edit != null) edit.insert(point, string);
		buffer.insert(point, 0, string);
	}

	public function erase(edit:Edit, region:Region)
	{
		if (edit != null) edit.erase(region);
		buffer.insert(region.begin(), region.size(), "");
	}

	public function replace(edit:Edit, region:Region, string:String)
	{
		erase(edit, region);
		insert(edit, region.begin(), string);
	}

	public function setContent(string:String)
	{
		buffer = new Buffer(string);
		render();
	}

	public function runCommand(name:String, ?args:Dynamic)
	{
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
		command.run(args);
	}

	function cut(e)
	{
		e.preventDefault();
		e.clipboardData.setData("text/plain", getRegions(selection));
		runCommand("insert", {characters:""});
	}

	function copy(e)
	{
		e.preventDefault();
		e.clipboardData.setData("text/plain", getRegions(selection));
	}

	function paste(e)
	{
		var text = e.clipboardData.getData("text/plain");
		runCommand("insert", {characters:text});
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
		scrollX = Std.int(Math.max(0, Math.min(maxScrollX, scrollX - x)));
		scrollY = Std.int(Math.max(0, Math.min(maxScrollY, scrollY - y)));
		
		render();
	}

	public function render()
	{
		// context.fillStyle = "#272822";
		context.clearRect(0, 0, canvas.width, canvas.height);

		trace(scrollY);
		context.save();
		context.translate(-scrollX, -scrollY);

		var selected = new Map<Int, Bool>();
		var carets = new Map<Int, Bool>();
		buffer.clearFlags();
		for (region in selection)
		{
			buffer.setFlag(region, Selected);
			buffer.setFlagAt(region.b, Caret);
		}

		var x = 0;
		var y = 0;
		
		for (i in 0...buffer.content.length + 1)
		{
			var code = buffer.content.charCodeAt(i);
			var w = 1;
			if (code == 9) w = (Math.floor(x/4)*4+4) - x;

			if (buffer.hasFlagAt(i, Selected))
			{
				context.fillStyle = "orange";
				context.fillRect(gutterWidth + x * charWidth, y * charHeight, charWidth * w, charHeight);
			}

			if (buffer.hasFlagAt(i, Caret))
			{
				context.fillStyle = "white";
				context.fillRect(gutterWidth + x * charWidth, y * charHeight, 2, charHeight);
			}

			if (code != 10 && code != 9)
			{
				context.drawImage(fontCanvas, 
					code * charWidth, 0, charWidth, charHeight,
					gutterWidth + x * charWidth, y * charHeight, charWidth, charHeight);
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

		maxScrollY = y * charHeight - canvas.height;

		context.restore();
	}

	function getRegions(regions:RegionSet)
	{
		var text = new StringBuf();
		for (region in regions) text.add(substr(region));
		return text.toString();
	}

	inline public function substr(region:Region)
	{
		return buffer.content.substring(region.begin(), region.end());
	}

	inline public function char(index:Int)
	{
		return buffer.content.charAt(index);
	}
	
	inline public function size()
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
}
