$(function() {

	var $ = window.jQuery;

	function sortValueForCell(th, td, sorter) {
		if(th.data().sortBy) {
			var sortBy = th.data().sortBy;
			return (typeof sortBy === 'function') ? sortBy(th, td, sorter) : sortBy;
		}
		if(td.data().sortValue) {
			return td.data().sortValue;
		} else {
			return td.text();
		}
	}

	$.tablesort = function ($el, settings) {
		var self = this;
		this.$el = $el;
		this.settings = $.extend({}, $.tablesort.defaults, settings);
		this.$el.find('thead th').bind('click.tablesort', function() {
			self.sort($(this));
		});
		this.index = null;
		this.th = null;
		this.direction = null;
	};

	$.tablesort.prototype = {

		sort: function(th) {
			var start = new Date(),
				self = this,
				table = this.$el,
				rows = table.find('tbody tr'),
				direction,
				aRow,
				bRow,
				aIndex,
				bIndex,
				cache = [];

			if(rows.length === 0)
				return;

			self.$el.find('thead th').removeClass(self.settings.asc + ' ' + self.settings.desc);

			this.index = th.index();
			this.th = th;
			this.direction = this.direction === 'asc' ? 'desc' : 'asc';
			direction = this.direction == 'asc' ? 1 : -1;

			self.$el.trigger('tablesort:start', [self]);
			self.log("Sorting by " + this.index + ' ' + this.direction);

			rows.sort(function(a, b) {
				aRow = $(a);
				bRow = $(b);
				aIndex = aRow.index();
				bIndex = bRow.index();

				// Sort value A
				if(cache[aIndex]) {
					a = cache[aIndex];
				} else {
					a = sortValueForCell(th, self.cellToSort(a), self);
					cache[aIndex] = a;
				}

				// Sort Value B
				if(cache[bIndex]) {
					b = cache[bIndex];
				} else {
					b = sortValueForCell(th, self.cellToSort(b), self);
					cache[bIndex]= b;
				}

				if(a > b) {
					return 1 * direction;
				} else if(a < b) {
					return -1 * direction;
				} else {
					return 0;
				}
			});

			rows.each(function(i, tr) {
				table.append(tr);
			});

			th.addClass(self.settings[self.direction]);

			self.log('Sort finished in ' + ((new Date()).getTime() - start.getTime()) + 'ms');
			self.$el.trigger('tablesort:complete', [self]);

		},

		cellToSort: function(row) {
			return $($(row).find('td').get(this.index));
		},


		log: function(msg) {
			if(($.tablesort.DEBUG || this.settings.debug) && console && console.log) {
				console.log('[tablesort] ' + msg);
			}
		},

		destroy: function() {
			this.$el.find('thead th').unbind('click.tablesort');
			return null;
		}

	};

	$.tablesort.DEBUG = false;

	$.tablesort.defaults = {
		debug: $.tablesort.DEBUG,
		asc: 'sorted ascending',
		desc: 'sorted descending'
	};

	$.fn.tablesort = function(settings) {
		var table, sortable, previous;
		return this.each(function() {
			table = $(this);
			previous = table.data('tablesort');
			if(previous) {
				table.data('tablesort', previous.destroy());
			}
			table.data('tablesort', new $.tablesort(table, settings));
		});
	};

});