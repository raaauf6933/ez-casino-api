const fs = require("fs");
const cloudinary = require("cloudinary");
require("dotenv").config();

const destination = process.env.NODE_ENV === "development" ? "upload/" : "";
const GenerateCsv = (data, filename, cloudDestination) => {
  return new Promise((resolve, reject) => {
    var csv = "";
    for (let i of data) {
      csv += i.join(",") + "\r\n";
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    fs.writeFile(
      `${__dirname}/${destination}${filename}-${uniqueSuffix}.csv`,
      csv,
      async (err) => {
        if (err) reject(err);

        try {
          let upload_result = await cloudinary.v2.uploader.upload(
            `${__dirname}/${destination}${filename}-${uniqueSuffix}.csv`,
            {
              public_id: `${filename}-${uniqueSuffix}.csv`,
              folder: cloudDestination,
              // allowed_formats: ["csv"],
              resource_type: "raw",
            }
          );

          fs.unlinkSync(
            `${__dirname}/${destination}${filename}-${uniqueSuffix}.csv`
          );

          resolve({
            destination: upload_result.secure_url,
            filename: upload_result.original_filename,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

module.exports = GenerateCsv;
