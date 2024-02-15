import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    doc,
    collection,
    addDoc,
    setDoc,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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



//テーブル生成
// Firestore データベースの参照を取得
const db = getFirestore(app);

// 行を追加する関数を定義します
function addRow(name) {
    var row = document.createElement('tr');

    // 氏名を表示するセルを作成します
    var nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);

    // 出席/欠席を選択するセルを作成します
    var attendanceCell = document.createElement('td');
    var selectElement = document.createElement('select');
    selectElement.addEventListener('change', function(event) {
        var selectedValue = event.target.value;
        var selectedName = event.target.parentElement.parentElement.firstElementChild.textContent;
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

    attendanceCell.appendChild(selectElement);
    row.appendChild(attendanceCell);

    // 行をテーブルに追加します
    tableBody.appendChild(row);
}

// Firestore の指定されたドキュメントの schedule-status マップを更新します
function updateAttendance(name, attendance) {
    // ドキュメントの ID
    var documentId = ID;

    // ドキュメントの参照を取得
    var docRef = db.collection("Schedules").doc(documentId);

    // ドキュメントを取得し、schedule-status マップを更新します
    docRef.get().then((doc) => {
        if (doc.exists) {
            // 元のデータを取得します
            var data = doc.data();
            // schedule-status マップに新しいデータを追加します
            data["schedule-status"][name] = attendance;
            // 更新されたデータを保存します
            docRef.update(data)
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
        console.error("Error getting document:", error);
    });
}

// 初期の行を追加します
var tableBody = document.querySelector('#attendance-table tbody');


addRow('田中');
addRow('山田');
addRow('佐藤');

/*
var selectElement = document.getElementById('select-option');

options.forEach(function(option) {
    var optionElement = document.createElement('option');
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
});

selectElement.selectedIndex = 0;
*/
/*
//選択肢が変えられたときの処理
var select = document.querySelector("select[id=selectoption]");

window.onload = function(){
    selectFunction(select)
};

select.addEventListener('change', function(){
    selectFunction(select);
});

function selectFunction(select){
    let value = select.value;
    if(value == 'attend'){
        document.getElementById('ans').textContent = value;
    }else if(value == 'absent'){
        document.getElementById('ans').textContent = value;
    }
}


document.getElementById("selectoption").value = "absent";
*/