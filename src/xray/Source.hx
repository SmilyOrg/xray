package xray;

import xray.Data;

class Source
{
	static var sources = new Array<SourceFile>();

	public static function build()
	{
		getSources(Import.std);
		var data = haxe.Serializer.run(sources);
		sys.io.File.saveContent("pages/source.txt", data);
	}

	static function getSources(classPath:String, ?path:String)
	{
		if (path == null) path = classPath;

		for (file in sys.FileSystem.readDirectory(path))
		{
			if (file.charAt(0) == "." || file.charAt(0) == "_") continue;
			
			var filePath = path + "/" + file;
			if (sys.FileSystem.isDirectory(filePath))
			{
				getSources(classPath, filePath);
			}
			else
			{
				if (StringTools.endsWith(file, ".hx"))
				{
					var local = filePath.substr(classPath.length);
					sources.push({path:filePath, local:local});
					copy(filePath, "pages/src/" + local);
				}
			}
		}
	}

	static function copy(fromPath:String, toPath:String)
	{
		var parts = toPath.split("/");
		parts.pop();
		var path = [];
		for (part in parts)
		{
			path.push(part);
			var dir = path.join("/");
			if (sys.FileSystem.exists(dir)) continue;
			sys.FileSystem.createDirectory(dir);
		}
		sys.io.File.copy(fromPath, toPath);
	}
}
