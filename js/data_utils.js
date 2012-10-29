var dataTree = function() {
	
}

Node.prototype.getAllChildren = function() {
	
}

Node.prototype.getChildren = function() {
	
}

Node.prototype.getAllExcludeSelfAndChildren = function() {
	
}

Node.prototype.getSiblings = function() {
	
}

Node.prototype.getAngle = function() {
	
}

Node.prototype.getOffsetAngle = function() {
	
}

Node.prototype.isLeaf = function() { return (this.children.length == 0); }


Node.prototype.getNodeParams = function() {
	var keys = ["id", "cx", "cy", "inR", "outR", "style", "angle", "offsetAngle" ]
	var key = null, i = 0;
	
	var result = {};
	
	for( i = 0; i < keys.length; i++ ) {
		key = keys[i];
		result[key] = this[key]; 
	}
	
	return  result;
}

function Node(params) {

	this.dataTree = params.dataTree || null;
	this.id = params.id;
	this.name = params.name;
	this.percent = params.percent;
	this.parent = params.parent || null; 
	this.level = params.level || 0;
	
	this.isRoot = params.isRoot || false;
	this.isVisible = params.isVisible || true ;
	this.cx = params.cx || 300;
	this.cy = params.cy || 300;
	
	this.inR = params.inR || 0;
	this.outR = params.outR || 0;
	this.style = params.style || {fill: 'red', stroke: 'white', strokeWidth: 1};
	
	this.absPercent = params.absPercent || this.percent;
	this.absOffset = params.absOffset || 0;
	
	this.children = [];
	this.angle = this.absPercent * 360;
	this.offsetAngle = this.absOffset * 360;

}



dataTree.prototype.init = function(data, params){
	this.data = data;
/*
	this.cx = params.cx;
	this.cy = params.cy;
	this.inR = params.inR;
	this.outR = params.outR;
	this.style = params.style;
*/
		
	this.root = new Node({ 
		dataTree: this, 
		id: data.id, 
		isRoot: true,
		name: data.name, 
		size: data.size, 
		percent: 1, 
		level: 0 
	});

	var getOffset = function(node) {
		var parent, i, offset = 0;
		
		if ( node.children ) {
			for( i = 0; i < node.children.length; i++) {
				offset += node.children[i].absPercent; 
			} 
		}
		
		return offset + node.absOffset;
	}


	var initItems = function(item, node, level) {
		var i = 0;

		if ( item.children ) {
			for( i = 0; i < item.children.length; i++) {

				var tmpNode = new Node({
					dataTree: node.dataTree,
					id: item.children[i].id, 
					name: item.children[i].name, 
					size: item.children[i].size, 
					percent: item.children[i].percent,
					inR: node.inR + 50,
					outR: node.inR + 100,
					absPercent: item.children[i].percent * node.absPercent,
					absOffset: getOffset(node),
					level: level,
					parent: node
				})
				
				node.children.push( tmpNode	);
								
				initItems(item.children[i], tmpNode, level+1);	
			}
		}
	};
	
	initItems(this.data, this.root, 1);
	
	
/* 	console.log(this.root) */
}

dataTree.prototype.getSubtreeById = function(id){
	var newRootRef = this.getItemById(id);
	
	var subTree = new dataTree();
	
	subTree.init(newRootRef);
	
/* 	console.log("new sub tree") */
/* 	console.log(subTree.root) */
	
	return subTree;
}

dataTree.prototype._getItemById = function (item, id) {
	var i = 0;
	var result = null;
	
	if ( item.id == id ) return item;
		
	if (item.children) {
		for ( i = 0; i < item.children.length; i++) {
			result = this._getItemById(item.children[i], id)	
			if ( result ) return result;
		}
	}	
		
	return null;	
}

dataTree.prototype.getItemById = function(id) {
	return this._getItemById(this.root, id)
}

dataTree.prototype._getChildren = function(item, collection) {
	var i = 0;
	
	if (item.children)
		for( i = 0; i < item.children.length; i++ ) {
/* 			collection.push(item.children[i]) */
			collection[item.children[i].id] = item.children[i];
			this._getChildren(item.children[i], collection)
		}
}

dataTree.prototype.getChildrenAndSelfById = function(id) {
	var collection = {};
	var item = this.getItemById(id);
	
	collection[item.id] = item;
	this._getChildren(item, collection);
	
	return collection;
}


dataTree.prototype.getChildrenAndSelf = function() {
	return this.getChildrenAndSelfById(this.root.id);
}

dataTree.prototype.getParentSubTreeById = function(id) {
	var newRootRef = this.getItemById(id).parent;
	
	if ( newRootRef ) {
		var subTree = new dataTree();
		subTree.init(newRootRef);
		return subTree;
	} else {
		return this;
	}
}


