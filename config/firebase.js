import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyD287RQ-NBPb0jl0jHYJDo2TMheUN2nveI",
    authDomain: "shopee-ad17d.firebaseapp.com",
    databaseURL: "https://shopee-ad17d.firebaseio.com",
    projectId: "shopee-ad17d",
    storageBucket: "shopee-ad17d.appspot.com",
    messagingSenderId: "598577888753",
    appId: "1:598577888753:web:c46e0d8c34eb4d6ec29850",
};

const fire = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default fire;