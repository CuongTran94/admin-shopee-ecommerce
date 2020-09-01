import { firestore, storage } from '../../../config/firebase';

export async function fetchProduct(params) {
    try {
        const productRef = await firestore.collection('products')
            .where('pro_active', '==', params.status)
            .orderBy('createdAt', 'desc')
            .get()
            .then(pro => {
                return pro.docs.map(doc => {
                    return {
                        key: doc.id,
                        ...doc.data()
                    };
                });
            });

        return productRef;
    } catch (err) {
        throw err;
    }
}

export async function createProduct(params) {
    try {
        await firestore.collection('products').add(params);
        return true;
    } catch (err) {
        throw err;
    }
}

export async function updateProduct(params) {
    try {
        await firestore.collection('products')
            .doc(params.id)
            .set(params)
        return true;
    } catch (err) {
        throw err;
    }
}

export async function deleteProduct(params) {
    try {
        await firestore.collection('products').doc(params.id).delete();
        if (params.url) {
            await storage.refFromURL(params.url).delete();
        }

        return true;
    } catch (err) {
        throw err;
    }
}

export async function uploadAvatarProduct(file) {
    try {
        const uploadImg = await storage.ref(`images/${file.name}`).put(file);
        const dowloadURL = await storage.ref('images')
            .child(file.name)
            .getDownloadURL();
        return dowloadURL;
    }
    catch (err) {
        throw err;
    }
}