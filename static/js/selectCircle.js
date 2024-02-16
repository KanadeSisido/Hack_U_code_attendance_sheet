import {db, app} from "./importFirebase.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc,setDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const auth = getAuth(app);
const error_message = document.getElementById("error-code");

const signup_elem = document.getElementById('signup');
const login_elem = document.getElementById('login');

const login_ui = document.getElementById('login-right');
const logined_elem = document.getElementById('logined');
const logouted_elem = document.getElementById('logouted');

const circles_wrapper = document.getElementById("circles-wrapper");

let user_obj;

//ログイン状態の確認
onAuthStateChanged(auth, (user)=>{
    
    //ログイン済み
    if(user)
    {
        login_ui.style.display = "none";
        logined_elem.style.display = "block";
        logouted_elem.style.display = "none";

        main(user.uid);
        console.log("ログインしてます");
        console.log(user.uid);

    }
    else
    {
        logined_elem.style.display = "none";
        logouted_elem.style.display = "block";
        
        console.log("ログインしてません");
    }
});

//サインアップ（新規登録）
async function makeWithEmailAndPassword()
{
    
    event.preventDefault();

    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const password_check = document.getElementById('password-check-signup').value;
    const user_name = document.getElementById('user-name-signup').value;

    
    const Credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = Credential.user;

    const UserdocRef = doc(db, 'Users', user.uid );

    const data = {
        name : [user_name]
    }

    await setDoc(UserdocRef,data);
    

    document.getElementById('email-signup').value = "";
    document.getElementById('password-signup').value = "";
    document.getElementById('password-check-signup').value = "";
    document.getElementById('user-name-signup').value = "";
    location.reload();

}

//ログイン
async function loginWithEmailAndPassword()
{
    
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try
    {
        const Credential = await signInWithEmailAndPassword(auth, email, password);
        const user = Credential.user;
    }
    catch(error)
    {
        if(error.code == "auth/invalid-login-credentials")
        {
            error_message.textContent = "メールアドレス または パスワード が間違っています"
        }
        else if (error.code == "auth/invalid-email")
        {
            error_message.textContent = "メールアドレス が間違っています"
        }
        else
        {
            error_message.textContent = "不明なエラーが発生しました"
        }
        console.log(error.code);
    }

    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    location.reload();

}

function signout()
{
    signOut(auth).then(()=>{
        console.log("logout")
    });
    location.reload();
}

async function main(userid)
{
    const UserRef = doc(db, 'Users', userid);
    const docSnap = await getDoc(UserRef);

    const clubs_data = docSnap.data()["Clubs"]

    if (clubs_data)
    {
        for(let i = 0; i < clubs_data.length; i++)
        {
            const clubSnap = await getDoc( clubs_data[i] );
            const club_snap_data = clubSnap.data();

            console.log( club_snap_data["club-info"]);
            const club_elem = document.createElement("div");
            club_elem.innerHTML = "<img class=\"circle-icon\" src=\"../resources/circle-icon.jpg\"><a class=\"circle\" href=\"./schedule/index.html?ID="+clubs_data[i].path.replace('Clubs/','')+"\"></a><a class=\"circle-name\" href=\"#\">" + club_snap_data["club-name"] + "</a><a class=\"circle-info\" href=\"#\">"+ club_snap_data["club-info"] +"</a>"
            club_elem.setAttribute("class","circle-wrapper");
            circles_wrapper.appendChild(club_elem);
        }
    }
}


window.loginWithEmailAndPassword = loginWithEmailAndPassword;
window.makeWithEmailAndPassword = makeWithEmailAndPassword;
window.signout = signout;