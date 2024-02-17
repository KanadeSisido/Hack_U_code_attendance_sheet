import {db, app} from "./importFirebase.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc,setDoc, collection, doc, getDoc, updateDoc, arrayUnion,addDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const auth = getAuth(app);

const form = document.getElementById("create-circle");


onAuthStateChanged(auth, (user)=>{
    
    //ログイン済み
    if(user)
    {
        console.log("ログインしてます");
        console.log(user.uid);

        form.addEventListener("submit",async e => {
            e.preventDefault();
        
            const circle_name = document.getElementById("circle-name");
            const circle_info = document.getElementById("circle-info");
            const circle_address = document.getElementById("circle-address");
            const circle_place = document.getElementById("circle-place");
            
            if(circle_name.value && circle_info.value && circle_address.value && circle_place.value)
            {
                

                const docref = await addDoc(collection(db, 'Clubs'),{
                    "club-name" : circle_name,
                    "club-info" : circle_info,
                    "club-place" : circle_place,
                    "club-email" : circle_address,
                    "member" : doc(db,'Users',user.uid)
                });
                
                const ClubRef = doc(db, 'Clubs', docref.id);
                const UserRef = doc(db,'Users', user.uid);

                //ClubにUserを登録する
                const docsnap = await getDoc(ClubRef)
                //現在のデータを取得
                const currentdata = docsnap.data();

                //追加するデータ
                const newdata = {[user.uid] : UserRef};

                const margeddata = {
                    member : {...currentdata.member, ...newdata}
                };
                
                await updateDoc(ClubRef, margeddata);

            }

        });

    }
    else
    {
        console.log("ログインしてません");
    }
});