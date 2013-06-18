package edit;

class RegionSet
{
	var regions:Array<Region>;

	public function new()
	{
		regions = [];
	}

	public function clear()
	{
		regions = [];
	}

	public function add(region:Region)
	{
		if (regions.length == 0)
		{
			regions.push(region);
			return;
		}
		
		var merged = [];
		for (existing in regions)
		{
			if (existing.intersects(region))
			{
				region = region.cover(existing);
			}
			else
			{
				if (region.begin() < existing.begin()) merged.push(region);
				merged.push(existing);
			}
		}
		regions = merged;
	}

	public function addAll(regions:Array<Region>)
	{
		for (region in regions) add(region);
	}

	public function iterator()
	{
		return regions.iterator();
	}
}