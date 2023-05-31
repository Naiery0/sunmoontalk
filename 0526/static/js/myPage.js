
const id=document.getElementById("id");
const pw=document.getElementById("pw");
const email=document.getElementById("email");
const nickname=document.getElementById("nickname");

function LogOut() {
    document.cookie = "sessionID" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("로그아웃 되었습니다");
    window.parent.location.href = "../index.html";
}
/*
function getCookieValue(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return "";
}*/

function displayInfo() {
    //const sessionID = getCookieValue("sessionID");
    const username = localStorage.getItem('username');
    /*
    for (let i = 0; i < sessionID.length; i++) {
        if (i > 12) {
            let temp = sessionID.charCodeAt(i);
            temp = temp - 2;
                username += String.fromCharCode(temp);
        }
    }*/
    
    console.log("로그인한 회원의 아이디 : " + username);


    // 서버로 로그인 요청을 보냅니다.
    fetch('/myPage', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "username=" + encodeURIComponent(username)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('데이터 인식 실패');
            }
            return response.json();
        })
        .then((data) => {
            /*consloe.log(data.userID);
            consloe.log(data.userPW);
            consloe.log(data.userEmail);
            consloe.log(data.userNickname);*/
            id.innerText = data.username;

            pw.innerText = "";
            for(let i=0;i<data.password.length;i++){
                pw.innerText += "*"; 
            }
            //pw.innerText = data.password;

            email.innerText = data.email;
            nickname.innerText = data.nickname;
        })
        .catch((error) => {
            // 에러 발생 시 처리할 내용을 작성하세요.
            console.error('내정보 요청 에러', error);
        });
}
displayInfo();

function changePW() {
    var changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn save pw");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "저장하기");
    changeBtn.setAttribute("onclick", "savePW()");

    var pwLabel = document.getElementById("pw");
    var pwInput = document.createElement("input");
    pwInput.setAttribute("class", "inputField");
    pwInput.setAttribute("type", "password");
    pwInput.setAttribute("id", "newPw");

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn pw")[0]);
    wrap.replaceChild(pwInput, pwLabel);
  }

  function savePW() {
    var newPassword = document.getElementById("newPw").value;

    // 여기에 비밀번호 저장 

    
    var changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn pw");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "변경하기");
    changeBtn.setAttribute("onclick", "changePW()");

    var pwInput = document.getElementById("newPw");
    var pwLabel = document.createElement("span");
    pwLabel.setAttribute("class", "label2");
    pwLabel.setAttribute("id", "pw");
    pwLabel.innerText = "비밀번호정보";

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save pw")[0]);
    wrap.replaceChild(pwLabel, pwInput);
  }



function changeNick() {
    var changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn save nick");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "저장하기");
    changeBtn.setAttribute("onclick", "saveNick()");

    var nicknameLabel = document.getElementById("nickname");
    var nicknameInput = document.createElement("input");
    nicknameInput.setAttribute("class", "inputField");
    nicknameInput.setAttribute("type", "text");
    nicknameInput.setAttribute("id", "newNickname");

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn nick")[0]);
    wrap.replaceChild(nicknameInput, nicknameLabel);
  }

  function saveNick() {
    var newNickname = document.getElementById("newNickname").value;

    // 여기에 닉네임 저장 코드

    var changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn nick");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "변경하기");
    changeBtn.setAttribute("onclick", "changeNick()");

    var nicknameInput = document.getElementById("newNickname");
    var nicknameLabel = document.createElement("span");
    nicknameLabel.setAttribute("class", "label2");
    nicknameLabel.setAttribute("id", "nickname");
    nicknameLabel.innerText = "닉네임정보";

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save nick")[0]);
    wrap.replaceChild(nicknameLabel, nicknameInput);
  }