import fs from "fs";

export default function writeFileAsync(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}
