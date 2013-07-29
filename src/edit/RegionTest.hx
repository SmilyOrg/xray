package edit;

class RegionTest
{
	static function main()
	{
		// (-){-}
		// (-)
		testSubtract(0, 1, 1, 2, 0, 1);
		// {-}(-)
		// (-)
		testSubtract(1, 2, 0, 1, 0, 1);
		// {-(-})
		// ()
		testSubtract(1, 2, 0, 2, 0, 0);
		// (-{-}-)
		// (--)
		testSubtract(0, 3, 1, 2, 0, 2);
	}

	static function testSubtract(a1:Int, b1:Int, a2:Int, b2:Int, a3:Int, b3:Int)
	{
		var r1 = new Region(a1, b1);
		var r2 = new Region(a2, b2);
		r1.subtract(r2);
		if (r1.a != a3 || r1.b != b3) throw '\n(${r1.a} -> ${r1.b}) should be\n($a3 -> $b3)';
	}
}