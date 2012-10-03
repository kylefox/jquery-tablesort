A tiny & dead-simple jQuery plugin for sortable tables.

Here's a basic [demo](http://dl.dropbox.com/u/780754/tablesort/index.html).

Install
---

Just add jQuery & the tablesort plugin to your page:

	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script src="jquery.tablesort.js"></script>

Basic use
---

Call the appropriate method on the table you want to make sortable:

	$('table').tablesort();

The table will be sorted when the column headers are clicked.

Your table should follow this general format:

> Note: If you have access to the table markup, it's better to wrap your table rows
in `<thead>` and `<tbody>` elements (see below), resulting in a slightly faster sort.
>
> If you can't use `<thead>`, the plugin will fall back by sorting all `<tr>` rows 
that contain a `<td>` element using jQuery's `.has()` method (ie, the header row, 
containing `<th>` elements, will remain at the top where it belongs).


		<table>
			<thead>
				<tr>
					<th></th>
					...
				</tr>
			</thead>
		<tbody>
			<tr>
				<td></td>
				...
			</tr>
		</tbody>
	</table>

If you want some imageless arrows to indicate the sort, just add this to your CSS:

	th.sorted.ascending:after {
		content: "  \2191";
	}

	th.sorted.descending:after {
		content: " \2193";
	}

How cells are sorted
---

At the moment cells are naively sorted using string comparison. By default, the `<td>`'s text is used, but you can easily override that by adding a `data-sort-value` attribute to the cell. For example to sort by a date while keeping the cell contents human-friendly, just add the timestamp as the `data-sort-value`:

	<td data-sort-value="1331110651437">March 7, 2012</td>

This allows you to sort your cells using your own criteria without having to write a custom sort function. It also keeps the plugin lightweight by not having to guess & parse dates.

Currently, numbers pulled from a cell's `$.text()` return value are converted to numbers using `parseFloat()`.

Defining custom sort functions
---

If you have special requirements (or don't want to clutter your markup like the above example) you can easily hook in your own function that determines the sort value for a given cell.

Custom sort functions are attached to `<th>` elements using `data()` and are used to determine the sort value for all cells in that column:

	// Sort by dates in YYYY-MM-DD format
	$('thead th.date').data('sortBy', function(th, td, tablesort) {
		return new Date(td.text());
	});

	// Sort hex values, ie: "FF0066":
	$('thead th.hex').data('sortBy', function(th, td, tablesort) {
		return parseInt(td.text(), 16);
	});

	// Sort by an arbitrary object, ie: a Backbone model:
	$('thead th.personID').data('sortBy', function(th, td, tablesort) {
		return App.People.get(td.text());
	});

Sort functions are passed three parameters:

* the `<th>` being sorted on
* the `<td>` for which the current sort value is required
* the `tablesort` instance

Events
---

The following events are triggered on the `<table>` element being sorted, `'tablesort:start'` and `'tablesort:complete'`. The `event` and `tablesort` instance are passed as parameters:

	$('table').on('tablesort:start', function(event, tablesort) {
		console.log("Starting the sort...");
	});

	$('table').on('tablesort:complete', function(event, tablesort) {
		console.log("Sort finished!");
	});

tablesort instances
---

A table's tablesort instance can be retrieved by querying the data object:
	
	$('table').tablesort(); // Make the table sortable.
	var tablesort = $('table').data('tablesort'); // Get a reference to it's tablesort instance

Properties:

	tablesort.$table 		// The <table> being sorted.
	tablesort.$th			// The <th> currently sorted by (null if unsorted).
	tablesort.index			// The column index of tablesort.$th (or null).
	tablesort.direction		// The direction of the current sort, either 'asc' or 'desc' (or null if unsorted).
	tablesort.settings		// Settings for this instance (see below).

Methods:

	// Sorts by the specified column and, optionally, direction ('asc' or 'desc').
	// If direction is omitted, the reverse of the current direction is used.
	tablesort.sort(th, direction);

	tablesort.destroy();

Settings
---

Here are the supported options and their default values:

	$.tablesort.defaults = {
		debug: $.tablesort.DEBUG,	// Outputs some basic debug info when true.
		asc: 'sorted ascending',	// CSS classes added to `<th>` elements on sort.
		desc: 'sorted descending'
	};

You can also change the global debug value which overrides the instance's settings:

	$.tablesort.DEBUG = false;

Todos
---

* Guess common datatypes (dates, numbers, etc)
* Multi-column sorting

Contributing
---

As always, all suggestions, bug reports/fixes, and improvements are welcome.

Help with any of the following is particularly appreciated:

* Performance improvements
* Making the code as concise/efficient as possible
* Browser compatibility

Please fork and send pull requests, or [report an issue.](https://github.com/kylefox/jquery-tablesort/issues)
