package edit;

import haxe.io.Bytes;
import haxe.EnumFlags;

class Buffer
{
	public var flags:Bytes;
	public var content:String;

	public function new(content:String)
	{
		this.content = content;
		this.flags = Bytes.alloc(content.length);
	}

	public function clearFlags()
	{
		flags = Bytes.alloc(content.length);
	}

	public function insert(index:Int, length:Int, string:String)
	{
		content = content.substr(0, index) + string + content.substr(index + length);
		var previous = flags;
		flags = Bytes.alloc(content.length);
		flags.blit(0, previous, 0, index);
		var pos = index + length;
		flags.blit(0, previous, pos, previous.length - pos);
	}

	public function replace(region:Region, text:String)
	{
		insert(region.begin(), region.size(), text);
	}

	public function setFlag(region:Region, flag:BufferFlag)
	{
		for (i in region.begin()...region.end()) setFlagAt(i, flag);
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