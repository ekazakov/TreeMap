

var global = {};

function step(svg, params ){
 	var start = params[0];
 	var end = params[1];
 	 
	var paths = [];
	var i = 0;
	var ctx = this;
	
	$.each(global.items, function(key, item){
		paths.push( sectionPath(svg, item).path() );
		$.each( ctx.animDeltas[i], function(key, value){
			item[key] += value;
		})

		i++;
	})

	$("path:not(.hidden)").each(function(index, item){
		$(item).attr({d: paths[index]} )
	})

}

function filter(oldSet, newSet) {
	var collection = {};
	
	$.each(oldSet, function(key, item){
		if ( newSet[key] ) collection[key] = item;
	})
	
	return collection;
}

function initAnimProp(keys, start, end) {
	var i = 0;
	var prop = {};
	
	for( i = 0; i < keys.length; i++) {
		prop[keys[i]] = {};
		prop[keys[i]].start = start[keys[i]];
		prop[keys[i]].end = end[keys[i]]; 
	}
	
	return prop;
}

function stepIn(event) {
	var svg = event.data.svg;
	var animProps = [];
	var i = 0;
	
	var oldSet = global.currentTree.getChildrenAndSelf();	
	
	global.oldTree = global.currentTree; 
	global.currentTree = global.currentTree.getSubtreeById($(event.target).data("id"));
	
	var id = global.currentTree.root.id //global.dt.getParentSubTreeById(global.currentTree.root.id).root.id;
	
	$("#back").data("id", id )
	
	var newSet = global.currentTree.getChildrenAndSelf();
	
	$.each(oldSet, function(key, item){
		if ( !newSet[key] ) $("#" + key).attr("class","hidden"); /**/
	}); 
		
	var oldSet = filter(oldSet, newSet);
	
	$.each(oldSet, function(key, item){
		animProps.push( initAnimProp( ["angle", "offsetAngle", "inR", "outR"], 
									  oldSet[key], 
									  newSet[key]));
	})
	
	global.items = {};
	$.each(oldSet, function(key, item){
		global.items[key] = item.getNodeParams();
	})	
	
	global.animation.init(animProps, 300, 10, { 
		step: { 
				fun: step, 
				args: [oldSet, newSet]
			  }
	});
	
	global.animation.start(svg);
	
	drawFilesList(global.currentTree.root)
	drawBreadCrumbs(global.currentTree.root.id)

}

function stepOut(event) {
	var svg = event.data.svg;
	var animProps = [];
	var i = 0;

	var oldSet = global.currentTree.getChildrenAndSelf()//
	global.currentTree = global.dt.getParentSubTreeById( $(event.target).data("id") ); //global.currentTree.root.id
		
	$("#back").data("id", global.currentTree.root.id)
	
	var newSet = global.currentTree.getChildrenAndSelf(); 
	var paths = [];

	$.each(oldSet, function(key, item){
		animProps.push( initAnimProp( ["angle", "offsetAngle", "inR", "outR"], 
									  oldSet[key], 
									  newSet[key] ));
	})
	
	global.items = {};
	
	$.each(oldSet, function(key, item){
		global.items[key] = item.getNodeParams();
	})	

	global.animation.init(animProps, 300, 10, { 
		step: { 
				fun: step, 
				args: [oldSet, newSet]
			  },
		after: {
			fun: function(){
				$.each(newSet, function(key, item){
					if (!item.isRoot) paths.push( sectionPath(svg, item.getNodeParams()).path() );
				})
			
				$.each(newSet, function(key, item){
					if (!item.isRoot) $("#"+key).attr("class", "")
				})
				
				$("path:not(.hidden)").each(function(index, item){
					$(item).attr({d: paths[index]} )
				})
			
			},
			args: []
		} 	  
	});
	
	global.animation.start(svg);

	drawFilesList(global.currentTree.root)
	drawBreadCrumbs(global.currentTree.root.id)

}

function onHover(event){
	var $data = $(event.target).data()
	
	if ( event.type == "mouseenter") {
		$("#{0}".format($data.id)).attr("fill", "blue")
	} else if ( event.type == "mouseleave") {
		$("#{0}".format($data.id)).attr("fill", "red")
	}
}

function drawBreadCrumbs(id) {
	var collection = [];
	var item = global.dt.getItemById(id);
	var $bread_crumbs = $("#bread_crumbs");
	var $children = $bread_crumbs.children();
	
	if ( $children.length > 0) {
		$children.remove();
	}
	
	collection.unshift({id: item.id, name: item.name})
	
    while ( item.parent ) {
  	    item = item.parent;
	    collection.unshift({id: item.id, name: item.name})
    }

	for( var i = 0; i < collection.length; i++) {
		var str = "<a href=\"#\" id=\"bc_{0}\" class=\"bread_crumbs_item\">{1} </a>"
		str = str.format(i, collection[i].name);
		
		var $elem = $(str);
		$bread_crumbs.append($elem) 
	}
	
	
	for( i =0; i < collection.length - 1; i++ ) {
		$("#bc_" + i).data("id",  collection[i+1].id ).on('click', {svg: global.svg}, stepOut );
	}
}

function drawFilesList(node) {

	var $filesList = $("#files_list")
	var $children = $filesList.children();
	
	if ( $children.length > 0) {
		$children.remove();
	}

	$("#current_folder").text(node.name)
	
	$.each(node.children, function(index, item){
		var str = "<div id=\"fi_{1}\" class=\"file_item\">{0}</div>".format(item.name, index);

		var element = $(str).data("id", item.id)
							.on("hover", onHover)
							.on("click", {svg: global.svg}, stepIn)
		$filesList.append(element);			
	})
}


function onDrop(event){
		event.preventDefault();
		event.stopPropagation();	
		
		var items = event.originalEvent.dataTransfer.items;
		
		if ( items.length == 1) {
			var entry = items[0].webkitGetAsEntry()
	
			global.counter = 0;
			global.data = {};
		
			traverseFileTree(entry, global.data, null);
			
			setTimeout(function(){

				initData(global.data);
				initTree();
				
				console.log(global.data)

			}, 200);
		}
		
		
}

function foo() {
	
}

function initTree() {
	global.dt = new dataTree();
	global.currentTree = global.dt;
	global.dt.init(global.data, {})
		
	nodes = global.currentTree.getChildrenAndSelf();

	drawSectorDiagram(global.svg, nodes);
	
	
	$("path").on('click', {svg: global.svg},  stepIn);
	$("#back").on('click', {svg: global.svg}, stepOut)
	
	drawFilesList(global.currentTree.root)
	drawBreadCrumbs(global.currentTree.root.id)
}

function reset() {
	global.data = {}
	
	$("#canvas").children().remove();
}

$(document).ready(function(){
	var svg, nodes;
	$("#canvas").svg({settings: {width: "100%", height: "100%"} });
	svg = $("#canvas").svg("get");
	global.svg = svg;
	
	$("#canvas").on("drop", onDrop );
	
});




