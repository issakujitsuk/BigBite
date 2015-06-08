(function () {

	var
	updating = false,	// exclusive control
	table, // forcused table
	start, // drag start-id
	latest, // drag latest-id
	data = {};	// selected data
	const
	UNSELECTABLE_TABLE = "BigBiteUnselectable",
	SELECTED_CELL = "BigBiteSelected";

	var cancelEvent = function (e) {
		e.stopPropagation();
		e.preventDefault();
	};

	var reset = function () {
		// unselected
		for (var key in data) {
			var pos = toPos(key);
			unset(pos.x, pos.y);
		}
		// selectable
		if (table) {
			table.classList.remove(UNSELECTABLE_TABLE);
		}
		table = start = latest = null;
		data = {};
	};

	var diff = function (cell1, cell2, dest) {
		var small = {
			x: cell1.x <= cell2.x ? cell1.x : cell2.x,
			y: cell1.y <= cell2.y ? cell1.y : cell2.y,
		};
		var large = {
			x: cell1.x > cell2.x ? cell1.x : cell2.x,
			y: cell1.y > cell2.y ? cell1.y : cell2.y,
		};
		for (var y = small.y; y <= large.y; y++) {
			for (var x = small.x; x <= large.x; x++) {
				var key = toId(x, y);
				if (dest[key]) {
					// intersection
					delete dest[key];
				} else {
					// diff
					dest[key] = key;
				}
			}
		}
	};

	var update = function(cursor) {
		var currentId = toId(cursor.x, cursor.y);
		if (latest === currentId) {
			return;
		}

		if (updating) {
			return;
		}
		updating = true;

		if (start == null) {
			start = currentId;
		}

		var startCell = toPos(start);
		var flip = {};
		if (latest) {
			diff(startCell, toPos(latest), flip);
		}
		diff(startCell, cursor , flip);

		for (id in flip) {
			var pos = toPos(id);
			if (data[id]) {
				// to unselected
				delete data[id];
				unset(pos.x, pos.y);
			} else {
				// to selected
				var td = table.rows[pos.y].cells[pos.x];
				data[id] = td.textContent;
				td.classList.add(SELECTED_CELL);
			}
		}
		latest = currentId;
		updating = false;
	};

	var unset = function(x, y) {
		table.rows[y].cells[x].classList.remove(SELECTED_CELL);
	};

	var getCell = function (event) {
		var o = {}, e = event.target, name;
		while (e) {
			switch ((name = e.nodeName.toLowerCase())) {
				case "th":
					name = "td";
					/* FALLTHROUGH */
				case "td":
				case "tr":
				case "table":
					o[name] = e;
					if (name === "table") {
						return o;
					}
			}
			e = e.parentNode;
		}
		return o;
	};

	var toId = function (x, y) {
		return y + "-" + x;
	};

	var toPos = function(id) {
		var pos = id.split("-");
		return {x: +pos[1], y: +pos[0]};
	};

	var move = function (event) {
		if (!event.ctrlKey || event.which !== 1) {
			return;
		}
		var cell = getCell(event);
		if (!cell.td) {
			return;
		}

		if (!table) {
			// selection begins
			table = cell.table;
			table.classList.add(UNSELECTABLE_TABLE);
		} else if (table != cell.table) {
			// new table
			reset();
			cancelEvent(event);
			return;
		}

		cancelEvent(event);

		// update selection
		update({
			x: cell.td.cellIndex,
			y: cell.tr.rowIndex,
		});
	};

	var copy = function(event) {
		if (data) {
			// data sort
			var order = [];
			for (var key in data) {
				order[order.length] = key;
			}
			order.sort();

			// format
			var currentRowId, dest = [], line = 0, colId = 0;
			for (var i = 0, o; o = order[i]; i++) {
				var rowId = toPos(o).y;
				if (currentRowId == null) {
					currentRowId = rowId;
				}
				if (currentRowId != rowId) {
					// newline
					currentRowId = rowId;
					line++;
					colId = 0;
				}
				if (!dest[line]) {
					dest[line] = [];
				}
				dest[line][colId++] = data[o].trim();
			}

			// to string
			var text = "";
			for (var i = 0, row; row = dest[i]; i++) {
				text += row.join("\t") + "\r\n";
			}

			// copy
			event.clipboardData.setData("text", text.slice(0, -2));

			// finalize
			reset();
			cancelEvent(event);
		}
	};
	var down = function(event) {
		if (event.which !== 1) {
			return;
		} else if (!event.ctrlKey) {
			reset();
			event.stopPropagation();
			return;
		}

		// selection begins
		return move(event);
	};

	var up = function(event) {
		if (start || latest) {
			// terminate drag
			start = latest = null;
			cancelEvent(event);
		}
	};

	var init = function(window, document) {
		if (window.BigBite && window.BigBite.init) {
			return;
		}
		window.BigBite = { init: true };
		document.addEventListener("mouseup", up, true);
		document.addEventListener("mousedown", down, true);
		document.addEventListener("mousemove", move, true);
		document.addEventListener("copy", copy, true);
		var style = document.createElement("style");
		style.type = "text/css";
		document.getElementsByTagName("head").item(0).appendChild(style);
		style.sheet.insertRule("." + UNSELECTABLE_TABLE + "{-webkit-user-select:none}", 0);
		style.sheet.insertRule("." + SELECTED_CELL + "{box-shadow:-2px -1px blue inset}", 0);
	};

	for (var i = 0, w; w = window.frames[i]; i++) {
		w.addEventListener("load", function() {
			init(this, this.document);
		});
		init(w, w.document);
	}
	init(window, document);
}
)();