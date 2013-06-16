package edit;

class Region
{
	public var begin(default, null):Int;
	public var end(default, null):Int;
	public var size(default, null):Int;

	public function new(a:Int, b:Int)
	{
		begin = (a < b ? a : b);
		end = (a > b ? a : b);
		size = end - begin;
	}

	public function isEmpty()
	{
		return size == 0;
	}
	
	public function intersects(region:Region)
	{
		return (region.begin >= begin && region.begin < end) 
			|| (region.end > begin && region.end <= end);
	}

	public function intersection(region:Region)
	{
		if (intersects(region))
		{
			var a = begin > region.begin ? begin : region.begin;
			var b = end > region.end ? end : region.end;
			return new Region(a, b);
		}
		return new Region(0,0);
	}

	public function containsPoint(point:Int)
	{
		return begin <= point && point <= end;
	}

	public function containsRegion(region:Region)
	{
		return begin <= region.begin && region.end <= end;
	}

	function cover(region:Region)
	{
		var a = begin < region.begin ? begin : region.begin;
		var b = end > region.end ? end : region.end;
		return new Region(a, b);
	}
}
