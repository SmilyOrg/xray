package edit;

using Lambda;

typedef Attributes = Map<String, String>;

class AttributedString
{
	public var string(default, null):String;

	public var length(get, never):Int;
	inline function get_length() return string.length;

	var entries:Array<RegionEntry>;

	public function new(string:String, ?attributes:Attributes)
	{
		if (attributes == null) attributes = new Attributes();
		this.string = string;
		this.entries = [makeEntry(new Region(0, string.length), attributes)];
	}

	function indexOfEntryWithIndex(index:Int):Int
	{
		var sort = function(index, entry)
		{

		};
	}

	inline static function makeEntry(region:Region, attributes:Map<String, String>)
	{
		return { region:region, attributes:copyMap(attributes) };
	}

	inline static function copyEntry(entry:RegionEntry)
	{
		return { region:copyRegion(entry.region), attributes:copyMap(entry.attributes) };
	}

	static function copyMap(map:Map<String, String>)
	{
		var copy = new Attributes();
		for (key in map.keys()) copy.set(key, map.get(key));
		return copy;
	}

	static function copyRegion(region:Region)
	{
		return new Region(region.a, region.b);
	}
}

typedef RegionEntry =
{
	region:Region,
	attributes:Attributes
}