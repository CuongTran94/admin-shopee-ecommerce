import { auth } from '../../config/firebase';

export async function signOut() {
    try {
        await auth.signOut();
    } catch (err) {
        throw err;
    }
}