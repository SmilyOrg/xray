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

	public function process(source:String)
	{
		var ranges = [[0,source.length]];
		trace(ranges.map(function(r) { return source.substr(r[0], r[1]); }).join("--"));
		for (pattern in definition.patterns)
		{
			var ereg = pattern.match;
			if (ereg == null) ereg = pattern.begin;

			var i = 0;
			while (true)
			{
				var range = ranges[i];
				
				if (ereg.matchSub(source, range[0], range[1]))
				{
					ranges.splice(i, 1);

					var pos = ereg.matchedPos();
					
					var left = [range[0], pos.pos - range[0]];
					var right = [pos.pos + pos.len, range[1] - (left[1] + pos.len)];

					if (right[1] > 0) ranges.insert(i, right);
					if (left[1] > 0)
					{
						ranges.insert(i, left);
						i++;
					}

					trace(ranges.map(function(r) { return source.substr(r[0], r[1]); }).join("|"));
				}
				else i++;

				if (i > ranges.length - 1) break;
			}
		}
	}
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
	end:EReg
}
