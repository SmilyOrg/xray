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
		if (index < 0 || index > length - 1)
			return -1;
		var sort = function(index, entry)
		{
			if (index >= entry.region.a && index <= entry.region.b)
				return 0;
			else if (entry.region.b <= index)
				return 1
			else
				return -1;
		};
		return BinarySearch.search(index, entries, sort);
	}

	public function attributesAtIndex(index:Int)
	{
		var entryIndex = indexOfEntryWithIndex(index);
		if (entryIndex == -1) return null;
		var matchingEntry = entries[entryIndex];
		return matchingEntry.attributes;
	}

	public function setAttributes(attributes:Attributes, region:Region)
	{
		var startingEntryIndex = indexOfEntryForIndex(region.a, true);
		var endingEntryIndex = indexOfEntryForIndex(region.b, true);
		var current = startingEntryIndex;
		
		if (endingEntryIndex == -1)
			endingEntryIndex = entries.length;

		while (current < endingEntryIndex)
			entries[current++].attributes = copyMap(attributes);

		coalesceEntries(startingEntryIndex, endingEntryIndex);
	}

	public function addAttributes(attributes:Attributes, region:Region)
	{
		var startingEntryIndex = indexOfEntryForIndex(region.a, true);
		var endingEntryIndex = indexOfEntryForIndex(region.b, true);
		var current = startingEntryIndex;
		
		if (endingEntryIndex == -1)
			endingEntryIndex = entries.length;

		while (current < endingEntryIndex)
		{
			var entry = entries[current++];
			for (key in attributes.keys())
				entry.attributes.set(key, attributes.get(key));
		}
		
		coalesceEntries(startingEntryIndex, endingEntryIndex);
	}

	function coalesceEntries(start:Int, end:Int)
	{
		var current = start;

		if (end >= entries.length)
			end = entries.length - 1;

		while (current < end)
		{
			var a = entries[current];
			var b = entries[current + 1];

			if (equalMap(a.attributes, b.attributes))
			{
				a.region.b = b.region.b;
				entries.splice(current + 1, 1);
				end--;
			}
			else current++;
		}
	}

	function indexOfEntryForIndex(characterIndex:Int, split:Bool):Int
	{
		var index = indexOfEntryWithIndex(characterIndex);

		if (index < 0)
			return index;

		var entry = entries[index];

		if (entry.region.a == characterIndex || (entry.region.b - 1 == characterIndex && !split))
			return index;
		
		var newEntries = splitEntryAtIndex(entry, characterIndex);
		entries.splice(index, 1);
		entries.insert(index, newEntries[0]);
		entries.insert(index + 1, newEntries[1]);
		
		return index + 1;
	}

	static function splitEntryAtIndex(entry:RegionEntry, index:Int):Array<RegionEntry>
	{
		var newEntry = copyEntry(entry);
		var cachedIndex = entry.region.b;

		entry.region.b = index;
		newEntry.region.a = index;
		newEntry.region.b = cachedIndex;
		
		return [entry, newEntry];
	}

	static function makeEntry(region:Region, attributes:Map<String, String>)
	{
		return { region:region, attributes:copyMap(attributes) };
	}

	static function copyEntry(entry:RegionEntry)
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

	static function equalMap(a:Attributes, b:Attributes):Bool
	{
		if (a.array().length != b.array().length)
			return false;
		for (key in a.keys())
			if (a.get(key) != b.get(key)) return false;
		return true;
	}
}

typedef RegionEntry =
{
	region:Region,
	attributes:Attributes
}

class BinarySearch
{
	/**
		Recursive implementation of binary search.
		
		@param aLow Indices here and lower do not contain the needle.
		@param aHigh Indices here and higher do not contain the needle.
		@param aNeedle The element being searched for.
		@param aHaystack The non-empty array being searched.
		@param aCompare Function which takes two elements and returns -1, 0, or 1.
	**/
	static function recursiveSearch(aLow:Int, aHigh:Int, aNeedle:Dynamic, 
		aHaystack:Array<Dynamic>, aCompare:Dynamic -> Dynamic -> Int):Int
	{
		// This function terminates when one of the following is true:
		//
		//   1. We find the exact element we are looking for.
		//
		//   2. We did not find the exact element, but we can return the next
		//      closest element that is less than that element.
		//
		//   3. We did not find the exact element, and there is no next-closest
		//      element which is less than the one we are searching for, so we
		//      return null.
		var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		var cmp = aCompare(aNeedle, aHaystack[mid]);
		if (cmp == 0) {
		  // Found the element we are looking for.
		  return mid;
		}
		else if (cmp > 0) {
		  // aHaystack[mid] is greater than our needle.
		  if (aHigh - mid > 1) {
			// The element is in the upper half.
			return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
		  }
		  // We did not find an exact match, return the next closest one
		  // (termination case 2).
		  return -1;
		}
		else {
		  // aHaystack[mid] is less than our needle.
		  if (mid - aLow > 1) {
			// The element is in the lower half.
			return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
		  }
		  // The exact needle element was not found in this haystack. Determine if
		  // we are in termination case (2) or (3) and return the appropriate thing.
		  return aLow < 0
			? -1
			: aLow;
		}
	}

	/**
		This is an implementation of binary search which will always try and return
		the next lowest value checked if there is no exact hit. This is because
		mappings between original and generated line/col pairs are single points,
		and there is an implicit region between each of them, so a miss just means
		that you aren't on the very start of a region.
		
		@param aNeedle The element you are looking for.
		@param aHaystack The array that is being searched.
		@param aCompare A function which takes the needle and an element in the
			array and returns -1, 0, or 1 depending on whether the needle is less
			than, equal to, or greater than the element, respectively.
	**/
	public static function search(aNeedle:Dynamic, aHaystack:Array<Dynamic>, 
		aCompare:Dynamic -> Dynamic -> Int)
	{
		return aHaystack.length > 0
			? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
			: null;
	};
}
