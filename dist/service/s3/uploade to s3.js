"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new client_s3_1.S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
console.log(process.env.ACCESS_KEY_ID);
const region = "us-east-1";
const BUCKET_NAME = "learning-s3-ak8128";
function uploadToS3(localFilePath, originalName, mimetype, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileContent = fs_1.default.readFileSync(localFilePath);
            const fileExt = path_1.default.extname(originalName);
            var key = `${Date.now()}${fileExt}`;
            const isPublic = req.headers.public === "true"; // Check if the file should be public
            console.log("isPublic:", isPublic);
            if (isPublic) {
                key = `public-photos/${key}`; // Store in a public folder
            }
            const params = {
                Bucket: BUCKET_NAME,
                Key: key,
                Body: fileContent,
                ContentType: mimetype,
            };
            let result;
            try {
                result = yield s3.send(new client_s3_1.PutObjectCommand(params));
            }
            finally {
                // This will run even if an error occurs above!
                try {
                    fs_1.default.unlinkSync(localFilePath);
                }
                catch (deleteErr) {
                    // لو فيه مشكلة في الحذف، ممكن تسجلها أو تتجاهلها حسب الحاجة
                    console.error("Couldn't delete file:", deleteErr);
                }
            }
            res.status(200).json({
                message: "تم رفع الصورة بنجاح!",
                url: `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`,
                key,
                bucket: BUCKET_NAME,
                region,
                originalName,
                mimetype,
                s3Response: result, // <--- ده فيه كل الريسبونس اللي راجع من AWS SDK
            });
        }
        catch (error) {
            console.error("Error uploading to S3:", error);
            res.status(500).json({
                error: "حصل خطأ في رفع الصورة",
                details: error,
            });
        }
    });
}
