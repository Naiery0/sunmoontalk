function convertScreen(url){
    location.href = url;
}

function getSessionID(){
    const cookies = document.cookie.split(";"); // 모든 쿠키 가져오기
    //console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // 쿠키 이름이 "sessionID"인 경우 값을 추출하여 반환
      if (cookie.startsWith("sessionID=")) {
        return cookie.substring("sessionID=".length, cookie.length);
      }
    }
    return null; // sessionID 쿠키를 찾지 못한 경우 null 반환
}

function isLogin() {
    const sessionID = getSessionID();
    const opt = document.getElementById("tableopt");
  
    if (opt) {
      //console.log("불러온 세션아이디 : "+sessionID);
      if (sessionID !== "" && sessionID !== null) {
        console.log("로그인 정보 확인");
        
        opt.innerText = "내정보";
        opt.onclick = function() {
          //convertScreen('./html/myPage.html');
          changeContent("./html/myPage.html");
        };
      } else {
        console.log("로그인 정보 확인되지 않음");
        opt.innerText = "로그인";
        opt.onclick = function() {
          convertScreen('./html/login.html');
        };
      }
    }
  }

isLogin(); // index.html이 로드될 때마다 로그인 되었는지 확인

function changeContent(url){
  const content  = document.getElementById("content");
  content.src=url;
}
  
