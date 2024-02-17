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

        circles_wrapper.style.display = "block";
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
    const user = Credential.user.uid;

    const UserdocRef = doc(db, 'Users', user.uid );

    const data = {
        name : user_name
    }

    await setDoc(UserdocRef,data);
    

    document.getElementById('email-signup').value = "";
    document.getElementById('password-signup').value = "";
    document.getElementById('password-check-signup').value = "";
    document.getElementById('user-name-signup').value = "";
    
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
        const user = Credential.user.uid;
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
    
}

function signout()
{
    signOut(auth).then(()=>{
        console.log("logout")
    });
    location.reload();
}

//ログインしている場合、内容を読み込む
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

const gray_button = document.getElementById("gray-button");
const join_button = document.getElementById("create");

//参加画面切り替え
function show_gray()
{
    gray_button.style.display = "block";
    join_button.style.display = "none";
}

function show_join()
{
    gray_button.style.display = "none";
    join_button.style.display = "block";
}

const join_field = document.getElementById("join-field");

async function join_circle()
{
    onAuthStateChanged(auth,(user) => {
        if(user)
        {
            const to_join_id = join_field.value;

            const ClubRef = doc(db, 'Clubs', to_join_id);
            console.log(ClubRef.path);
            const UserRef = doc(db, 'Users', user.uid);

            //ClubにUserを登録する
            getDoc(ClubRef).then((docsnap)=>{

                //現在のデータを取得
                const currentdata = docsnap.data();
                //追加するデータ
                const newdata = {[user.uid] : UserRef};

                const margeddata = {
                     member : {...currentdata.member, ...newdata}
                };
                
                updateDoc(ClubRef, margeddata);
                
            });

            //UserにClubを登録する
            updateDoc(UserRef,{
            
                Clubs : arrayUnion(ClubRef)
            
            })
        }

        main(user.uid);
    });

    show_gray();

    join_field.value = "";

    
}

window.loginWithEmailAndPassword = loginWithEmailAndPassword;
window.makeWithEmailAndPassword = makeWithEmailAndPassword;
window.signout = signout;
window.show_gray = show_gray;
window.show_join = show_join;
window.join_circle = join_circle;



