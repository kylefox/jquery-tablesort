$(function() {

	function debug(msg) {
		if(console && console.log) {
			console.log('[tablesort] ' + msg);
		}
	}

	function sortValueForCell(th, td, sorter) {
		if(th.data().sortBy) {
			var sortBy = th.data().sortBy;
			return (typeof sortBy === 'function') ? sortBy(th, td, sorter) : sortBy;
		}
		return td.text();
	}

	function SortableTable($el) {
		var self = this;
		this.$el = $el;
		this.$el.find('thead th').bind('click.tablesort', function() {
			self.sort($(this));
		});
		this.index = null;
		this.direction = null;
	}

	SortableTable.prototype = {

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

			this.index = th.index();
			this.direction = this.direction === 'asc' ? 'desc' : 'asc';
			direction = this.direction == 'asc' ? 1 : -1;

			debug("Sorting by " + this.index + ' ' + this.direction);

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

			debug('Sort finished in ' + ((new Date()).getTime() - start.getTime()) + 'ms');

		},

		cellToSort: function(row) {
			return $($(row).find('td').get(this.index));
		}

	};

	$.fn.tablesort = function() {
		var table, sortable;
		return this.each(function() {
			table = $(this);
			table.data('tablesort', new SortableTable(table));
		});
	};

});