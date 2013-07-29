package edit;

import haxe.io.Bytes;
import haxe.EnumFlags;

class Buffer
{
	public var content:String;
	public var flags:Bytes;
	public var colors:Bytes;

	var buffers:Array<Bytes>;

	public function new(content:String)
	{
		this.content = content;
		this.flags = Bytes.alloc(1024);
		this.colors = Bytes.alloc(1024);

		buffers = [flags, colors];
	}

	public function clearFlags()
	{
		flags = Bytes.alloc(1024);
		colors = Bytes.alloc(1024);
	}

	public function insert(index:Int, length:Int, string:String)
	{
		content = content.substr(0, index) + string + content.substr(index + length);
		for (buffer in buffers)
		{
			var previous = buffer;
			// buffer = Bytes.alloc(content.length);
			buffer.blit(0, previous, 0, index);
			var pos = index + length;
			buffer.blit(0, previous, pos, previous.length - pos);
		}
	}

	public function replace(region:Region, text:String)
	{
		insert(region.begin(), region.size(), text);
	}

	public function setFlag(region:Region, flag:BufferFlag)
	{
		for (i in region.begin()...region.end()) setFlagAt(i, flag);
	}

	public function setColor(region:Region, color:Int)
	{
		for (i in region.begin()...region.end()) colors.set(i, color);
	}

	public function setFlagAt(index:Int, flag:BufferFlag)
	{
		var enumFlags = new EnumFlags<BufferFlag>(flags.get(index));
		enumFlags.set(flag);
		flags.set(index, enumFlags.toInt());
	}

	public function clearFlag(region:Region, flag:BufferFlag)
	{
		for (i in region.begin()...region.end())
		{
			var enumFlags = new EnumFlags<BufferFlag>(flags.get(i));
			enumFlags.unset(flag);
			flags.set(i, enumFlags.toInt());
		}
	}

	public function hasFlagAt(index:Int, flag:BufferFlag)
	{
		var enumFlags = new EnumFlags<BufferFlag>(flags.get(index));
		return enumFlags.has(flag);
	}
}

enum BufferFlag
{
	Selected;
	Caret;
}
