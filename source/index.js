import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
        
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc, collection, doc,getDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAruPRcOsun0zfZSAKcLbLXLrjg_ejRtyg",
  authDomain: "fir-web-codelab-cc19d.firebaseapp.com",
  projectId: "fir-web-codelab-cc19d",
  storageBucket: "fir-web-codelab-cc19d.appspot.com",
  messagingSenderId: "575906656285",
  appId: "1:575906656285:web:e2e2f36620c832502956f4"
};

const ClubID = "thUNgcczudp9oFvA1ajj";

//side
const circle_name = document.getElementById("circle-name");
const circle_text = document.getElementById("circle-text");
const circle_place = document.getElementById("circle-place");
const circle_email = document.getElementById("circle-email");

//timeline
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

//create new schedule
const create_schedule = document.getElementById("create-new-schedule");

//Firebase起動
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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
        circle_place.href = "https://www.google.com/maps/search/" + club["club-place"]
        circle_email.innerText = club["club-email"];

        //Scheduleを作成する
        const schedules = club["club-schedules"];
        
        for (let i = 0; i < schedules.length; i++)
        {
            const schedule = await getDoc(schedules[0]);
            const schedule_data = schedule.data()

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
            tl_schedule_date.innerText = schedule_data["schedule-date"];
            tl_schedule_place.innerText = schedule_data["schedule-place"];


            tl_schedule_link.setAttribute("href","circle.html?id="+schedule_data["scheduleId"]);
            tl_schedule_title.setAttribute("href","circle.html?id="+schedule_data["scheduleId"]);
            tl_schedule_place.setAttribute("href","https://www.google.com/maps/search/"+schedule_data["schedule-place"]);
            
            create_schedule.setAttribute("href","create.html?ID:"+ClubID);

        }
        

        

    }
    else
    {
        alert("Circle Not Found Error");
    }

    



}

main();

console.log("end");

