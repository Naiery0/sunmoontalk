
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