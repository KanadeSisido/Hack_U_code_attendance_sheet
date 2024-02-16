import {db} from "./importFirebase.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc, getDoc, updateDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpbefZcWetdrfr2mwgV8JVZXyezBVgV6g",
    authDomain: "joyn-85ed1.firebaseapp.com",
    projectId: "joyn-85ed1",
    storageBucket: "joyn-85ed1.appspot.com",
    messagingSenderId: "1004038643973",
    appId: "1:1004038643973:web:2a19503d2b0ade6e20576c"
  };


const url = window.location.search;
const Params = new URLSearchParams(url);
const ClubID = Params.get("ID");

//side
const circle_name = document.getElementById("circle-name");
const circle_text = document.getElementById("circle-text");
const circle_place = document.getElementById("circle-place");
const circle_email = document.getElementById("circle-email");

//timeline


//create new schedule
const create_schedule = document.getElementById("create-new-schedule");



async function main()
{
   

    //Clubsへの参照
    const clubDocRef = doc(db, "Clubs", ClubID);
    const clubDocSnap = await getDoc(clubDocRef);

    if (clubDocSnap.exists())
    {
        const club = clubDocSnap.data();

        //sideにcircleの情報を書き込む
        circle_name.innerText = club["club-name"];
        circle_text.innerText = club["club-info"];
        circle_place.innerText = club["club-place"];
        circle_place.href = "https://www.google.com/maps/search/" + club["club-place"];
        circle_email.innerText = club["club-email"];

        //Scheduleを表示する
        const schedules = club["club-schedules"];
        
        for (let i = 0; i < schedules.length; i++)
        {
            const timeline = document.getElementById("timeline");
            const tl_schedule = document.createElement('div');
            tl_schedule.setAttribute("class","schedule");

            const tl_schedule_left = document.createElement('div');
            tl_schedule_left.setAttribute("class","schedule-left");

            const tl_schedule_link = document.createElement('a');
            tl_schedule_link.setAttribute("class","schedule-link");

            const tl_schedule_title = document.createElement('a');
            tl_schedule_title.setAttribute("class","schedule-title");

            const tl_schedule_subdata = document.createElement('div');
            tl_schedule_subdata.setAttribute("class","schedule-subdata");

            const tl_schedule_date = document.createElement('p');
            tl_schedule_date.setAttribute("class","schedule-subdata-child");

            const tl_schedule_place = document.createElement('a');
            tl_schedule_place.setAttribute("class","schedule-subdata-child");

            const tl_schedule_right = document.createElement('div');
            tl_schedule_right.setAttribute("class","schedule-right");

            const tl_schedule_join = document.createElement('a');
            tl_schedule_join.setAttribute("class","schedule-join");
           

            //schedules = club["club-schedules"] は参照型が入った配列
            //schedules[i]はスケジュールへの参照（reference型）
            //getDocでreference型からdocumentを取得
            const schedule = await getDoc(schedules[i]);
            const schedule_data = schedule.data();
            const schedule_ID = schedules[i].path.replace('Schedules/','');

            tl_schedule_subdata.appendChild(tl_schedule_date);
            tl_schedule_subdata.appendChild(tl_schedule_place);
            tl_schedule_right.appendChild(tl_schedule_join);

            tl_schedule_left.appendChild(tl_schedule_link);
            tl_schedule_left.appendChild(tl_schedule_title);
            tl_schedule_left.appendChild(tl_schedule_subdata);
            
            timeline.appendChild(tl_schedule);
            tl_schedule.appendChild(tl_schedule_left);
            tl_schedule.appendChild(tl_schedule_right);

            tl_schedule_title.innerText = schedule_data["schedule-name"];

            const date_init = schedule_data["schedule-inittime"].toDate();

            tl_schedule_date.innerText = date_init.toLocaleDateString() + " " + date_init.getHours().toString() + ":" + date_init.getMinutes().toString()+"~";
            tl_schedule_place.innerText = schedule_data["schedule-place"];


            tl_schedule_link.setAttribute("href","circle.html?ID=" + schedule_ID);
            tl_schedule_title.setAttribute("href","circle.html?ID=" + schedule_ID);
            tl_schedule_place.setAttribute("href","https://www.google.com/maps/search/"+schedule_data["schedule-place"]);
            tl_schedule_join.setAttribute("href","circle.html?ID=" + schedule_ID);

        }

        create_schedule.setAttribute("href","createNewSchedule.html?ID="+ClubID);
        

        

    }

    



}

main();

console.log("end");

