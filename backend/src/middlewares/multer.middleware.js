import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../public/temp");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname); //read about file in docs
    //original name se save mat karo
  },
});

export const upload = multer({ storage: storage });
