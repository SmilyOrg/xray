package edit;

import js.html.ImageData;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

class Editor
{
	static function main() new Editor();

	var gutterWidth:Int;
	var fontSize:Int;

	var selection:RegionSet;
	var mouseSelection:Region;
	var canvas:CanvasElement;
	var fontCanvas:CanvasElement;

	var scale:Float;
	var width:Int;
	var height:Int;

	var charWidth:Int;
	var charHeight:Int;

	var shift:Bool;
	var ctrl:Bool;
	var alt:Bool;
	var cmd:Bool;

	var buffer:Buffer;
	
	public function new()
	{
		// config
		fontSize = 16;
		gutterWidth = 30;

		var document = js.Browser.document;
		var window = js.Browser.window;
		var body = document.body;

		// handle device pixel ratio
		scale = window.devicePixelRatio;

		// generate font
		fontCanvas = generateFont();
		
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
		
		// events
		body.addEventListener("keypress", keyPress);
		body.addEventListener("keydown", keyDown);
		body.addEventListener("keyup", keyUp);
		body.addEventListener("mousedown", mouseDown);
		body.addEventListener("mouseup", mouseUp);

		document.addEventListener("paste", paste);
		document.addEventListener("copy", copy);
		document.addEventListener("cut", cut);

		// initial content
		buffer = new Buffer(lorem);
		// content = lorem;
		render();
	}

	function cut(e)
	{
		e.preventDefault();
		e.clipboardData.setData("text/plain", getRegions(selection));
		insertText("");
	}

	function copy(e)
	{
		e.preventDefault();
		e.clipboardData.setData("text/plain", getRegions(selection));
	}

	function paste(e)
	{
		insertText(e.clipboardData.getData("text/plain"));
	}

	function insertText(text:String)
	{
		var offset = 0;
		var size = text.length;
		for (region in selection)
		{
			// trace(region);
			buffer.insert(region.begin() + offset, region.size(), text);
			region.a = region.b = offset + region.begin() + size;
			offset += region.size() - size;
		}
		render();
	}

	function inputChar(code:Int)
	{
		var char = String.fromCharCode(code == 190 ? 46 : code);
		
		switch (code)
		{
			case 8, 46: // backspace, delete
				char = "";
				var move = true;
				for (region in selection)
				{
					if (!region.isEmpty()) move = false;
					// region.a = region.end();
				}

				if (move)
				{
					for (region in selection)
					{
						if (code == 8)
						{
							if (region.a > 0) region.a -=1;
						}
						else
						{
							if (region.b < buffer.content.length) region.b += 1;
						}
					}
				}
			default:
		}

		insertText(char);
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

	function setCaret(index:Int)
	{
		// check bounds
		// if (index < 0) index = 0;
		// else if (index > content.length) index = content.length;

		// caret1 = index;
		// if (!shift) caret2 = caret1;
		// render();
	}

	function keyPress(e)
	{
		var code = e.keyCode;
		if (code == 46) return;
		if (code == 13) code  = 10;
		inputChar(code);
	}

	function keyDown(e)
	{
		// trace(e.keyCode);
		switch (e.keyCode)
		{
			case 16: shift = true;
			case 17: ctrl = true;
			case 18: alt = true;
			case 91: cmd = true;

			case 35: setCaret(buffer.content.length); // end
			case 36: setCaret(0); // home

			case 190: inputChar(190);

			case 9, 8, 46: // tab, backspace, delete
				e.preventDefault();
				inputChar(e.keyCode);

			case 37,39: // left, right
				var delta = e.keyCode == 37 ? -1 : 1;
				for (region in selection)
				{
					if (alt) region.b = wordBoundary(region.b, delta);
					else if (region.isEmpty() || shift) region.b += delta;
					else region.b = delta > 0 ? region.end() : region.begin();
					if (!shift) region.a = region.b;
				}
				render();

			case 38,40: // up, down
				// if (cmd)
				// {
				// 	setCaret(e.keyCode == 38 ? 0 : content.length);
				// 	return;
				// }

				var delta = e.keyCode == 38 ? -1 : 1;
				for (region in selection)
				{
					if (region.isEmpty() || shift)
					{
						var pos = getPosition(region.b);
						region.b = getIndex(pos.col, pos.row + delta);
					}
					else
					{
						var pos = getPosition(delta > 0 ? region.end() : region.begin());
						region.b = getIndex(pos.col, pos.row + delta);
					}
					if (!shift) region.a = region.b;
				}
				render();
			default:
		}
	}
	
	function wordBoundary(index:Int, delta:Int)
	{
		var size = buffer.content.length;
		var wordChars = " \n./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?";
		index += delta;
		if (delta == -1) index += delta;
		while (index > -1 && index < size - 1)
		{
			if (wordChars.indexOf(buffer.content.charAt(index)) > -1) break;
			index += delta;
		}
		if (delta == -1) index += 1;
		if (index < 0) index = 0;
		if (index > size) index = size;
		return index;
	}

	function keyUp(e)
	{
		switch (e.keyCode)
		{
			case 16: shift = false;
			case 17: ctrl = false;
			case 18: alt = false;
			case 91: cmd = false;
			case _:
		}
	}

	// TODO: yuck.
	function layoutToText(x:Float, y:Float):Int
	{
		x *= scale;
		y *= scale;
		x -= gutterWidth;

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

	function getLine(index:Int)
	{
		return buffer.content.split("\n")[index];
	}

	function mouseDown(e)
	{
		selection.clear();
		var index = layoutToText(e.clientX, e.clientY);
		mouseSelection = new Region(index, index);
		selection.add(mouseSelection);
		render();

		js.Browser.document.body.addEventListener("mousemove", mouseMove);
	}

	function mouseMove(e)
	{
		mouseSelection.b = layoutToText(e.clientX, e.clientY);
		render();
	}

	function mouseUp(e)
	{
		mouseSelection = null;
		js.Browser.document.body.removeEventListener("mousemove", mouseMove);
	}
	
	function render()
	{
		var context = canvas.getContext2d();
		context.clearRect(0, 0, canvas.width, canvas.height);

		// var buffer = new Buffer(content);

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
	}

	function generateFont()
	{
		var fontCanvas = js.Browser.document.createCanvasElement();
		// js.Browser.document.body.appendChild(fontCanvas);
		
		var invScale = 1 / scale;
		untyped fontCanvas.style.webkitTransformOrigin = "top left";
		untyped fontCanvas.style.webkitTransform = 'scale($invScale,$invScale)';

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

		return fontCanvas;
	}

	function getRegions(regions:RegionSet)
	{
		var text = new StringBuf();
		for (region in regions) text.add(substr(region));
		return text.toString();
	}

	inline function substr(region:Region)
	{
		return buffer.content.substring(region.begin(), region.end());
	}

	inline function char(index:Int)
	{
		return buffer.content.charAt(index);
	}

	static var lorem =
"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed purus tempus, 
facilisis dui id, egestas magna.

Curabitur sagittis, libero quis adipiscing consectetur, odio risus mattis 
tristique ante nec faucibus dictum. Nulla sapien lectus, pellentesque et mattis 
a, rutrum quis massa. Ut eget nulla neque. Donec vitae mi mauris. Fusce dolor 
felis, viverra eget dolor at, luctus dignissim nisl. Etiam eu libero 
scelerisque metus volutpat pulvinar accumsan nec neque.

Vestibulum ante ipsum primis in faucibus orci luctus.

Suspendisse euismod posuere mi, ac pretium eros. In in metus pulvinar, 
elementum nibh eget, congue massa. Vestibulum eros elit, pellentesque at massa 
sed, rhoncus laoreet purus. Proin interdum mauris sed enim posuere 
pellentesque. Maecenas facilisis blandit hendrerit. Pellentesque ut velit 
eleifend, commodo nisl vitae, vehicula orci. Suspendisse pellentesque auctor 
orci in pretium.

Vestibulum accumsan malesuada ante, ut suscipit neque rhoncus vitae. Nunc 
sagittis tincidunt ligula, sit amet ultricies nibh eleifend vitae. Nullam vel 
bibendum ipsum. Vestibulum in nisl bibendum, ultricies augue a, ullamcorper 
sem. Mauris euismod urna eros, a placerat leo tincidunt sed. Vestibulum luctus 
metus ut vestibulum congue. Sed rutrum aliquet metus, at gravida nunc volutpat 
mattis. Praesent congue nisl quis augue euismod, quis dignissim diam mattis. 
Morbi malesuada blandit nulla sit amet ultrices. Pellentesque vitae ornare dui, 
vel euismod velit. Ut quam erat, congue id tellus vel, pharetra laoreet tortor. 
Proin feugiat, enim et pulvinar ornare, lorem erat consequat urna, vel 
sollicitudin libero erat vitae tellus.";
}
