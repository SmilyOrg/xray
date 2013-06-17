package edit;

import js.html.ImageData;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

class Editor
{
	var canvas:CanvasElement;
	var scale:Float;
	
	var width:Int;
	var height:Int;

	var fontSize:Int;
	var fontCanvas:CanvasElement;

	var charWidth:Int;
	var charHeight:Int;

	var caret1:Int;
	var caret2:Int;

	var shift:Bool;
	var ctrl:Bool;
	var alt:Bool;
	var cmd:Bool;

	var content = "";
	var gutterWidth = 3;

	static function main()
	{
		new Editor();
	}

	public function new()
	{
		fontSize = 14;
		caret1 = caret2 = 0;

		// device scale
		scale = js.Browser.window.devicePixelRatio;
		var invScale = 1 / scale;

		fontCanvas = js.Browser.document.createCanvasElement();
		// js.Browser.document.body.appendChild(fontCanvas);

		untyped fontCanvas.style.webkitTransformOrigin = "top left";
		untyped fontCanvas.style.webkitTransform = 'scale($invScale,$invScale)';

		generateFont();

		canvas = js.Browser.document.createCanvasElement();
		js.Browser.document.body.appendChild(canvas);

		untyped canvas.style.webkitTransformOrigin = "top left";
		untyped canvas.style.webkitTransform = 'scale($invScale,$invScale)';

		canvas.width = Std.int(js.Browser.window.innerWidth * scale);
		canvas.height = Std.int(js.Browser.window.innerHeight * scale);

		var body = js.Browser.document.body;
		body.addEventListener("keypress", keyPress);
		body.addEventListener("keydown", keyDown);
		body.addEventListener("keyup", keyUp);
		body.addEventListener("mousedown", mouseDown);
		body.addEventListener("mouseup", mouseUp);

		js.Browser.document.addEventListener("paste", paste);
		js.Browser.document.addEventListener("copy", copy);
		js.Browser.document.addEventListener("cut", cut);

		content = lorem;
		render();
	}

	function cut(e)
	{
		var region = new Region(caret1, caret2);
		e.preventDefault();
		e.clipboardData.setData("text/plain", content.substring(region.begin, region.end));
		insertText("");
	}

	function copy(e)
	{
		var region = new Region(caret1, caret2);
		e.preventDefault();
		e.clipboardData.setData("text/plain", content.substring(region.begin, region.end));
	}

	function paste(e)
	{
		insertText(e.clipboardData.getData("text/plain"));
	}

	function insertText(text:String)
	{
		var region = new Region(caret1, caret2);
		content = content.substr(0, region.begin) + text + content.substr(region.end);
		caret1 = caret2 = region.begin + text.length;
		render();
	}

	function inputChar(code:Int)
	{
		var char = String.fromCharCode(code == 190 ? 46 : code);
		var region = new Region(caret1, caret2);
		trace(code);
		switch (code)
		{
			case 8, 46: // backspace, delete
				char = "";

				if (region.isEmpty())
				{
					if (code == 8)
					{
						if (caret1 == 0) return;
						caret1 --;
						region = new Region(caret1, caret2);
					}
					else
					{
						region = new Region(caret1, caret2 + 1);
					}
				}
				else
				{
					caret1 = region.begin;
				}

			case _:
				caret1 = region.begin + 1;
		}

		content = content.substr(0, region.begin) + char + content.substr(region.end);

		caret2 = caret1;
		render();
	}

	function getPosition(index:Int):{col:Int, row:Int}
	{
		var lines = content.split("\n");
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
		var lines = content.split("\n");

		if (row > lines.length - 1) return content.length;

		for (i in 0...lines.length)
		{
			var line = lines[i];
			if (i == row)
			{
				if (col > line.length) col = line.length;
				return index + col;
			}
			else index += line.length + 1;
		}
		return index;
	}

	function setCaret(index:Int)
	{
		// check bounds
		if (index < 0) index = 0;
		else if (index > content.length) index = content.length;

		caret1 = index;
		if (!shift) caret2 = caret1;
		render();
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
		var region = new Region(caret1, caret2);
		
		trace(e.keyCode);
		switch (e.keyCode)
		{
			case 16: shift = true;
			case 17: ctrl = true;
			case 18: alt = true;
			case 91: cmd = true;

			case 35: setCaret(content.length); // end
			case 36: setCaret(0); // home

			case 190: inputChar(190);

			case 9, 8, 46: // tab, backspace, delete
				e.preventDefault();
				inputChar(e.keyCode);

			case 37,39: // left, right
				var delta = e.keyCode == 37 ? -1 : 1;
				
				if (alt)
				{
					caret1 = wordBoundary(caret1, delta);
				}
				else
				{
					if (region.isEmpty() || shift)
					{
						caret1 = caret1 + delta;
					}
					else
					{
						caret1 = delta > 0 ? region.end : region.begin;
					}
				}
				
				if (caret1 < 0) caret1 = 0;
				else if (caret1 > content.length) caret1 = content.length;
				if (!shift) caret2 = caret1;
				render();

			case 38,40: // up, down
				if (cmd)
				{
					setCaret(e.keyCode == 38 ? 0 : content.length);
					return;
				}

				var delta = e.keyCode == 38 ? -1 : 1;
				if (region.isEmpty() || shift)
				{
					var pos = getPosition(caret1);
					caret1 = getIndex(pos.col, pos.row + delta);
				}
				else
				{
					var pos = getPosition(delta > 0 ? region.end : region.begin);
					caret1 = getIndex(pos.col, pos.row + delta);
				}
				if (!shift) caret2 = caret1;
				render();

			case _:
		}
	}
	
	function wordBoundary(index:Int, delta:Int)
	{
		var wordChars = " \n./\\()\"'-:,.;<>~!@#$%^&*|+=[]{}`~?";
		index += delta;
		if (delta == -1) index += delta;
		while (index > -1 && index < content.length - 1)
		{
			if (wordChars.indexOf(content.charAt(index)) > -1) break;
			index += delta;
		}
		if (delta == -1) index += 1;
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

	function layoutToText(x:Float, y:Float):Int
	{
		x -= gutterWidth * charWidth;
		var col = Math.round((x * scale) / charWidth);
		var row = Math.floor((y * scale) / charHeight);
		return getIndex(col, row);
	}

	function mouseDown(e)
	{
		caret1 = caret2 = layoutToText(e.clientX, e.clientY);
		render();

		js.Browser.document.body.addEventListener("mousemove", mouseMove);
	}

	function mouseMove(e)
	{
		caret1 = layoutToText(e.clientX, e.clientY);
		render();
	}

	function mouseUp(e)
	{
		js.Browser.document.body.removeEventListener("mousemove", mouseMove);
	}
	
	function render()
	{
		var context = canvas.getContext2d();
		context.clearRect(0, 0, canvas.width, canvas.height);

		var region = new Region(caret1, caret2);
		var x = gutterWidth;
		var y = 0;
		
		for (i in 0...content.length + 1)
		{
			var code = content.charCodeAt(i);
			var w = 1;
			if (code == 9) w = (Math.floor(x/4)*4+4) - x;

			if (!region.isEmpty() && i >= region.begin && i < region.end)
			{
				context.fillStyle = "orange";
				context.fillRect(x * charWidth, y * charHeight, charWidth * w, charHeight);
			}

			if (code != 10 && code != 9)
			{
				context.drawImage(fontCanvas, 
					code * charWidth, 0, charWidth, charHeight,
					x * charWidth, y * charHeight, charWidth, charHeight);
			}

			if (i == caret1)
			{
				context.fillStyle = "white";
				context.fillRect(x * charWidth, y * charHeight, 2, charHeight);
			}

			if (code == 10)
			{
				x = gutterWidth;
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
		var context = fontCanvas.getContext2d();
		context.font = '${fontSize}px Consolas';

		var nativeWidth = Math.ceil(context.measureText("X").width) + 1;
		charWidth = Math.ceil(nativeWidth * scale);
		charHeight = Math.ceil(fontSize * scale * 1.2);

		var totalWidth = 127 * charWidth;
		fontCanvas.width = totalWidth;
		fontCanvas.height = charHeight;

		context.scale(scale, scale);
		context.clearRect(0, 0, totalWidth, charHeight);

		context.fillStyle = "white";
		context.textBaseline = "top";
		context.font = '${fontSize}px monospace';

		for (i in 0...127)
		{
			context.fillText(String.fromCharCode(i), i * nativeWidth, 0);
		}
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
