import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// -------------------------
// CLOUDINARY CONFIG
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------
// CLOUDINARY STORAGE
// -------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "expo_ai_tests",
      format: file.mimetype.includes("pdf") ? "pdf" : "png", // store pdfs as pdf, others as png
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: file.mimetype.includes("pdf") ? "raw" : "image",
    };
  },
});

// -------------------------
// FILE FILTER
// -------------------------
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg/png/gif) and PDFs are allowed"));
  }
};

// -------------------------
// MULTER UPLOAD INSTANCE
// -------------------------
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB per file
  fileFilter,
});

export default uploadMiddleware;