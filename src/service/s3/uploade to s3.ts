import {  PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../configs/s3 config"; // Adjust the import path as necessary
import fs from "fs";
import path from "path";


const region = process.env.AWS_REGION as string;
const BUCKET_NAME = "learning-s3-ak8128";

export async function uploadToS3(
  localFilePath: string,
  originalName: string,
  mimetype: string,
  req: any,
  res: any
) {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const fileExt = path.extname(originalName);
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
      result = await s3.send(new PutObjectCommand(params));
    } finally {
      // This will run even if an error occurs above!
      try {
        fs.unlinkSync(localFilePath);
      } catch (deleteErr) {
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
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({
      error: "حصل خطأ في رفع الصورة",
      details: error,
    });
  }
}
