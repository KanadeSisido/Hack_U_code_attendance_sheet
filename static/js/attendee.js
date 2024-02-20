import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    doc,
    updateDoc,
    getDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpbefZcWetdrfr2mwgV8JVZXyezBVgV6g",
    authDomain: "joyn-85ed1.firebaseapp.com",
    projectId: "joyn-85ed1",
    storageBucket: "joyn-85ed1.appspot.com",
    messagingSenderId: "1004038643973",
    appId: "1:1004038643973:web:2a19503d2b0ade6e20576c"
};

const app = initializeApp(firebaseConfig);

//クエリ受け取り
//const url = window.location.search;
//const Params = new URLSearchParams(url);
//const ID = Params.get("ID");
const ID = 'uJQVxo0m4B39zwS6KEvn';

// ドキュメントの ID
var documentId = ID;

// Firestore データベースの参照を取得
const db = getFirestore(app);

// ドキュメントの参照を取得
const docRef = doc(db, "Schedules", documentId);
const docRef_data = await getDoc(docRef);


//テーブル生成

const info = document.getElementById("info");
const timePlace = document.getElementById("time-place");

const scheduleName = document.createElement('p');
const scheduleInfo = document.createElement('p');
const scheduleTime = document.createElement('p');
const schedulePlace = document.createElement('p');

scheduleName.textContent = 'タイトル： ' + docRef_data.data()['schedule-name']
scheduleInfo.textContent = '概要：  ' + docRef_data.data()['schedule-info']
scheduleTime.textContent = '時間：  ' + docRef_data.data()['schedule-inittime']
schedulePlace.innerText = '場所：  ' + '\n' + docRef_data.data()['schedule-place']

info.appendChild(scheduleName);
info.appendChild(scheduleInfo);
timePlace.appendChild(scheduleTime);
timePlace.appendChild(schedulePlace);


// 行を追加する関数を定義します
function addRow(name, namedata) {
    var row = document.createElement('tr');

    // 氏名を表示するセルを作成します
    var nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);

    // 出席/欠席を選択するセルを作成します
    var attendanceCell = document.createElement('td');
    var selectElement = document.createElement('select');
    var decoSelect = document.createElement('label');
    decoSelect.className = 'selectbox-5';

    //変更の監視
    selectElement.addEventListener('change', function(event) {
        var selectedValue = event.target.value;
        var selectedName = event.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
        console.log(selectedName + 'の出席状況:', selectedValue);
        // Firestore に出席状況を追加します
        updateAttendance(selectedName, selectedValue);
    });

    // 選択肢を追加します
    var options = ['', '出席', '欠席', '遅刻・早退', '未定'];
    options.forEach(function(option) {
        var optionElement = document.createElement('option');
        optionElement.textContent = option;
        if(option === '') { // 最初の選択肢にhidden属性を追加します
        optionElement.hidden = true;
        }
        selectElement.appendChild(optionElement);
    });

    //DBから出欠情報を取得し反映
    var whereop = options.indexOf(namedata[name]);
    selectElement.options[whereop].selected = true

    decoSelect.appendChild(selectElement);
    attendanceCell.appendChild(decoSelect);
    row.appendChild(attendanceCell);
    
    // 行をテーブルに追加します
    tableBody.appendChild(row);
}

// Firestore の指定されたドキュメントの schedule-status マップを更新します
async function updateAttendance(name, attendance) {
    // ドキュメントの ID
    var documentId = ID;

    // ドキュメントの参照を取得
    const docRef = doc(db, "Schedules", documentId);

    const updatename = 'schedule-status.' + name
    await updateDoc(docRef, {
        [updatename] : attendance
    });



    /*
    // ドキュメントを取得し、schedule-status マップを更新します
    getDoc(docRef).then((doc) => {
        if (doc.exists) {
            // 元のデータを取得します
            var data = doc.data();
            // schedule-status マップに新しいデータを追加します
            //data["schedule-status"][name] = attendance;
            console.log(data["schedule-status"][name])
            // 更新されたデータを保存します
            addDoc(data["schedule-status"],{
                name: attendance
            })
                .then(() => {
                console.log("Document successfully updated!");
                })
                .catch((error) => {
                console.error("Error updating document: ", error);
                });
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        //console.error("Error getting document:", error);
    });
    */
}

// 初期の行を追加します
var tableBody = document.querySelector('#attendance-table tbody');


// 名前取得
var documentID = ID
const docRef_name = doc(db, "Schedules", documentID);
const namedataSnap = await getDoc(docRef_name);
const namedata = namedataSnap.data()["schedule-status"];
console.log(namedata);
var keys = Object.keys(namedata);
const collator = new Intl.Collator("ja");
keys.sort(collator.compare);
console.log(keys);
keys.forEach(function(value){
    addRow(value, namedata);
});


//リスト作成

// Firestore リスナーを設定してリアルタイムな更新を実現する関数
function setupFirestoreListener() {
    // ドキュメントの参照を取得
    const docRef = doc(db, "Schedules", ID);

    // ドキュメントの変更を監視し、変更があった場合にリストを更新
    onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const namedata = doc.data()["schedule-status"];
            setList(namedata);
        } else {
            console.log("No such document!");
        }
    });
}

async function setList(namedata) {
    const list = document.getElementById('list');
    list.innerHTML = '';

    // 同じ値を持つキーを取り出す関数
    function getKeysByValue(object, value) {
        return Object.keys(object).filter(key => object[key] === value);
    }

    // 同じ値を持つキーを取得
    const uniqueValues = ['出席', '欠席', '遅刻・早退', '未定', ''];
    uniqueValues.forEach(value => {
        const keys = getKeysByValue(namedata, value);
        keys.sort(collator.compare)
        const list = document.getElementById('list');
        const listItem = document.createElement('li');
        listItem.className = 'listItem'
        const namelist = document.createElement('ul');
        namelist.className = 'namelist'

        keys.forEach(name => {
            var names = document.createElement('li');
            names.textContent = name
            namelist.appendChild(names);
        })
        if(value === ''){
            listItem.textContent = '未選択 : ' + keys.length + '人';
        }else{
            listItem.textContent = value + ' : ' + keys.length + '人';
        }
        listItem.appendChild(namelist);
        list.appendChild(listItem);
    });

}

setupFirestoreListener();