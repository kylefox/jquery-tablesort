$(function() {

	function bm(f) {
		var s = new Date(),
			e;
		f();
		e = new Date();
		return e.getTime() - s.getTime();
	}

	function debug(msg) {
		if(console && console.log) {
			console.log('[tablesort] ' + msg);
		}
	}

	function SortableTable($el) {
		var self = this;
		this.$el = $el;
		this.$el.find('thead th').bind('click.tablesort', function() {
			var time = self.sortBy($(this));
			debug("Sorted in " + time + 'ms');
		});
		this.index = null;
		this.direction = null;
	}

	SortableTable.prototype = {

		sortBy: function(th) {
			var self = this;
			return bm(function() {
				self.sort(th.index());
			});
		},

		sort: function(column) {
			var self = this,
				table = this.$el,
				rows = table.find('tbody tr'),
				direction;

			if(rows.length === 0)
				return;

			this.index = column;
			this.direction = this.direction === 'asc' ? 'desc' : 'asc';
			direction = this.direction == 'asc' ? 1 : -1;
			debug("Sorting by " + this.index + ' ' + this.direction);

			rows.sort(function(a, b) {
				a = self.sortValueForCell(self.cellToSort(a));
				b = self.sortValueForCell(self.cellToSort(b));
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

		},

		cellToSort: function(row) {
			return $($(row).find('td').get(this.index));
		},

		sortValueForCell: function(cell) {
			return cell.text();
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