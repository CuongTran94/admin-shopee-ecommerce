import { firestore, storage } from '../../../config/firebase';
import { to_slug } from '@/utils/utils';

export async function fetchCategory(params) {
  try {
    const cateRef = await firestore
      .collection('categories')
      .orderBy('updatedAt', 'desc')
      .get()
      .then((cate) => {
        return cate.docs.map((doc) => {
          return {
            id: doc.id,
            createdAt: doc.data().updatedAt.toDate(),
            ...doc.data(),
          };
        });
      });

    return cateRef;
  } catch (err) {
    throw err;
  }
}
export async function removeCategory(payload) {
  try {
    await firestore.collection('categories').doc(payload.id).delete();
    if (payload.image) {
      await storage.refFromURL(payload.image).delete();
    }

    return true;
  } catch (err) {
    throw err;
  }
}
export async function addCategory(params) {
  try {
    const newCate = {
      c_name: params.name,
      c_slug: to_slug(params.name),
      c_description: params.description || '',
      c_parentId: params.parent || 'root',
      c_status: params.status,
      c_order: params.order,
      c_image: params.image,
      updatedAt: new Date(),
    };
    await firestore.collection('categories').add(newCate);
    return true;
  } catch (err) {
    throw err;
  }
}
export async function updateCategory(params) {
  try {
    await firestore
      .collection('categories')
      .doc(params.id)
      .set({
        c_name: params.name,
        c_slug: to_slug(params.name),
        c_description: params.description || '',
        c_parentId: params.parent || 'root',
        c_status: params.status,
        c_order: params.order,
        updatedAt: new Date(),
      });
    return true;
  } catch (err) {
    throw err;
  }
}

export async function uploadImage(file) {
  try {
    const uploadImg = await storage.ref(`images/categories/${file.name}`).put(file);
    const dowloadURL = await storage.ref('images/categories').child(file.name).getDownloadURL();
    return dowloadURL;
  } catch (err) {
    throw err;
  }
}
