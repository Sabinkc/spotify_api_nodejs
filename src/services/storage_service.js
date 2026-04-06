const { ImageKit } = require("@imagekit/nodejs");

const imageKitClient = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const result = await imageKitClient.files.upload({
    file,
    fileName: "_music" + Date.now(),
    folder: "spotify/music",
  });
  return result;
}

module.exports = uploadFile;
