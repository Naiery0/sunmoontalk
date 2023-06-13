const id = document.getElementById("id");
const pw = document.getElementById("pw");
const email = document.getElementById("email");
const nickname = document.getElementById("nickname");
function LogOut() {
    document.cookie = "sessionID" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("로그아웃 되었습니다");
    window.parent.location.href = "../index.html";
    sessionStorage.setItem("darkmode", false);
}
let userid;
let userpw;
let usernick;
function displayInfo() {
    //const sessionID = getCookieValue("sessionID");
    //const username = sessionStorage.getItem('username');
    const username = decryptSessionID(document.cookie);


    // 서버로 로그인 요청
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
            id.innerText = data.username;
            userid = data.username;
            userpw = data.password;
            usernick = data.nickname;
            pw.innerText = "";
            for (let i = 0; i < data.password.length; i++) {
                pw.innerText += "*";
            }
            //pw.innerText = data.password;

            email.innerText = data.email;
            nickname.innerText = data.nickname;
        })
        .catch((error) => {
            // 에러 발생 시 처리할 내용
            //console.error('내정보 요청 에러', error);
        });
}
displayInfo();


/*변경하기 버튼을 눌렀을 때는 각각 changePW, changeNick가 실행됨
  저장하기 버튼을 눌렀을 때 savePW, saveNick이 실행됨. (여기엔 글자수 검사같은 조건문도 포함)
*/

function changePW() {
    let changeBtn = document.createElement("input"); //저장하기 버튼 생성
    changeBtn.setAttribute("class", "btn save pw");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "저장하기");
    changeBtn.setAttribute("onclick", "savePW()");

    let pwLabel = document.getElementById("pw");
    let pwInput = document.createElement("input"); //비번 입력란 생성
    pwInput.setAttribute("class", "inputField");
    pwInput.setAttribute("type", "password");
    pwInput.setAttribute("id", "newPw");
    pwInput.setAttribute("placeholder", "새 비밀번호 입력");

    let pwConfirmInput = document.createElement("input"); // 비밀번호 확인 입력란 생성
    pwConfirmInput.setAttribute("class", "inputField");
    pwConfirmInput.setAttribute("type", "password");
    pwConfirmInput.setAttribute("id", "newPwConfirm");
    pwConfirmInput.setAttribute("placeholder", "새 비밀번호 확인");

    let wrap = document.getElementsByClassName("wrap")[0];

    //let cancelBtn = document.getElementsByClassName("btn cancel pw")[0];
    //cancelBtn.style.display = "block";

    wrap.replaceChild(pwInput, pwLabel);
    wrap.insertBefore(pwConfirmInput, pwInput.nextSibling); // 비밀번호 확인 입력란 삽입
    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn pw")[0]);
}

function savePW() {
    let newPassword = document.getElementById("newPw").value;
    let newPasswordConfirm = document.getElementById("newPwConfirm").value;

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
                // 비밀번호 변경 성공 -> 초기 상태로 돌아감
                let changeBtn = document.createElement("input");
                changeBtn.setAttribute("class", "btn pw");
                changeBtn.setAttribute("type", "button");
                changeBtn.setAttribute("value", "변경하기");
                changeBtn.setAttribute("onclick", "changePW()");

                let pwInput = document.getElementById("newPw");
                let pwLabel = document.createElement("span");
                pwLabel.setAttribute("class", "label2");
                pwLabel.setAttribute("id", "pw");
                pwLabel.innerText = "";

                for (let i = 0; i < newPassword.length; i++) {
                    pwLabel.innerText += "*";
                }

                let wrap = document.getElementsByClassName("wrap")[0];

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
            //console.error("Error:", error);
        });
}

function changeCanclePW() {
    let changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn pw");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "변경하기");
    changeBtn.setAttribute("onclick", "changePW()");

    let pwInput = document.getElementById("newPw");
    let pwLabel = document.createElement("span");
    pwLabel.setAttribute("class", "label2");
    pwLabel.setAttribute("id", "pw");
    pwLabel.innerText = "";

    for (let i = 0; i < userpw.length; i++) {
        pwLabel.innerText += "*";
    }

    let wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save pw")[0]);
    wrap.replaceChild(pwLabel, pwInput);
    wrap.removeChild(document.getElementById("newPwConfirm"));
}


function changeNick() {
    let changeBtn = document.createElement("input"); //저장하기 버튼 생성
    changeBtn.setAttribute("class", "btn save nick");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "저장하기");
    changeBtn.setAttribute("onclick", "saveNick()");

    let nicknameLabel = document.getElementById("nickname"); //닉네임 입력란 생성
    let nicknameInput = document.createElement("input");
    nicknameInput.setAttribute("class", "inputField");
    nicknameInput.setAttribute("type", "text");
    nicknameInput.setAttribute("id", "newNickname");
    nicknameInput.setAttribute("placeholder", "새 닉네임 입력");

    //let cancelBtn = document.getElementsByClassName("btn cancel nick")[0];
    //cancelBtn.style.display = "block";

    let wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn nick")[0]);
    wrap.replaceChild(nicknameInput, nicknameLabel);

}

function saveNick() {
    let newNickname = document.getElementById("newNickname").value;

    // 공백 및 특수문자 확인
    let regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/; // 영문, 숫자, 한글만 허용
    if (!regex.test(newNickname)) {
        alert("닉네임은 공백 및 특수문자를 포함할 수 없습니다.");
        return;
    }
    // 2자 이상, 8자 이하
    else if (newNickname.length < 2 || newNickname.length > 8) {
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
            if (response.status == 400) {
                alert('사용할 수 없는 닉네임입니다.');
                return;
            }
            else if (response.status == 409){
                alert('이미 존재하는 닉네임입니다. 익명 닉네임은 중복 가능합니다.')
            }
            else if (response.ok) {
                // 닉네임 변경 성공 -> 초기상태로 돌아감
                let changeBtn = document.createElement("input");
                changeBtn.setAttribute("class", "btn nick");
                changeBtn.setAttribute("type", "button");
                changeBtn.setAttribute("value", "변경하기");
                changeBtn.setAttribute("onclick", "changeNick()");

                let nicknameInput = document.getElementById("newNickname");
                let nicknameLabel = document.createElement("span");
                nicknameLabel.setAttribute("class", "label2");
                nicknameLabel.setAttribute("id", "nickname");
                nicknameLabel.innerText = newNickname;

                let wrap = document.getElementsByClassName("wrap")[0];

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

function changeCancleNick() {
    let changeBtn = document.createElement("input");
    changeBtn.setAttribute("class", "btn nick");
    changeBtn.setAttribute("type", "button");
    changeBtn.setAttribute("value", "변경하기");
    changeBtn.setAttribute("onclick", "changeNick()");

    let nicknameInput = document.getElementById("newNickname");
    let nicknameLabel = document.createElement("span");
    nicknameLabel.setAttribute("class", "label2");
    nicknameLabel.setAttribute("id", "nickname");
    nicknameLabel.innerText = usernick;

    let wrap = document.getElementsByClassName("wrap")[0];

    wrap.replaceChild(changeBtn, document.getElementsByClassName("btn save nick")[0]);
    wrap.replaceChild(nicknameLabel, nicknameInput);
}

function decryptSessionID(encryptedSessionID) {
    const encryptedString = encryptedSessionID.replace('sessionID=', '');
    const base64Decoded = atob(encryptedString);
    const decoder = new TextDecoder('utf-8');
    const decryptedSessionID = decoder.decode(new Uint8Array([...base64Decoded].map((c) => c.charCodeAt(0))));

    return decryptedSessionID;
}
function DarkMode() {
    const toggleBtn = document.getElementById("togglebtn");

    if (toggleBtn.checked) {
        // 다크모드
        sessionStorage.setItem("darkmode", true);
        //console.log("다크모드 설정");
    }
    else {
        // 디폴트모드
        sessionStorage.setItem("darkmode", false);
        //console.log("다크모드 해제");
    }
}
function checkDark(){
    const isToggled = sessionStorage.getItem("darkmode");
    console.log(isToggled);
    if (isToggled == null) {
        //console.log("초기상태");
        sessionStorage.setItem("darkmode", false);
    }
    else {
        if (isToggled === "true") {
            //console.log("다크모드 유지");
            document.getElementById("togglebtn").checked = true;
        }
    }
}
checkDark();