import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
        
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc,getDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyDpbefZcWetdrfr2mwgV8JVZXyezBVgV6g",
  authDomain: "joyn-85ed1.firebaseapp.com",
  projectId: "joyn-85ed1",
  storageBucket: "joyn-85ed1.appspot.com",
  messagingSenderId: "1004038643973",
  appId: "1:1004038643973:web:2a19503d2b0ade6e20576c"
};


const form = document.getElementById("create-schedule");
const name = document.getElementById("schedule-name");
const info = document.getElementById("schedule-info");
const place = document.getElementById("schedule-place");
const inittime = document.getElementById("schedule-inittime");
const endtime = document.getElementById("schedule-endtime");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main()
{
  //クエリからIDを手に入れる
  const url = window.location.search;
  const Params = new URLSearchParams(url);
  const ClubID = Params.get("ID");

  //DBからクラブの情報を手に入れる
  const clubDocRef = doc(db, "Clubs", ClubID);
  const clubDocSnap = await getDoc(clubDocRef);
  const club = clubDocSnap.data();
  const club_members = club["member"];
  

  form.addEventListener('submit',async e =>{
    
    e.preventDefault();

    //フォームからデータ取得
    const inittime_date = inittime.value;
    const init_dateObj = new Date(inittime_date);

    const endtime_date = endtime.value;
    const end_dateObj = new Date(endtime_date);
    

    //mapに全ユーザの'YES/NO'フィールドを作成（初期値はUnselected）
    let members = new Map();

    for(let i = 0; i < members.length; i++)
    {
      members.set(members[i], 'Unselected');
    }

    //送信するデータ
    const NewSchedule = 
    {
        'schedule-name' : name.value,
        'schedule-info' : info.value,
        'schedule-place' : place.value,
        'schedule-inittime' : init_dateObj,
        'schedule-endtime' : end_dateObj,
        'schedule-status' : members

    };

    //送信
    addDoc(collection(db, 'Schedules'),NewSchedule);

  });


}
main();