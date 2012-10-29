
function traverseFileTree(entry, item, parent) {
	item.id = "s_" + global.counter;
	item.parent = parent;
	
	global.counter++; 	

	if (entry.isFile) {
		entry.file(function(file) {
			item.name = file.name;
			item.size = file.size;
			item.isFile = true;
		});
		
		return item.size;
		
	} else if (entry.isDirectory) {
		
		
		item.name = entry.name;
		item.isFile = false;
		item.size = 0;
		
		var dirReader = entry.createReader();	
		
		dirReader.readEntries( function(entries) {
			item.children = [];
			
			if ( entries.length > 0) {
								
				for ( var i=0; i < entries.length; i++) {
					item.children.push({});
					 
					traverseFileTree(entries[i], item.children[i], item );
				}
				
			}	
			
		},		
		function(){
			console.log(arguments)
		});
	
	}
	
	return 0;
}

function initData(item) {
	var initSize = function(item) {
		var i = 0;
		var size = 0;
		
		if ( !item.isFile && item.children ) {	
			for( i = 0; i < item.children.length; i++ ) {
				size += initSize(item.children[i])
			}
			item.size = size;
		}
		
		return item.size;
	}
	
	
	var initPercent = function(item){
		var i = 0;
		
		if ( !item.isFile && item.children ) {	
			for( i = 0; i < item.children.length; i++ ) {
				initPercent(item.children[i])
			}
		}
		
		if ( item.parent ) {
			item.percent = item.size / item.parent.size;
		} else {
			item.percent = 1;
		}

	}
	
	initSize(item);
	initPercent(item);
	
}
 