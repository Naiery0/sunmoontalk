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
    //const username = sessionStorage.getItem('username');
    const username = decryptSessionID(document.cookie);
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

 //조건문 부여해서 조건이 만족할 때만 성공하게끔 해야함 
 //닉네임 특수기호 제한 기타 등등
 //회원가입때와 동일하게+기존 비번(userpw라고 위에 만들어둠)과 같으면 안됨
 //취소하기버튼 나타나게 추가해야 될 듯
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
    pwInput.setAttribute("placeholder", "새 비밀번호 입력"); // 힌트 텍스트 추가

    var pwConfirmInput = document.createElement("input"); // 비밀번호 확인 입력란 추가
    pwConfirmInput.setAttribute("class", "inputField");
    pwConfirmInput.setAttribute("type", "password");
    pwConfirmInput.setAttribute("id", "newPwConfirm");
    pwConfirmInput.setAttribute("placeholder", "새 비밀번호 확인"); // 힌트 텍스트 추가

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn pw")[0]);
    wrap.replaceChild(pwInput, pwLabel);
    wrap.insertBefore(pwConfirmInput, pwInput.nextSibling); // 비밀번호 확인 입력란 삽입
}

function savePW() {
    var newPassword = document.getElementById("newPw").value;
    var newPasswordConfirm = document.getElementById("newPwConfirm").value;

    // 비밀번호 일치 여부 확인
    if (newPassword !== newPasswordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
    // 최소 8자 이상
    if (newPassword.length < 8) {
        alert("비밀번호는 최소 8자 이상 입력해야 합니다.");
        return;
    }

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
                wrap.removeChild(document.getElementById("newPwConfirm")); // 비밀번호 확인 입력란 삭제
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
    nicknameInput.setAttribute("placeholder", "새 닉네임 입력");

    var wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn nick")[0]);
    wrap.replaceChild(nicknameInput, nicknameLabel);
}

function saveNick() {
    var newNickname = document.getElementById("newNickname").value;

    // 공백 및 특수문자 확인
    var regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/; // 영문, 숫자, 한글만 허용
    if (!regex.test(newNickname)) {
        alert("닉네임은 공백 및 특수문자를 포함할 수 없습니다.");
        return;
    }
    // 2자 이상, 8자 이하
    if (newNickname.length < 2 || newNickname.length > 8) {
        alert("닉네임은 2자 이상 8자 이하로 입력해야 합니다.");
        return;
    }

    // 서버로 닉네임 정보 전송
    fetch("/change-nickname", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "id=" + encodeURIComponent(userid) +
            "&newNickname=" + encodeURIComponent(newNickname)
    })
        .then(function (response) {
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
        .catch(function (error) {
            // 네트워크 에러 등 예외 처리
            console.error("Error:", error);
        });
}


function decryptSessionID(encryptedSessionID) {
    const encryptedString = encryptedSessionID.replace('sessionID=', '');
    const base64Decoded = atob(encryptedString);
    const decoder = new TextDecoder('utf-8');
    const decryptedSessionID = decoder.decode(new Uint8Array([...base64Decoded].map((c) => c.charCodeAt(0))));
  
    return decryptedSessionID;
  }
  