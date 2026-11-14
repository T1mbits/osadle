/** biome-ignore-all lint/style/useNamingConvention: not my fault */
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { toHash } from "./utils.ts";
import { env } from "cloudflare:workers";

function createS3() {
	return new S3Client({
		region: env.S3_REGION,
		endpoint: env.S3_ENDPOINT,
		forcePathStyle: true,
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
		},
	});
}

export async function upload(
	bucket: string,
	file: File,
	assumeTypeIfNoMimeType: string,
) {
	const s3 = createS3();
	const buffer = await file.arrayBuffer();

	const hash = await toHash(buffer);

	console.log(hash, file.type);

	await s3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: hash,
			Body: new Uint8Array(buffer),
			ContentType: file.type.length > 1 ? file.type : assumeTypeIfNoMimeType,
		}),
	);

	return hash;
}

export async function sign(bucket: string, hash: string, seconds: number) {
	const s3 = createS3();

	return getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: bucket,
			Key: hash,
		}),
		{ expiresIn: seconds },
	);
}
