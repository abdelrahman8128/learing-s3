import { config } from './../../../node_modules/rxjs/src/internal/config';
import { Send, Query } from './../../../node_modules/@types/express-serve-static-core/index.d';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../configs/s3 config";

const BUCKET_NAME = "learning-s3-ak8128";

export async function deleteFromS3( req:any,res:any): Promise<void> {

    const { key } = req.query;
    console.log("Deleting from S3:", key);
   
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    let result =await s3.send(command);
    console.log("Delete result:", result);
}