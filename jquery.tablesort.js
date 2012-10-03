/*
	A simple, lightweight jQuery plugin for creating sortable tables.
	https://github.com/kylefox/jquery-tablesort
	Version 0.0.1
*/

$(function() {

	var $ = window.jQuery;

	function stringToNumber(value) {
		/**
		 * Interesting facts about JavaScript:
		 *
		 * 1. NaN != NaN
		 * 2. If you pass a string to parseFloat(), it returns NaN
		 *
		 * These facts can be exploited to convert string numbers into numbers.
		 */
		var floatValue = parseFloat(value);
		return floatValue != floatValue ? value : floatValue;
	}

	function sortValueForCell(th, td, sorter) {
		var value;
		if(th.data().sortBy) {
			var sortBy = th.data().sortBy;
			return (typeof sortBy === 'function') ? sortBy(th, td, sorter) : sortBy;
		}
		if(td.data().sortValue) {
			value = td.data().sortValue;
		} else {
			value = td.text();
		}
		return stringToNumber(value);
	}

	$.tablesort = function ($table, settings) {
		var self = this;
		this.$table = $table;
		this.$thead = this.$table.find('thead');
		this.settings = $.extend({}, $.tablesort.defaults, settings);
		this.$table.find('th').bind('click.tablesort', function() {
			self.sort($(this));
		});
		this.index = null;
		this.$th = null;
		this.direction = null;
	};

	$.tablesort.prototype = {

		sort: function(th, direction) {
			var start = new Date(),
				self = this,
				table = this.$table,
				rows = this.$thead.length > 0 ? table.find('tbody tr') : table.find('tr').has('td'),
				aRow,
				bRow,
				aIndex,
				bIndex,
				cache = [];

			if(rows.length === 0)
				return;

			self.$table.find('th').removeClass(self.settings.asc + ' ' + self.settings.desc);

			this.index = th.index();
			this.$th = th;
			
			if(direction !== 'asc' && direction !== 'desc')
				this.direction = this.direction === 'asc' ? 'desc' : 'asc';
			else
				this.direction = direction;

			direction = this.direction == 'asc' ? 1 : -1;

			self.$table.trigger('tablesort:start', [self]);
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
			self.$table.trigger('tablesort:complete', [self]);

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
			this.$table.find('th').unbind('click.tablesort');
			this.$table.data('tablesort', null);
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
				previous.destroy();
			}
			table.data('tablesort', new $.tablesort(table, settings));
		});
	};

});