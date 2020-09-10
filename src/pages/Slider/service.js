import { firestore, storage } from '../../../config/firebase';

export async function fetchSlider() {
  try {
    const sliderRef = await firestore
      .collection('sliders')
      .orderBy('createdAt', 'desc')
      .get()
      .then((items) => {
        return items.docs.map((doc) => {
          return {
            id: doc.id,
            created: doc.data().createdAt.toDate(),
            ...doc.data(),
          };
        });
      });

    return sliderRef;
  } catch (err) {
    throw err;
  }
}

export async function createSlider(params) {
  try {
    await firestore.collection('sliders').add(params);
    return true;
  } catch (err) {
    throw err;
  }
}

export async function updateSlider(params) {
  try {
    await firestore.collection('sliders').doc(params.id).set(params);
    return true;
  } catch (err) {
    throw err;
  }
}

export async function deleteSlider(params) {
  try {
    await firestore.collection('sliders').doc(params.id).delete();

    if (params.url) {
      await storage.refFromURL(params.url).delete();
    }
    return true;
  } catch (err) {
    throw err;
  }
}

export async function uploadImage(file) {
  try {
    const uploadImg = await storage.ref(`images/slider/${file.name}`).put(file);
    const dowloadURL = await storage.ref('images/slider').child(file.name).getDownloadURL();
    return dowloadURL;
  } catch (err) {
    throw err;
  }
}
