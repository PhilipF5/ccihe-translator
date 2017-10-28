const VARIABLE_COLUMN = "A";
const VALUE_COLUMN = "C";
const LABEL_COLUMN = "D";
const FIRST_ROW = 2;

var mongo = require("mongodb").MongoClient;
var url = process.env.npm_package_config_url;
var db = process.env.npm_package_config_db;
var coll = process.env.npm_package_config_collection;

var xlsx = require("xlsx");
var workbook = xlsx.readFile("source.xlsx");
var labelsWs = workbook.Sheets["Labels"];
var writeOps = [];

for (let row = FIRST_ROW; row < 270; row++) {
	let variable_cell = labelsWs[VARIABLE_COLUMN + row];
	if (!variable_cell) {
		continue;
	}
	let variable = variable_cell.v.trim();
	let value_cell = labelsWs[VALUE_COLUMN + row];
	while (value_cell) {
		let op = {
			"updateMany": {
				"filter": {},
				"update": { "$set": {} }
			}
		};
		switch (variable) {
			case "BASIC2005":
				op.updateMany.filter = { "$or": [{ "BASIC2005": value_cell.v }, { "BASIC2010": value_cell.v }] };
				op.updateMany.update.$set["BASIC2005"] = op.updateMany.update.$set["BASIC2010"] = labelsWs[LABEL_COLUMN + row].v;
				break;
			default:
				op.updateMany.filter[variable] = value_cell.v;
				if (variable.endsWith("FLAG")) {
					op.updateMany.update.$set[variable] = Boolean(value_cell.v);
				}
				else {
					switch (labelsWs[LABEL_COLUMN + row].v) {
						case "No":
							op.updateMany.update.$set[variable] = false;
							break;
						case "Yes":
							op.updateMany.update.$set[variable] = true;
							break;
						default:
							op.updateMany.update.$set[variable] = labelsWs[LABEL_COLUMN + row].v;
							break;
					}
				}
				break;
		}
		writeOps.push(op);
		value_cell = labelsWs[VALUE_COLUMN + ++row];
	}
}

mongo.connect(url + db, (err, db) => {
	var collection = db.collection(coll);
	collection.bulkWrite(writeOps);
	db.close();
});
