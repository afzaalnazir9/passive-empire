import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        let uploadPath;

        if (file.originalname.endsWith('.loader.js') || file.fieldname === 'web_build_loader') {
            uploadPath = "uploads/builds/web/";
        } else if (file.fieldname === "logo") {
            uploadPath = "uploads/logos/";
        } else if (file.fieldname === "mobile_build") {
            uploadPath = "uploads/builds/mobile/";
        } else if (
            file.fieldname === "web_build_framework" ||
            file.fieldname === "web_build_wasm" ||
            file.fieldname === "web_build_data"
        ) {
            uploadPath = "uploads/builds/web/";
        } else {
            uploadPath = "uploads/";
        }

        try {
            fs.mkdirSync(uploadPath, { recursive: true });
        } catch (err) {
            console.error("Error creating directory:", err);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

export default upload;
