import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
import * as Constant from "../model/constant.js";

const storage = getStorage();

export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name;
  }
  const storageRef = ref(
    storage,
    Constant.storageFolderName.SBCH_LOGOS + imageName
  );
  const snapshot = await uploadBytes(storageRef, imageFile);
  const imageURL = await getDownloadURL(snapshot.ref);
  return { imageName, imageURL };
}
