import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the correct path to the 'public/temp' directory
const uploadDirectory = path.join(__dirname, "../..", "public", "temp");
// console.log(__dirname, __filename, uploadDirectory)
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use the correctly resolved path for the 'temp' directory
    cb(null, uploadDirectory);
  },
  filename: function (_, file, cb) {
    // Generate a unique filename using timestamp and original file extension
    const timestamp = Date.now();
    //const extname = path.extname(file.originalname); // Get the file extension
    const uniqueFilename = `${timestamp}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage: storage });
