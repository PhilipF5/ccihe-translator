const VARIABLE_COLUMN = "A";
const VALUE_COLUMN = "C";
const LABEL_COLUMN = "D";
const FIRST_ROW = 2;

var mongo = require("mongodb");
var xlsx = require("xlsx");

var workbook = xlsx.readFile("source.xlsx");
var labelsWs = workbook.Sheets["Labels"];
var writeOps = [];

for (let row = FIRST_ROW; row < 270; row++) {
	let variable_cell = labelsWs[VARIABLE_COLUMN + row];
	if (!variable_cell) {
		continue;
	}
	let variable = variable_cell.v;
	let value_cell = labelsWs[VALUE_COLUMN + row];
	while (value_cell) {
		let op = {
			"updateMany": {
				"filter": {},
				"update": { "$set": {} }
			}
		};
		op.updateMany.filter[variable] = value_cell.v;
		op.updateMany.update.$set[variable] = labelsWs[LABEL_COLUMN + row].v;
		writeOps.push(op);
		value_cell = labelsWs[VALUE_COLUMN + ++row];
	}
}
