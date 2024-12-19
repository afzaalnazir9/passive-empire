import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME, 
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            let folder = "";
            if (file.fieldname === "logo") folder = "logos/";
            else if (file.fieldname === "mobile_build") folder = "builds/mobile/";
            else folder = "builds/web/";

            cb(null, `${folder}${Date.now()}_${file.originalname}`);
        },
    }),
    limits: {
        fileSize: 500 * 1024 * 1024, 
    },
});

export default upload;
