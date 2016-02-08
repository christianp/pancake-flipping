function deal(n) {
	var o = [];
	for(var i=0;i<n;i++) {
		o.push(i);
	}
	for(var i=n-1;i>=0;i--) {
		var j = Math.floor(Math.random()*i);
		var t = o[i];
		o[i] = o[j];
		o[j] = t;
	}
	return o;
}

function make_element(name,attrs,content) {
	var e = document.createElement(name);
	for(var key in attrs) {
		e.setAttribute(key,attrs[key]);
	}
	if(content!==undefined) {
		e.innerHTML = content;
	}
	return e;
}

var stack_element = document.getElementById('stack');
var prefix_element = stack_element.querySelector('.prefix');
var rest_element = stack_element.querySelector('.rest');

function Stack(order) {
	var s = this;

	this.order = order;
	this.num_moves = 0;
	this.stack = [];
	this.flipping = false;

	stack_element.querySelector('.num-moves').innerText = '0 moves';

	prefix_element.innerHTML = '';
	rest_element.innerHTML = '';
	
	for(var i=order.length-1;i>=0;i--) {
		this.add_pancake(this.order[i]+1);
	}


}
Stack.prototype = {
	add_pancake: function(n) {
		if(n===undefined) {
			n = 1;
			while(this.stack.indexOf(n)!=-1) {
				n += 1;
			}
		}
		var s = this;
		this.stack.splice(0,0,n);
		var e = make_element('li',{class:'pancake'});
		var img = make_element('img',{src:'pancake.png'});
		e.appendChild(img);
		var filter = 'brightness('+1/Math.pow(n,1/3)+')';
		img.style['filter'] = filter;
		img.style['-webkit-filter'] = filter;
		e.appendChild(make_element('span',{class:'number'},n));
		e.addEventListener('mouseover',function() {
			if(s.flipping) {
				return;
			}
			var ee = e;
			while(ee) {
				ee.classList.add('toflip');
				ee = ee.previousSibling;
			}
		})
		e.addEventListener('mouseout',function() {
			if(s.flipping) {
				return;
			}
			var ee = e;
			while(ee) {
				if(ee.classList) {
					ee.classList.remove('toflip');
				}
				ee = ee.previousSibling;
			}
		})
		e.addEventListener('click',function() {
			var k = 0;
			var ee = e;
			while(ee) {
				k += 1;
				ee = ee.previousSibling;
			}
			s.flip(k);
		})
		rest_element.insertBefore(e,rest_element.firstChild);
	},
	remove_pancake: function() {
		if(this.flipping) {
			return;
		}
		this.stack = this.stack.slice(1);
		rest_element.removeChild(rest_element.firstChild);
	},
	flip: function(n) {
		if(this.flipping) {
			return;
		}
		for(var i=0;i<n;i++) {
			rest_element.firstChild.classList.remove('toflip');
			prefix_element.appendChild(rest_element.firstChild);
		}
		this.flipping = true;
		this.num_flip = n;
		stack_element.classList.add('flipping');
		prefix_element.classList.add('flip');
		this.num_moves += 1;
		stack_element.querySelector('.num-moves').innerText = this.num_moves+(this.num_moves==1 ? ' move' : ' moves');
	},
	endFlip: function() {
		while(prefix_element.firstChild) {
			rest_element.insertBefore(prefix_element.firstChild,rest_element.firstChild);
		}
		stack_element.classList.remove('flipping');
		prefix_element.classList.remove('flip');
		this.flipping = false;
	}
}

var stack;
var num_pancakes = 8;
var first_order;

document.getElementById('reset').addEventListener('click',reset);
document.getElementById('add-one').addEventListener('click',function() {
	stack.add_pancake();
});
document.getElementById('remove-one').addEventListener('click',function() {
	stack.remove_pancake();
});
prefix_element.addEventListener('animationend',function(e){
	if(e.animationName!='flip') {
		return;
	}
	stack.endFlip(e)
});

if(location.search) {
	var bits = location.search.slice(1).split('&');
	var obj = {}
	for(var i=0;i<bits.length;i++) {
		var d = bits[i].split('=');
		obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
	}

	if('num_pancakes' in obj) {
		num_pancakes = parseInt(obj['num_pancakes']);
	}
	if('order' in obj) {
		first_order = obj['order'].split(',').map(function(v){return parseInt(v)-1});
	}
	if('num_pancakes' in obj || 'order' in obj) {
		document.getElementById('add-one').style.display = 'none';
		document.getElementById('remove-one').style.display = 'none';
	}
}

function reset() {
	var order = first_order || deal(num_pancakes);
	stack = new Stack(order);
}
reset();
