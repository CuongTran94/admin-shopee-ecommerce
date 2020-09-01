import { firestore } from '../../../config/firebase';
import { to_slug } from '@/utils/utils';

export async function fetchCategory(params) {
  try {
    const cateRef = await firestore.collection('categories')
      .orderBy('updatedAt', 'desc')
      .get()
      .then((cate) => {
        return cate.docs.map(doc => {
          return {
            id: doc.id,
            createdAt: doc.data().updatedAt.toDate(),
            ...doc.data()
          };
        });
      });

    return cateRef;
  } catch (err) {
    throw err;
  }
}
export async function removeCategory(id) {
  try {
    await firestore.collection('categories').doc(id).delete();
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
      updatedAt: new Date,
    };
    await firestore.collection('categories').add(newCate);
    return true;
  }
  catch (err) {
    throw err;
  }
}
export async function updateCategory(params) {
  try {
    await firestore.collection('categories')
      .doc(params.id)
      .set({
        c_name: params.name,
        c_slug: to_slug(params.name),
        c_description: params.description || '',
        c_parentId: params.parent || 'root',
        c_status: params.status,
        c_order: params.order,
        updatedAt: new Date,
      });
    return true;
  } catch (err) {
    throw err;
  }
}
