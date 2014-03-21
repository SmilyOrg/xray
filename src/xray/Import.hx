package xray;

import haxe.macro.Context;
import haxe.macro.Compiler;
import sys.FileSystem;
using Lambda;
using StringTools;

class Import
{
	public static function importAll()
	{
		var classPaths = getClassPaths();
		for (path in classPaths) includePath(path);
	}

	public static var platform = getPlatform();
	public static var std = switch(Sys.systemName()) {
		case "Windows":
			var path = Sys.getEnv("HAXE_STD_PATH");
			if (path == null) Sys.getEnv("HAXEPATH") + "/std/";
			else path;
		case _: Sys.getEnv("HAXE_STD_PATH").split(":")[0];
	}
		
	public static function getClassPaths():Array<String>
	{
		var classPaths = Context.getClassPath();
		classPaths = classPaths.filter(FileSystem.exists);
		classPaths = classPaths.map(normalizePath);
		return classPaths;
	}

	static function getPlatform()
	{
		var platforms = ["js", "flash8", "flash", "cpp", "cs", "java", "neko", "php"];
		for (platform in platforms)
			if (Context.defined(platform)) return platform;
		throw "Unknown platform";
	}

	static function normalizePath(path:String)
	{
		path = path.split("\\").join("/");
		if (StringTools.endsWith(path, "/"))
			path = path.substr(0, -1);
		if (path == "")
			path = ".";
		return path;
	}

	static function includePath(path:String, ?pack:String="")
	{
		
		if (path == "src") return;
		if (path == ".") return;
		if (path.endsWith("_std")) return;
		
		if (pack != null && pack == "cpp") return;
		if (pack != null && pack == "cs") return;
		if (pack != null && pack == "flash") return;
		if (pack != null && pack == "flash8") return;
		if (pack != null && pack == "java") return;
		if (pack != null && pack == "js") return;
		if (pack != null && pack == "php") return;
		if (pack != null && pack == "format") return;
		
		trace('include path $path $pack');
		
		for (file in FileSystem.readDirectory(path))
		{
			if (file == "web" && !Context.defined("neko")) continue;
			// if (file == "web") continue;
			if (file == "SocketWrapper.hx") continue;
			if (file == "SyncSocketConnection.hx") continue;
			if (file == "ExampleJSGenerator.hx") continue;
			
			trace('loop $file');

			if (file.charAt(0) == "_" || file.charAt(0) == "." || file.indexOf("-") > -1) continue;
			var entry = path + "/" + file;

			if (FileSystem.isDirectory(entry))
			{
				if (path == std && file != platform && file != "haxe") continue;
				includePath(entry, (pack == "" ? file : pack + "." + file));
			}
			else
			{
				if (!file.endsWith(".hx")) continue;

				var module = file.substr(0, -3);
				module = (pack == "" ? module : pack + "." + module);
				Context.getModule(module);
			}
		}
	}
}
