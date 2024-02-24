import {db, app} from "./importFirebase.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut,updateProfile} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore, addDoc,setDoc, collection, doc, getDoc, updateDoc, arrayUnion} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'


const auth = getAuth(app);
const error_message = document.getElementById("error-code-signin");
const error_message_signup = document.getElementById("error-code-signup");

const login_ui = document.getElementById('login-right');
const logined_elem = document.getElementById('logined');
const logouted_elem = document.getElementById('logouted');

const username_elem = document.getElementById('username-display');

const circles_wrapper = document.getElementById("circles-wrapper");
const circles = document.getElementById("circles");

const login_field = document.getElementById("login-wrapper");
const signup_field = document.getElementById("signup-wrapper");
signup_field.style.display = "none";


//ログイン状態の確認
onAuthStateChanged(auth, (user)=>{
    
    //ログイン済み
    if(user)
    {
        console.log(user.displayName);
        username_elem.innerText = "User : " + user.displayName;
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

    try
    {
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
            console.log("error");
            throw new Error("invalid password");
        }
    }
    catch(error)
    {
        console.log(error.code);
        if(error.code == "invalid password")
        {
            error_message_signup.textContent = "パスワードが一致しません";
        }
        else if(error.code == "auth/invalid-email")
        {
            error_message_signup.textContent = "Emailを入力してください";
        }
        else
        {
            error_message_signup.textContent = "入力フォームをご確認ください";
        }
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
        toggle_login();
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
            club_elem.innerHTML = "<img class=\"circle-icon\" src=\"../resources/circle-icon.jpg\"><a class=\"circle\" href=\"./schedule/index.html?ID="+clubs_data[i].path.replace('Clubs/','')+"\"></a><a class=\"circle-name\" href=\"./schedule/index.html?ID="+clubs_data[i].path.replace('Clubs/','')+"\">" + club_snap_data["club-name"] + "</a><a class=\"circle-info\">"+ club_snap_data["club-info"] +"</a>"
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
            try
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

                    console.log(Object.keys(currentdata.member));
                    const userpathes = Object.values(currentdata.member);
                    const usernames = Object.keys(currentdata.member);

                    let userids = Array(userpathes.length);

                    //UserIDを取得する
                    for( let i = 0; i < userpathes.length; i++)
                    {
                        userids[i] = userpathes[i].path.replace("Users/","");
                    }

                    //今のユーザがすでに登録されているか
                    let is_currentuser_already_regist = false;

                    for( let i = 0; i < userids.length; i++)
                    {
                        if(user.uid == userids[i])
                        {
                            is_currentuser_already_regist = true;
                        }
                    }

                    // フィールドに書き込む名前
                    let username = user.displayName;

                    //同じNameがあるか
                    let is_currentusername_already_registed = false;

                    for( let i = 0; i < usernames.length; i++)
                    {
                        if(user.displayName == usernames[i])
                        {
                            is_currentusername_already_registed = true;
                        }
                    }


                    //同じNameがある場合（すでに登録されている場合を除く）
                    while (is_currentusername_already_registed && !is_currentuser_already_regist)
                    {
                        //名前を一意なものに変更
                        username = user.displayName + "#" + random_int(100,0);

                        is_currentusername_already_registed = false;

                        for( let i = 0; i < usernames.length; i++)
                        {
                            if(username == usernames[i])
                            {
                                is_currentusername_already_registed = true;
                            }
                        }

                    }
                    

                    //追加するデータ
                    const newdata = {[username] : UserRef};

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
            catch(error)
            {
                alert("サークルIDが存在しないか無効です");
            }
            

            
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


function toggle_login()
{
    login_field.style.display = "block";
    signup_field.style.display = "none";
}

function toggle_signup()
{
    signup_field.style.display = "block";
    login_field.style.display = "none";
}

function random_int(maxx,minn)
{
    return Math.floor(minn + Math.random() * (maxx - minn));
}


window.loginWithEmailAndPassword = loginWithEmailAndPassword;
window.makeWithEmailAndPassword = makeWithEmailAndPassword;
window.signout = signout;
window.show_gray = show_gray;
window.show_join = show_join;
window.join_circle = join_circle;

window.toggle_login = toggle_login;
window.toggle_signup = toggle_signup;

