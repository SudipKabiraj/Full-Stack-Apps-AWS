import fs from "fs";
import Jimp from "jimp";
import os from "os";
import path from "path";
import axios from "axios";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Axios GET with User-Agent header
      const response = await axios({
        method: "get",
        url: inputURL,
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      const buffer = Buffer.from(response.data, "binary");
      const photo = await Jimp.read(buffer);

      const outpath = path.join(os.tmpdir(), `filtered.${Math.floor(Math.random() * 2000)}.jpg`);

      await photo
        .resize(256, 256)
        .quality(60)
        .greyscale()
        .writeAsync(outpath);

      resolve(outpath);
    } catch (error) {
      console.error("filterImageFromURL error:", error.message);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
