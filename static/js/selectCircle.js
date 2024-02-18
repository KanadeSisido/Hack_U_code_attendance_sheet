import {db, app} from "./importFirebase.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut,updateProfile} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc,setDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const auth = getAuth(app);
const error_message = document.getElementById("error-code");

const login_ui = document.getElementById('login-right');
const logined_elem = document.getElementById('logined');
const logouted_elem = document.getElementById('logouted');

const circles_wrapper = document.getElementById("circles-wrapper");
const circles = document.getElementById("circles");

//ログイン状態の確認
onAuthStateChanged(auth, (user)=>{
    
    //ログイン済み
    if(user)
    {
        //ログイン用のUIを消す＋通常のUIを表示
        login_ui.style.display = "none";
        logined_elem.style.display = "block";
        logouted_elem.style.display = "none";

        //ログイン時はCircleたちを表示する
        circles_wrapper.style.display = "block";
        
        //Circleたちを読み込む
        main(user.uid);
        console.log("ログインしてます");
    }
    else
    {
        //ログイン用の画面をつける＋通常のUIを消す
        logined_elem.style.display = "none";
        logouted_elem.style.display = "block";
        
        console.log("ログインしてません");
    }
});

//サインアップ（新規登録）
async function makeWithEmailAndPassword()
{
    
    event.preventDefault();

    //フォームの情報をとる
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const password_check = document.getElementById('password-check-signup').value;
    const user_name = document.getElementById('user-name-signup').value;

    //Passwordのチェック
    if(password == password_check)
    {
        //サインアップ処理
        const Credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = Credential.user;
        //Usernameを設定する
        await updateProfile(user, {displayName: user_name});
    }
    else
    {
        throw new Error("invalid password");
    }

    //初期化
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
        //ログイン処理
        const Credential = await signInWithEmailAndPassword(auth, email, password);
        
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

    //初期化
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    
}



//サインアウト
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
    //Userが所属しているClubを取得するためにuseridで参照を取得する
    const UserRef = doc(db, 'Users', userid);
    circles.innerHTML = "";

    try
    {
         //所属しているClubを取得する
        const docSnap = await getDoc(UserRef);
        const clubs_data = docSnap.data()["Clubs"];

        //所属しているClubを表示する
        for(let i = 0; i < clubs_data.length; i++)
        {
            const clubSnap = await getDoc( clubs_data[i] );
            const club_snap_data = clubSnap.data();

            console.log( club_snap_data["club-info"]);
            const club_elem = document.createElement("div");
            club_elem.innerHTML = "<img class=\"circle-icon\" src=\"../resources/circle-icon.jpg\"><a class=\"circle\" href=\"./schedule/index.html?ID="+clubs_data[i].path.replace('Clubs/','')+"\"></a><a class=\"circle-name\" href=\""+clubs_data[i].path.replace('Clubs/','')+"\">" + club_snap_data["club-name"] + "</a><a class=\"circle-info\">"+ club_snap_data["club-info"] +"</a>"
            club_elem.setAttribute("class","circle-wrapper");
            circles.appendChild(club_elem);
        }

    }
    catch(error)
    {

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



async function join_circle()
{
    onAuthStateChanged(auth,(user) => {
        if(user)
        {

            //参加するClubのIDのフィールドを取得する
            const join_field = document.getElementById("join-field");
            //参加するClubのIDを取得する
            const to_join_id = join_field.value;
            
            //参加するClubの参照を取得する
            const ClubRef = doc(db, 'Clubs', to_join_id);
            
            //所属しているClubを書き換えるためにUserを参照する
            const UserRef = doc(db, 'Users', user.uid);
            
            //ClubにUserを登録する
            getDoc(ClubRef).then((docsnap)=>{

                //現在のデータを取得
                const currentdata = docsnap.data();
                //追加するデータ
                const newdata = {[user.displayName] : UserRef};

                const margeddata = {
                     member : {...currentdata.member, ...newdata}
                };
                
                updateDoc(ClubRef, margeddata);
            });


            //UserにClubを登録する
            updateUser(user.uid, ClubRef).then(()=>{
                join_field.value = "";

                main(user.uid);
            });

            
        }

        

    });
        
        
    show_gray();
    
}

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
   
}

window.loginWithEmailAndPassword = loginWithEmailAndPassword;
window.makeWithEmailAndPassword = makeWithEmailAndPassword;
window.signout = signout;
window.show_gray = show_gray;
window.show_join = show_join;
window.join_circle = join_circle;



