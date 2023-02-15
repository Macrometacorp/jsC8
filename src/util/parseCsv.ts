const fs = require("fs");
const papaParser = require("papaparse");

// Added "File" here so that the function does't complain, as by default the types are being assumed for node
export function parseCSVToJSON(csvPath: string | File) {
  if (typeof csvPath !== "string") {
    throw new Error("Please provide valid path");
  }

  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(csvPath, { encoding: "utf8", flag: "r" });
    const { data, errors } = papaParser.parse(file, {
      header: true,
    });
    if (errors.length) {
      reject(errors);
    } else {
      resolve(data);
    }
  });
}
