package edit;

using Reflect;

class Language
{
	var definition:LanguageDef;

	public function new(source:String)
	{
		definition = revive(haxe.Json.parse(source));
	}

	function revive(json:Dynamic)
	{
		for (field in json.fields())
		{
			var value:String = json.field(field);
			
			if (Std.is(value, String))
			{
				switch (field)
				{
					case "match", "begin", "end":
						json.setField(field, new EReg(value, ""));
					default:
				}
			}
			else if (Std.is(value, Array))
			{
				var array:Array<Dynamic> = cast value;
				for (value in array) revive(value);
			}
			else
			{
				revive(value);
			}
		}

		return json;
	}

	public function process(source:String):Array<Scope>
	{
		var region = new Region(0, source.length);
		var regions = [region];
		var scopes = [];

		for (pattern in definition.patterns)
		{
			var i = 0;
			while (true)
			{
				if (i > regions.length - 1) break;
				var region = regions[i];
				var match = search(source, region, pattern, scopes);
				
				if (match != null)
				{
					var left = new Region(region.a, match.a);
					var right = new Region(match.b, region.b);

					regions.splice(i, 1);

					if (right.size() > 0)
					{
						regions.insert(i, right);
					}

					if (left.size() > 0)
					{
						regions.insert(i, left);
						i++;
					}
				}
				else i++;
			}
		}

		scopes.reverse();
		return scopes;
	}

	public function search(source:String, region:Region, pattern:Pattern, scopes:Array<Scope>):Region
	{
		return if (pattern.match != null) searchMatch(source, region, pattern, scopes);
		else searchRange(source, region, pattern, scopes);
	}

	public function searchMatch(source:String, region:Region, pattern:Pattern, scopes:Array<Scope>):Region
	{
		if (!pattern.match.matchSub(source, region.a, region.b - region.a)) return null;

		var matchPos = pattern.match.matchedPos();
		var matchRegion = new Region(matchPos.pos, matchPos.pos + matchPos.len);
		var matchScope = {region:matchRegion, name:pattern.name};
		
		if (pattern.captures != null)
			processCaptures(matchRegion, pattern.captures, pattern.match, scopes);
		scopes.push(matchScope);

		return matchRegion;
	}

	public function searchRange(source:String, region:Region, pattern:Pattern, scopes:Array<Scope>):Region
	{
		if (!pattern.begin.matchSub(source, region.a, region.b - region.a)) return null;
		
		var beginPos = pattern.begin.matchedPos();
		var range = new Region(beginPos.pos, beginPos.pos + beginPos.len);

		var end = pattern.end;
		if (!end.matchSub(source, range.b, region.b - range.b)) return null;
		var endPos = end.matchedPos();
		
		range.b = endPos.pos + endPos.len;
		var regions = [range];
		var subScopes = [];

		if (pattern.patterns != null)
		{
			for (pattern in pattern.patterns)
			{
				var i = 0;
				while (true)
				{
					var subRegion = regions[i];
					var match = search(source, subRegion, pattern, scopes);
					
					if (match != null)
					{
						if (match.b == range.b)
						{
							if (!end.matchSub(source, range.b, subRegion.b - region.b)) return null;
							endPos = end.matchedPos();
							var newEnd = endPos.pos + endPos.len;
							regions.push(new Region(range.b, newEnd));
							range.b = newEnd;
						}

						var left = new Region(subRegion.a, match.a);
						var right = new Region(match.b, subRegion.b);

						regions.splice(i, 1);
						subScopes.push({region:match, name:pattern.name});

						if (right.size() > 0)
						{
							regions.insert(i, right);
						}

						if (left.size() > 0)
						{
							regions.insert(i, left);
							i++;
						}
					}
					else i++;

					if (i > regions.length - 1) break;
				}
			}
		}

		if (pattern.beginCaptures != null)
			processCaptures(range, pattern.beginCaptures, pattern.begin, scopes);
		if (pattern.endCaptures != null)
			processCaptures(range, pattern.endCaptures, pattern.end, scopes);
		scopes.push({region:range, name:pattern.name});

		return range;
	}

	function processCaptures(region:Region, captures:Dynamic, match:EReg, scopes:Array<Scope>)
	{
		for (field in captures.fields())
		{
			var capture = captures.field(field);
			var group = Std.parseInt(field);
			var string = match.matched(group);
			var index = match.matchedPos().pos + match.matched(0).indexOf(string);

			var captureRegion = new Region(index, index + string.length);
			var captureScope = {region:captureRegion, name:capture.name};
			
			// if (captureRegion.a == region.a) region.a = captureRegion.b;
			// if (captureRegion.b == region.b) region.b = captureRegion.a;
			scopes.push(captureScope);
		}
	}
}

typedef Scope = {
	region:Region,
	name:String
}

typedef LanguageDef = {
	name:String,
	scopeName:String,
	fileTypes:Array<String>,
	patterns:Array<Pattern>
}

typedef Pattern = {
	name:String,
	match:EReg,
	begin:EReg,
	beginCaptures:Dynamic,
	end:EReg,
	endCaptures:Dynamic,
	patterns:Array<Pattern>,
	captures:Dynamic
}
