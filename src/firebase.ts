import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB8FQuJciTwz1cQWA78DL0J56UyY5A6sCM",
    authDomain: "reactive-todo-40cef.firebaseapp.com",
    databaseURL: "https://reactive-todo-40cef.firebaseio.com",
    projectId: "reactive-todo-40cef",
    storageBucket: "reactive-todo-40cef.appspot.com",
    messagingSenderId: "667961229338",
    appId: "1:667961229338:web:8ac758329641cac506d1a3"
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

export const auth = firebase.auth()

