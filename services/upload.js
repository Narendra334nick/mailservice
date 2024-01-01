import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    const filePath = `uploads/${fileName}`;
    req.fileName = fileName;
    req.filePath = filePath;
    cb(null, fileName);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;