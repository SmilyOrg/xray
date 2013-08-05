package edit;

class Settings
{
	var values:Map<String, Dynamic>;

	public function new(json:Dynamic)
	{
		values = new Map<String, Dynamic>();
		for (field in Reflect.fields(json))
			values.set(field, Reflect.field(json, field));
	}

	inline public function get(key:String)
	{
		return values.get(key);
	}
}
