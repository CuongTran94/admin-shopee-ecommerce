import { firestore, auth } from '../../config/firebase';
import _ from 'lodash';

export async function signIn(params) {
  try {
    const { user } = await auth.signInWithEmailAndPassword(params.userName, params.password);
    return _.extend(user, { status: 'ok', type: params.type });
  } catch (err) {
    throw err;
  }
}
