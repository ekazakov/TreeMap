global.animation = {};

with(global) {

	

	animation.init = function(animProp, delay, frameInterval, params) {
		var j = 0;
		var ctx = this;
	
		this.params = params;
	
		this.stepCounter = 0;
		this.delay = delay;
		this.frameInterval = frameInterval;
		this.maxStepsCount = this.delay / this.frameInterval;
		this.animDeltas = [];
		
		for( j = 0; j < animProp.length; j++ ) {
			this.animDeltas[j] = {}
			
			$.each(animProp[j], function(key, value){
				ctx.animDeltas[j][key] = (animProp[j][key].end - animProp[j][key].start) / ctx.maxStepsCount;
			})
		}
		
	}

	
	animation.start = function(svg, params){
		var ctx = this;
/* 		var step = params.step */
		
		this.intervalID = setInterval( function() { 
			
			if ( ctx.stepCounter <= ctx.maxStepsCount ) {
				ctx.params.step.fun.call(ctx, svg, ctx.params.step.args)
			} else {
				ctx.stop()
			}
			
			ctx.stepCounter++;
			
		}, this.frameInterval);
	}
	
	animation.stop = function(){
		clearInterval(this.intervalID);
		
		if ( this.params && this.params.after )
			this.params.after.fun.call(this.params.after.args)
	}
}