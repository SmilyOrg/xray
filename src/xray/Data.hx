package xray;

class RefModel<T>
{
	public static function of<T>(inst:T)
	{
		return new RefModel<T>(inst);
	}

	public var t:Dynamic;

	public function new(t:Dynamic)
	{
		this.t = t;
	}

	public function get():T
	{
		return t;
	}

	public function toString()
	{
		return Std.string(t);
	}
}
