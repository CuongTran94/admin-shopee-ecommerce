import { firestore } from '../../../config/firebase';

export const fetchOrder = async () => {
  try {
    const data = await firestore.collection('checkouts').get();
    return data.docs.map((doc) => doc.data());
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (order, id) => {
  try {
    const data = await firestore.collection('checkouts').doc(id).set(order);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    await firestore.collection('checkouts').doc(id).delete();
  } catch (error) {
    throw error;
  }
};
