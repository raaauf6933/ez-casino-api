const multer = require("multer");

require("dotenv").config();

const UploadCsv = (req, res, next) => {
  const fileFilter = (_req, file, cb) => {
    if (file.mimetype.includes("text/csv")) {
      cb(null, true);
    } else {
      cb(new Error(file));
    }
  };

  const storage = () => {
    return multer.diskStorage({
      destination:
        process.env.NODE_ENV === "development"
          ? function (_req, _file, callback) {
              callback(null, __dirname + "../../../../upload");
            }
          : undefined,
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix + ".csv");
      },
    });
  };

  const upload = multer({
    fileFilter,
    storage: storage(),
    limits: {
      fileSize: 1000000 * 2, //2mb
    },
  }).single("file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          message: "File size must not exceed 2mb",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: err.message || "Internal server error",
        });
      }
    } else if (err) {
      return res.status(400).send({
        message: "Invalid file format. Please use csv file only",
      });
    }
    next();
  });
};

module.exports = UploadCsv;
