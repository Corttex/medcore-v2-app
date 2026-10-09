const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'medcore';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Faltam credenciais do R2 no .env");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function testR2() {
  try {
    console.log("Tentando conectar ao R2 e listar objetos no bucket:", bucketName);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5
    });
    const response = await s3Client.send(command);
    console.log("✅ Conexão bem-sucedida! Bucket encontrado.");
    console.log(`Encontrados ${response.Contents?.length || 0} objetos no teste (mostrando max 5).`);
    if (response.Contents) {
      response.Contents.forEach(obj => {
        console.log(` - ${obj.Key} (Tamanho: ${obj.Size} bytes)`);
      });
    }
  } catch (error) {
    console.error("❌ Falha na conexão com o R2:", error.message);
    if (error.$metadata) {
      console.error("HTTP Status:", error.$metadata.httpStatusCode);
    }
  }
}

testR2();
