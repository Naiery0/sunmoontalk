const chatLobby = document.getElementById("chatLobby");
let animation_work;
// 서버에 연결합니다.
const socket = io();
// 매칭 요청을 보내는 함수입니다.
function requestMatch() {
  // app.js에 매칭 요청을 보냅니다.
  socket.emit('requestMatch');

  // 매칭 애니메이션 실행 -> 로딩바 돌아감 -> 작업이 끝나면 clearInterval(animation_work)로 종료
  animation_work = setInterval(loading_animation,20);
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

// "시작하기" 버튼 클릭에 대한 이벤트 리스너를 추가합니다.
chatLobby.addEventListener('click', function(event) {
  if (event.target.tagName === 'INPUT') {

    let temp = getSessionID();

    if(temp!=""&&temp!=null){
      requestMatch();
      chatLobby.style.display = 'none';
      chatLoading.style.display = 'flex';
    }
    else{
      alert("로그인 후 사용하실 수 있습니다");
      window.parent.location.href = "../html/login.html";
    }
  }
});

// 매칭 성공 응답을 처리하는 이벤트 핸들러를 등록
socket.on('matchSuccess', function(data) {
  const chatRoomId = data.chatRoomId;
  const matchedUser = data.matchedUser;
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