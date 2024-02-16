import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
        
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyDpbefZcWetdrfr2mwgV8JVZXyezBVgV6g",
  authDomain: "joyn-85ed1.firebaseapp.com",
  projectId: "joyn-85ed1",
  storageBucket: "joyn-85ed1.appspot.com",
  messagingSenderId: "1004038643973",
  appId: "1:1004038643973:web:2a19503d2b0ade6e20576c"
};

//Firebaseを起動
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };