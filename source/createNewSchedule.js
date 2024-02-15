import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
        
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc,getDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyAruPRcOsun0zfZSAKcLbLXLrjg_ejRtyg",
    authDomain: "fir-web-codelab-cc19d.firebaseapp.com",
    projectId: "fir-web-codelab-cc19d",
    storageBucket: "fir-web-codelab-cc19d.appspot.com",
    messagingSenderId: "575906656285",
    appId: "1:575906656285:web:e2e2f36620c832502956f4"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ClubID = "thUNgcczudp9oFvA1ajj";

async function main()
{
    const url = window.location.href;
    const params = new URLSearchParams(url)

    console.log(params)


}
main();