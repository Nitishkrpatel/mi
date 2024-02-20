import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
  apiKey: "AIzaSyA8SyHrHJlhaShyvdC9Hg6PRwt41TTtecc",
    authDomain: "smart-wear-a26ad.firebaseapp.com",
    projectId: "smart-wear-a26ad",
    storageBucket: "smart-wear-a26ad.appspot.com",
    messagingSenderId: "301924267824",
    appId: "1:301924267824:web:c02c69891e29536cc8faf5",
    measurementId: "G-LCNRSTXD23"
};

firebase.initializeApp(config);
 
export const createUserProfileDocument = async (userAuth, additionalData ) => {
  if(!userAuth) return;
  const userRef  = firestore.doc(`users/${userAuth.uid}` );

  const SnapShot = userRef.get( );

  if(!SnapShot.exists) {
    const {displayName, email} = userAuth;
    const createdAt = new Date( );
  

  try{
    await userRef.set({
      displayName,
      email,
      createdAt,
      ...additionalData
    })
  } catch(error) {
    console.log('error creating user', error.message);
   }
 }
 return userRef;
};

export const addCollectionAndDocuments = async (
  collectionKey,
   objectsToAdd
   ) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch( );
  objectsToAdd.forEach(obj=> {
    const newDocRef = collectionRef.doc( );
     batch.set(newDocRef, obj);
  });

  return await batch.commit( );
};


export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, { });
};


export const auth = firebase.auth( );
export const firestore = firebase.firestore( );

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = ( ) => auth.signInWithPopup(provider);

export default firebase;