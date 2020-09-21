import { firestore, storage } from '../../../config/firebase';

export const fetchData = async (collection = 'blogSubCategories') => {
  try {
    const data = await firestore.collection(collection).get();
    return data.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  } catch (error) {
    throw error;
  }
};

export const fetchDataDetail = async (collection, slug) => {
  try {
    const data = await firestore.collection(collection).where('slug', '==', slug).get();
    const post = data.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return post[0];
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (collection = 'blogs', id) => {
  try {
    await firestore.collection(collection).doc(id).delete();
  } catch (error) {
    throw error;
  }
};

export const createBlog = async (blog = {}) => {
  try {
    await firestore.collection('blogs').add(blog);
  } catch (error) {
    throw error;
  }
};

export const updateData = async (collection, post) => {
  try {
    await firestore.collection(collection).doc(post.id).set(post);
  } catch (error) {
    throw error;
  }
};

export async function uploadPostCoverImage(file) {
  try {
    const uploadImg = await storage.ref(`images/posts/${file.name}`).put(file);
    const dowloadURL = await storage.ref('images/posts').child(file.name).getDownloadURL();
    return dowloadURL;
  } catch (err) {
    throw err;
  }
}

export async function uploadPostCoversImage({ small, medium, large }) {
  try {
    const uploadSmallImg = await storage.ref(`images/posts/${small.name}`).put(small);
    const smallUrl = await storage.ref('images/posts').child(small.name).getDownloadURL();

    const uploadMediumImg = await storage.ref(`images/posts/${medium.name}`).put(medium);
    const mediumUrl = await storage.ref('images/posts').child(medium.name).getDownloadURL();

    const uploadLargeImg = await storage.ref(`images/posts/${large.name}`).put(large);
    const largeUrl = await storage.ref('images/posts').child(large.name).getDownloadURL();

    return { smallUrl, mediumUrl, largeUrl };
  } catch (err) {
    throw err;
  }
}
