const papaParser = require('papaparse');

export function parseCSVToJSON(fileObject: File) {
  if (fileObject instanceof File) {
    return new Promise((resolve, reject) => {
      papaParser.parse(fileObject, {
        header: true,
        complete: function (result: any) {
          resolve(result.data);
        },
        error: function (error: any) {
          reject(error);
        }
      });
    });
  } else {
    throw new Error("Please provide valid file object");
  }
}
