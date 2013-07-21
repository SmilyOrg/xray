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

	function search(source:String, region:Region):Array<Scope>
	{
		var regions = [region];
		var scopes = [];

		for (pattern in definition.patterns)
		{
			var i = 0;
			while (true)
			{
				var region = regions[i];
				
				if (pattern.match.matchSub(source, region.a, region.b - region.a))
				{
					var pos = pattern.match.matchedPos();
					var match = new Region(pos.pos, pos.pos + pos.len);
					var left = new Region(region.a, match.a);
					var right = new Region(match.b, region.b);

					regions.splice(i, 1);
					scopes.push({region:match, name:pattern.name});

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

		return scopes;
	}

	public function process(source:String)
	{
		return search(source, new Region(0, source.length));

		var ranges = [[0,source.length]];
		var result = [];

		for (pattern in definition.patterns)
		{
			else
			{
				var i = 0;
				while (true)
				{
					var range = ranges[i];
					
					if (pattern.begin.matchSub(source, range[0], range[1]))
					{
						var pos = pattern.begin.matchedPos();
						if (pattern.end.matchSub(source, (pos.pos + pos.len), range[1] + ((pos.pos + pos.len) - range[0])))
						{
							var pos2 = pattern.end.matchedPos();
							pos.len = (pos2.pos + pos2.len) - pos.pos;

							for (pattern in pattern.patterns)
							{
								while (true)
								{
									if (pattern.match.matchSub(source, pos.pos, pos.len))
									{
										var subPos = pattern.match.matchedPos();
										trace(subPos.pos + subPos.len >= pos2.pos && subPos.pos + subPos.len <= pos2.pos + pos2.len);
										trace(pattern.match.matched(0));
									}
								}
							}

							ranges.splice(i, 1);
							result.push({region:new Region(pos.pos, pos.pos + pos.len), name:pattern.name});

							var left = [range[0], pos.pos - range[0]];
							var right = [pos.pos + pos.len, range[1] - (left[1] + pos.len)];

							if (right[1] > 0) ranges.insert(i, right);
							if (left[1] > 0)
							{
								ranges.insert(i, left);
								i++;
							}
						}
						else i++;
					}
					else i++;

					if (i > ranges.length - 1) break;
				}
			}
		}

		return result;
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
	end:EReg,
	patterns:Array<Pattern>
}
