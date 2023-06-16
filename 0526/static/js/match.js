let animation_work;
// 서버에 연결합니다.
const socket = io();

function requestGroupChat() {
  socket.emit('requestGroupChat');
}

// 매칭 요청을 보내는 함수
function requestMatch() {
  // app.js에 매칭 요청
  socket.emit('requestMatch');

  // 매칭 애니메이션 실행 -> 로딩바 돌아감 -> 작업이 끝나면 clearInterval(animation_work)로 종료
  animation_work = setInterval(loading_animation,15);
}

function getSessionID(){
    const cookies = document.cookie.split(";"); // 모든 쿠키 가져오기
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // 쿠키 이름이 "sessionID"인 경우 값을 추출하여 반환
      if (cookie.startsWith("sessionID=")) {
        return cookie.substring("sessionID=".length, cookie.length);
      }
    }
    return null; // sessionID 쿠키를 찾지 못한 경우 null 반환
}


// 매칭 성공 응답을 처리하는 이벤트 핸들러를 등록
socket.on('matchSuccess', function(data) {
  const chatRoomId = data.chatRoomId;
  //const matchedUser = data.matchedUser;
  clearInterval(animation_work);
  // 채팅방 페이지로 이동
  const chatPageUrl = `../html/chat.html?room=${chatRoomId}`;
  localStorage.setItem('roomid', chatRoomId); 
  window.location.href = chatPageUrl;
});

// 매칭 실패 응답을 처리하는 이벤트 핸들러를 등록
socket.on('matchFailed', function() {
  clearInterval(animation_work);
  alert('매칭 실패! 상대방이 없습니다.');
});

let loading_index = 0;
const loading = document.getElementById("chatLoadBigCircle")
const loadingbar_width = 25;
function loading_animation(){

  if(loading_index>(100-loadingbar_width)){
      loading.style.background = 'conic-gradient(white 0% '+((loading_index+loadingbar_width)-100)
      +'%, skyblue '+((loading_index+loadingbar_width)-100)+'% '+loading_index+'%, white '+loading_index+'% 100%';
  }
  else{
      loading.style.background = 'conic-gradient(skyblue 0% '+loading_index+'%, white '
      +loading_index+'% '+(loading_index+loadingbar_width)+'%, skyblue '+(loading_index+loadingbar_width)+'% 100%)';
  }

  if(loading_index>=100) loading_index = 0;
  loading_index = loading_index+1;
}

let intervalId;
let CURRENT_SCREEN;
function toggleSlide() {
  let btn = document.getElementById("btn");

  clearTimeout(intervalId);
  intervalId = null;
}

function showSlide(index){

  if(index==1) CURRENT_SCREEN = "chatLobby";
  else if(index==2) CURRENT_SCREEN = "chatStat";
  else if(index==3) CURRENT_SCREEN = "chatTime";
  clearTimeout(intervalId);

  let slide1 = document.getElementById("chatLobby");
  let slide2 = document.getElementById("chatStat");
  let slide3 = document.getElementById("chatTime");
  let dot1 = document.getElementById("screen1");
  let dot2 = document.getElementById("screen2");
  let dot3 = document.getElementById("screen3");

  slide1.style.opacity = '0.0';
  slide2.style.opacity = '0.0';
  slide3.style.opacity = '0.0';
  dot1.style.backgroundColor = 'transparent';
  dot2.style.backgroundColor = 'transparent';
  dot3.style.backgroundColor = 'transparent';

  switch(index){
    case 1:
      slide1.style.display = 'flex';
      dot1.style.backgroundColor = 'white';

      setTimeout(()=>{
        slide1.style.opacity = '1.0';
        slide2.style.display = 'none';
        slide3.style.display = 'none';
      },10)

      intervalId = setTimeout(()=>{
        showSlide(2);
      },6000);
      break;
    case 2:
      slide2.style.display = 'flex';
      dot2.style.backgroundColor = 'white';

      setTimeout(()=>{
        slide2.style.opacity = '1.0';
        slide1.style.display = 'none';
        slide3.style.display = 'none';
      },10)

      intervalId = setTimeout(()=>{
        showSlide(3);
      },6000);
      break;
    case 3:
      slide3.style.display = 'flex';
      dot3.style.backgroundColor = 'white';

      setTimeout(()=>{
        slide3.style.opacity = '1.0';
        slide1.style.display = 'none';
        slide2.style.display = 'none';
      },10)

      intervalId = setTimeout(()=>{
        showSlide(1);
      },6000);
      break;
  }
}

/*
function showSlide1(){
  CURRENT_SCREEN = "chatLobby";
  clearTimeout(intervalId);
  
  let slide1 = document.getElementById("chatLobby");
  let slide2 = document.getElementById("chatStat");
  let dot1 = document.getElementById("screen1");
  let dot2 = document.getElementById("screen2");

  slide1.style.display = 'flex';
  slide2.style.opacity = '0.0';

  dot1.style.backgroundColor = 'white';
  dot2.style.backgroundColor = 'transparent';

  setTimeout(()=>{
    slide1.style.opacity = '1.0';
    slide2.style.display = 'none';
  },10)

  intervalId = setTimeout(()=>{
    showSlide2();
  },4000);

}
function showSlide2(){
  CURRENT_SCREEN = "chatStat";
  clearTimeout(intervalId);

  let slide1 = document.getElementById("chatLobby");
  let slide2 = document.getElementById("chatStat");
  let dot1 = document.getElementById("screen1");
  let dot2 = document.getElementById("screen2");

  slide2.style.display = 'flex';
  slide1.style.opacity = '0.0';
  
  dot1.style.backgroundColor = 'transparent';
  dot2.style.backgroundColor = 'white';

  setTimeout(()=>{
    slide1.style.display = 'none';
    slide2.style.opacity = '1.0';
  },10)

  intervalId = setTimeout(()=>{
    showSlide1();
  },4000);
}
*/

intervalId = setTimeout(() => {
  showSlide(2);
}, 3000);


// "시작하기" 버튼 클릭에 대한 이벤트 리스너를 추가
function start_matching(num) {

  clearTimeout(intervalId);
  const chatLobby = document.getElementById("chatLobby");
  const chatStat = document.getElementById("chatStat");
  const tool = document.getElementById("tool");

  let temp = getSessionID();

  if (temp != "" && temp != null) {
    if(num==2){
    requestGroupChat();
    }//개인톡일때
    else{
      requestMatch();
      chatLobby.style.display = 'none';
      chatLoading.style.display = 'flex';
      tool.style.display = 'none';
      chatStat.style.display = 'none';
    }
  }
  else {
    alert("로그인 후 사용하실 수 있습니다");
    window.parent.location.href = "../html/login.html";
  }
};