import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import serverConfig from './serverConfig.js';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: serverConfig.AWS_REGION,
  credentials: {
    accessKeyId: serverConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverConfig.AWS_SECRET_ACCESS_KEY,
  },
});

const proofUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: serverConfig.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `proofs/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export { s3Client, proofUpload };
