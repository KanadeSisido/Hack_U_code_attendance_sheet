import {db, app} from "./importFirebase.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc,setDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const auth = getAuth(app);

const form = document.getElementById("create-circle");

const sent_message = document.getElementById("send-message");
sent_message.style.display = "none";

const circle_name = document.getElementById("circle-name");
const circle_info = document.getElementById("circle-info");
const circle_address = document.getElementById("circle-address");
const circle_place = document.getElementById("circle-place");


onAuthStateChanged(auth, (user)=>{
    
    //ログイン済み
    if(user)
    {
        console.log("ログインしてます");
        console.log(user.uid);

        form.addEventListener("submit",async e => {
            e.preventDefault();
        
            
            
            if(circle_name.value && circle_info.value && circle_address.value && circle_place.value)
            {
                

                const docref = await addDoc(collection(db, 'Clubs'),{
                    "club-name" : circle_name.value,
                    "club-info" : circle_info.value,
                    "club-place" : circle_place.value,
                    "club-email" : circle_address.value
                });
                
                const ClubRef = doc(db, 'Clubs', docref.id);
                const UserRef = doc(db,'Users', user.uid);

                //Club
                //ClubにUserを登録する
                const docsnap = await getDoc(ClubRef)
                //現在のデータを取得
                const currentdata = docsnap.data();

                //追加するデータ
                const newdata = {[user.displayName] : UserRef};

                const margeddata = {
                    member : {...currentdata.member, ...newdata}
                };
                

                await updateDoc(ClubRef, margeddata);

                updateUser(user.uid, ClubRef);

            }

        });

    }
    else
    {
        console.log("ログインしてません");
    }

});


async function updateUser(userId, clubRef)
{
    //ユーザのドキュメントへの参照
    const userDocRef = doc(db, "Users", userId);

    //ユーザのドキュメントが生成されているか　確認するために取得する
    const docSnap = await getDoc(userDocRef);

    if(docSnap.exists())
    {
        //存在する
        await updateDoc(userDocRef, { Clubs : arrayUnion(clubRef) });
    }
    else
    {
        //しない
        await setDoc(userDocRef, { Clubs : [clubRef]});
    }


    sent_message.style.display = 'block';
    setTimeout(function(){
      hideNoti();
    }, 3000);

    circle_name.value = "";
    circle_place.value = "";
    circle_address.value = "";
    circle_info.value = "";

}

function hideNoti()
{
  sent_message.style.display = 'none';
}
