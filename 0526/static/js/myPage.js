
const id = document.getElementById("id");
const pw = document.getElementById("pw");
const email = document.getElementById("email");
const nickname = document.getElementById("nickname");

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
let userid;
let userpw;
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
            userid=data.username;
            userpw=data.password;
            pw.innerText = "";
            for (let i = 0; i < data.password.length; i++) {
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

//취소하기버튼 추가해야 될 듯
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
 //조건문 부여해서 조건이 만족할 때만 성공하게끔 해야함 //회원가입때와 동일하게+기존 비번(userpw라고 위에 만들어둠)과 같으면 안됨
 //그리고 너무 허접하니 다듬을 필요가 있음
 //예를 들어 지금은 비번만 치고 저장하면 뚱땅끝나버리는데
 //비번 확인란까지 나타나게 해야됨
    var newPassword = document.getElementById("newPw").value;

    // 서버로 비밀번호 정보 전송
    fetch("/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "id=" + encodeURIComponent(userid) +
        "&newPassword=" + encodeURIComponent(newPassword)
    })
        .then(function (response) {
            // 서버 응답 처리
            if (response.ok) {
                // 비밀번호 변경 성공
                var changeBtn = document.createElement("input");
                changeBtn.setAttribute("class", "btn pw");
                changeBtn.setAttribute("type", "button");
                changeBtn.setAttribute("value", "변경하기");
                changeBtn.setAttribute("onclick", "changePW()");

                var pwInput = document.getElementById("newPw");
                var pwLabel = document.createElement("span");
                pwLabel.setAttribute("class", "label2");
                pwLabel.setAttribute("id", "pw");
                pwLabel.innerText = "";
                
                for (let i = 0; i < newPassword.length; i++) {
                    pwLabel.innerText += "*";
                }
                var wrap = document.getElementsByClassName("wrap")[0];

                wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save pw")[0]);
                wrap.replaceChild(pwLabel, pwInput);
            } else {
                // 비밀번호 변경 실패
                alert("비밀번호 변경에 실패했습니다.");
            }
        })
        .catch(function (error) {
            // 네트워크 에러 등 예외 처리
            console.error("Error:", error);
        });
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
  
  // 서버로 닉네임 정보 전송
  fetch("/change-nickname", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "id=" + encodeURIComponent(userid) +
    "&newNickname=" + encodeURIComponent(newNickname)
  })
    .then(function(response) {
      // 서버 응답 처리
      if (response.ok) {
        // 닉네임 변경 성공
        var changeBtn = document.createElement("input");
        changeBtn.setAttribute("class", "btn nick");
        changeBtn.setAttribute("type", "button");
        changeBtn.setAttribute("value", "변경하기");
        changeBtn.setAttribute("onclick", "changeNick()");
    
        var nicknameInput = document.getElementById("newNickname");         
        var nicknameLabel = document.createElement("span");
        nicknameLabel.setAttribute("class", "label2");
        nicknameLabel.setAttribute("id", "nickname");
        nicknameLabel.innerText = newNickname;

        var wrap = document.getElementsByClassName("wrap")[0];
    
        wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save nick")[0]);
        wrap.replaceChild(nicknameLabel, nicknameInput);
      } else {
        // 닉네임 변경 실패
        alert("닉네임 변경에 실패했습니다.");
      }
    })
    .catch(function(error) {
      // 네트워크 에러 등 예외 처리
      console.error("Error:", error);
    });
}