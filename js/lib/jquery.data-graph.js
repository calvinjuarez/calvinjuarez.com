/*
 * data-graph.js
 * ====================================================================
 * @author: Calvin Juárez
 */



+function ($,Mustache) {

	var Graph = function (element, options) {
		this.options  = $.extend({}, Graph.DEFAULTS, options)
		this.$element = $(element)
		this.origHTML = this.$element.html()
		this.type     = Graph.TYPES[this.options.type] || this.options.type || Graph.TYPES.bar
		this.rubric   = this.options.rubric ? Graph.RUBRICS[this.options.rubric] || this.options.rubric : false
		// Correct/Validate
		if (this.options.scale === '%') this.options.scale = 100
		// Set Up
		this.$element.addClass(this.type.className)
		// Draw
		return this.draw()
	}
	
	Graph.DEFAULTS = {
		  scale  : 100   // numeric values or "%"; defaults to 100; "%" is an alias for 100
		, type   : 'bar' // a type or a custom type object; defaults to 'bar'
		, rubric : false // a rubric name, an array of grades (low to high), or false; defaults to 'quality'
		, legend : false // a boolean; defaults to false
	}
	
	Graph.TYPES = {
		  bar: {
			  name      : 'bar'
			, className : 'graph graph-bar'
			, template  : $('#bar-template')[0] ?
				  $('#bar-template').html()
				: '<div class="bar bar-{{index}} grade-{{grade.index}}" style="width:{{percent}}%;" title="{{grade.name}}"><span class="label">{{{text}}}</span></div>'
		}
		, dot: {
			  name      : 'dot'
			, className : 'graph graph-dot'
			, template  : $('#dot-template')[0] ?
				  $('#dot-template').html()
				: '<span class="label">{{text}}</span><div class="dot dot-{{index}} grade-{{grade.index}}" style="position:absolute;left:{{percent}}%;" title="{{grade.name}}"></div>'
		}
	}
	
	Graph.RUBRICS = {
		  quality        : ['poor','fair','good','great','excellent']                          // 5 Grades
		, proficiency    : ['limited','beginner','comfortable','proficient','very proficient'] // 5 Grades
		, academicLetter : ['F','D','C','B','A']                                               // 5 Grades
		, academic       : ['F','D-','D','D+','C-','C','C+','B-','B','B+','A-','A','A+']       // 13 Grades
	}
	
	Graph.prototype.draw = function () {
		var items    = this.getItems()
		var template = this.type.template
		
		Mustache.parse(template)
		
		this.$element.find('[data-value]').each(function (i,item) {
			$(item).html(Mustache.render(template,items[i]))
		})
		
		if (this.options.legend && ! this.$legend) // only append a legend once
			this.$element.after(this.getLegend())
		
		return this
	}
	
	Graph.prototype.getItems = function () {
		var scale  = this.options.scale
		var rubric = this.rubric
		var items  = []
		
		this.$element.find('[data-value]').each(function (i,v) {
			var $item = $(v)
			var item  = {}
			
			item.index   = i + 1
			item.text    = $item.html().trim()
			item.value   = $item.data('value')
			item.percent = $item.data('value') / scale * 100
			item.grade   = {}
			item.grade.index = rubric ? Math.floor(item.percent / (100 / rubric.length)) : item.value
			item.grade.name  = rubric ? toTitleCase(rubric[item.grade.index - 1].replace(/-/g,'-minus').replace(/\+/g,'-plus')) : item.value + "/" + scale
			
			items[i] = item
		})
		
		return items
		
		function toTitleCase(string) {
			return string.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
			})
		}
	}
	
	Graph.prototype.getLegend = function () {
		var $legend = $('<aside class="legend"><ul class="legend-content"></ul></aside>')
		
		$.each(this.rubric, function (i,grade) {
			$legend.find('.legend-content')
				.append($('<li><i class="swatch grade-' + (i + 1) + '"></i><span class="label">' + grade + '</span></li>'))
		})
		
		return (this.$legend = $legend) // keeps track of the legend associated with this graph
	}
	
	Graph.prototype.undraw = function () {
		this.$legend && this.$legend.remove()
		this.$element.html(this.origHTML)
	}
	
	Graph.prototype.destroy = function () {
		this.undraw()
		delete this.$element.data().graph
	}


	// GRAPH PLUGIN DEFINITION
	// =======================

	var old = $.fn.graph

	$.fn.graph = function (option) {
		return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('graph')
			var options = $.extend({}, Graph.DEFAULTS, $this.data(), typeof option === 'object' && option)

			if (!data) $this.data('graph', (data = new Graph(this,options)))
			if (typeof option === 'string') data[option]()
		})
	}

	$.fn.graph.Constructor = Graph


	// GRAPH NO CONFLICT
	// =================

	$.fn.graph.noConflict = function () {
		$.fn.graph = old
		return this
	}


	// GRAPH DATA-API
	// ==============

	$(window).on('load', function () {
		$('[data-draw="graph"]').each(function () {
			var $graph = $(this)
			var data = $graph.data()
			$graph.graph(data)
		})
	})

}(jQuery,Mustache);
