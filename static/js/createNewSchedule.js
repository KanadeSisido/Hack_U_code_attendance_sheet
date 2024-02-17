import {db,app} from "./importFirebase.js";
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const firebaseConfig = {
  apiKey: "AIzaSyDpbefZcWetdrfr2mwgV8JVZXyezBVgV6g",
  authDomain: "joyn-85ed1.firebaseapp.com",
  projectId: "joyn-85ed1",
  storageBucket: "joyn-85ed1.appspot.com",
  messagingSenderId: "1004038643973",
  appId: "1:1004038643973:web:2a19503d2b0ade6e20576c"
};

const auth = getAuth();

//formの要素を取得する
const form = document.getElementById("create-schedule");
const name = document.getElementById("schedule-name");
const info = document.getElementById("schedule-info");
const place = document.getElementById("schedule-place");
const inittime = document.getElementById("schedule-inittime");

const member_container = document.getElementById("member-Container");

const open_member_button = document.getElementById("to-open-menu");
const close_member_button = document.getElementById("to-close-menu");

let member_option = "unselected";


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
  //Clubのメンバー取得
  const club_members = club["member"];


  //メンバーの名前を格納した配列
  const club_members_names = Object.keys(club_members);

    console.log(club_members_names);

    //メンバー全員を選択画面に表示する
    for (let i = 0; i < club_members_names.length; i++)
    {
      const label = document.createElement('label');
      label.htmlFor = club_members_names[i];
      label.appendChild(document.createTextNode(club_members_names[i]));

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = club_members_names[i];
      checkbox.className = "member-checkboxes";
      checkbox.value = club_members_names[i];
      
      const wrapper = document.createElement('div');

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      
      member_container.appendChild(wrapper);
      wrapper.setAttribute("class","member-wrapper")

  }

  //イベント参加者メニューを開く
  open_member_button.addEventListener('click',()=>{
    member_container.style.display = "block";
    member_option = "select";

    open_member_button.className = "open-menu-button open-menu-enable"
    close_member_button.className = "open-menu-button open-menu-disable"

  });

  //閉じる
  close_member_button.addEventListener('click',()=>{
    member_container.style.display = "none";
    member_option = "all";

    close_member_button.className = "open-menu-button open-menu-enable"
    open_member_button.className = "open-menu-button open-menu-disable"
  });

  
  

  //送信するとき
  form.addEventListener('submit', async e =>{
    
    e.preventDefault();

    //フォームから時刻データ取得＋Firebaseに対応したDate型に変換
    const inittime_date = inittime.value;
    const init_dateObj = new Date(inittime_date);

    //必要なデータがすべて入力されているか？
    if(name.value && info.value && place.value && inittime.value && member_option != "unselected")
    {
      
      //チェックボックスの内容を読み取る   
      let checkboxes = document.querySelectorAll('input[type="checkbox"].member-checkboxes:checked');

      //参加者０人のイベントは作成できない
      if (checkboxes.length > 0 || member_option == "all")
      {
          //mapにユーザの'YES/NO'フィールドを作成（初期値はUnselected）＃MAPの送信
          let members = {};

          let selected_members;

          //全員の場合
          if (member_option == "all")
          {
              selected_members = club_members_names;
                                                    console.log("all");
          }
          //指定した人だけの場合
          else if (member_option == "select")
          {

            selected_members = new Array(checkboxes.length);

            for (let i = 0; i < checkboxes.length; i++)
            {
                selected_members[i] = checkboxes[i].id;
            }
          }
          
          //ログイン状態を取得
          onAuthStateChanged(auth,(user)=>{
            console.log("auth");
            console.log(user.displayName);

            //送信用のmapに書き込む
            for (let i = 0; i < selected_members.length; i++)
            {
              
              members[ user.displayName ] = 'Unselected';
              
            }

            //この後の処理を全部ここに丸投げする
            a(members,init_dateObj,clubDocRef);
          
          });

          
      }
      else
      {
        alert("参加者は1人以上必要です");
      }

      
    }

  });

}
main();


async function a(members,init_dateObj,clubDocRef)
{
    //送信するデータ
    const NewSchedule = 
    {
        'schedule-name' : name.value,
        'schedule-info' : info.value,
        'schedule-place' : place.value,
        'schedule-inittime' : init_dateObj,
        'schedule-status' : members
    };


    //送信
    const docref = await addDoc(collection(db, 'Schedules'),NewSchedule);

    await updateDoc(clubDocRef,{
      'club-schedules': arrayUnion(docref)
    });

    //Formのリセット
    form.reset();

    console.log(members);
}