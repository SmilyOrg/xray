package edit;

class Edit
{
	var view:Editor;
	var operations:Array<EditOperation>;

	public function new(view:Editor)
	{
		this.view = view;
		this.operations = [];
	}

	public function insert(point:Int, string:String)
	{
		operations.push(Insert(new Region(point, point + string.length), string));
	}

	public function erase(region:Region)
	{
		operations.push(Erase(region, view.substr(region)));
	}

	public function undo()
	{
		var len = operations.length;
		for (i in 0...len)
		{
			var operation = operations[len - (i + 1)];
			switch (operation)
			{
				case Erase(region, string):
					view.insert(null, region.begin(), string);
				case Insert(region, string):
					view.erase(null, region);
			}
		}
	}

	public function redo()
	{
		var len = operations.length;
		for (i in 0...len)
		{
			var operation = operations[i];
			switch (operation)
			{
				case Erase(region, string):
					view.erase(null, region);
				case Insert(region, string):
					view.insert(null, region.begin(), string);
			}
		}
	}
}

enum EditOperation
{
	Erase(region:Region, string:String);
	Insert(region:Region, string:String);
}
