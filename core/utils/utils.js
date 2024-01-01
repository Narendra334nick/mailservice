import xlsx from 'xlsx';
import path  from "path";


/**
 * 
 * @param {*} file 
 * @returns arr of objects
 */
export function convertExcelToArray(file) {
  const fileName = file?.filename;
  const filePath = file?.path;
  
  if (fileName && filePath) {
    const workbook =
      file &&
      xlsx.readFile(filePath, {
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
    const sheet_name_list = workbook && workbook.SheetNames;
    const records =
      workbook &&
      sheet_name_list &&
      xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        header: 1,
        blankrows: false,
        raw: true,
        defval: null,
        rawNumbers: true,
      });
    // records[0] consists the keys of the object
    records[0] = records[0]
      .toString()
      .replace(/ *\([^)]*\) */g, "")
      .replace(/[()#!@%^&*=_./]/g, "")
      .replace(/[+-]/g, "")
      .replace(/\s/g, "")
      .split(",");
     
    if (records?.length <= 1) throw new Error("Excelsheet is empty !!!");
    // that contains employe details
    let arr = [];
    // starting the loop from 1 becoz at zero index it contains keys all value starts from 1st index
    // this for loop will create key value pairs
    for (let i = 1; i < records.length; i++) {
      const employee = new Object();
      records?.[0]?.forEach((element, index) => {
        employee[`${element}`] = records[i][index];
      });
      arr.push(employee);
    }
    return arr;
  } else {
    console.log("in side")
    throw new Error('File does not exists')
  }  
}

/**
 * checkMandatoryFieldsInExcel
 * @param {*} arr array of object for employees
 * @param {*} mandatoryFieldsFromClient array of mandatory fields
 */
export function checkMandatoryFieldsInExcel(arr, mandatoryFieldsFromClient) {
	try {
		let err = "",
			flag = 0;
		let temp = {};
		arr.forEach((item, index) => {
			mandatoryFieldsFromClient.forEach((id) => {
				if (item[id]?.toString()?.trim() == "" || item[id] == null || item[id] == undefined || item[id] == "null" || item[id] == "undefined") {
					flag = 1;
					if (!temp[id]) {
						temp[id] = `${index + 1}`;
					} else {
						temp[id] = temp[id] + "," + `${index + 1}`;
					}
				}
			});
		});
		Object.entries(temp).forEach(([key, value]) => {
			err = err + (err ? "::" : "") + `${key} is required at row ${value}`;
		});
		if (flag === 1) throw new Error(err);
	} catch (error) {
		throw error;
	}
}
