package edit;

class Region
{
	public var a:Int;
	public var b:Int;

	public function new(a:Int, b:Int)
	{
		this.a = a;
		this.b = b;
	}

	public function begin()
	{
		return (a < b ? a : b);
	}

	public function end()
	{
		return (a > b ? a : b);
	}

	public function size()
	{
		return Std.int(Math.abs(a - b));
	}

	public function isEmpty()
	{
		return size() == 0;
	}
	
	public function intersects(region:Region)
	{
		return (region.begin() >= begin() && region.begin() < end()) 
			|| (region.end() > begin() && region.end() <= end());
	}

	public function intersection(region:Region)
	{
		if (intersects(region))
		{
			var a = begin() > region.begin() ? begin() : region.begin();
			var b = end() < region.end() ? end() : region.end();
			return new Region(a, b);
		}
		return new Region(0, 0);
	}

	public function containsPoint(point:Int)
	{
		return begin() <= point && point <= end();
	}

	public function containsRegion(region:Region)
	{
		return begin() <= region.begin() && region.end() <= end();
	}

	public function cover(region:Region)
	{
		var a = begin() < region.begin() ? begin() : region.begin();
		var b = end() > region.end() ? end() : region.end();
		return new Region(a, b);
	}

	public function insert(point:Int, length:Int)
	{
		if (point <= a) a += length;
		if (point <= b) b += length;
	}

	public function subtract(region:Region)
	{
		var size2 = region.size();

		if (region.end() <= begin())
		{
			a -= size2;
			b -= size2;
		}
		else if (intersects(region))
		{
			var cross = size() - intersection(region).size();
			a = begin() < region.begin() ? begin() : region.begin();
			b = a + cross;
		}
	}

	public function clone()
	{
		return new Region(a, b);
	}
}
