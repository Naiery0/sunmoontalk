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

let intervalId;
let CURRENT_SCREEN;
function toggleSlide() {
  let btn = document.getElementById("btn");

  clearTimeout(intervalId);
  intervalId = null;
}

function showSlide1(){
  CURRENT_SCREEN = "chatLobby";
  console.log("현재 스크린 : "+CURRENT_SCREEN);
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
  console.log("현재 스크린 : "+CURRENT_SCREEN);
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

intervalId = setTimeout(() => {
  showSlide2();
}, 2000);

// 서버에 워드클라우드 데이터 요청
fetch('/wordcloud')
  .then((response) => {
    if (!response.ok) {
      throw new Error('워드클라우드 데이터 요청 실패');
    }
    return response.json();
  })
  .then((data) => {
    // 워드클라우드 생성
    createWordCloud(data.wordCounts);
  })
  .catch((error) => {
    // 에러 발생 시 처리할 내용을 작성하세요.
    console.error('워드클라우드 데이터 요청 에러', error);
  });

// 워드클라우드 생성 함수
function createWordCloud(wordCounts) {
  // 빈도수가 n회 이상인 단어 필터링
  const filteredWordCounts = Object.entries(wordCounts).filter(([word, count]) => count >= 1);

  // 빈도수 기준 내림차순으로 정렬
  const sortedWordCounts = filteredWordCounts.sort((a, b) => b[1] - a[1]);

  // 상위 30개 키워드 추출
  const topKeywords = sortedWordCounts.slice(0, 30);

  // 워드클라우드 생성 옵션 설정
  const options = {
    list: topKeywords,
    gridSize: 20,
    weightFactor: 17,
    fontFamily: 'omyu_pretty',
    backgroundColor: '#ddfafa',
    color: 'black',
    rotateRatio: 0,
    shuffle: true,
    shape: 'square',
    drawOutOfBound: false,
    origin: [750, 330]
  };
  // 워드클라우드 생성
  WordCloud(document.getElementById('wordcloud'), options);

  setTimeout(() => {
    let cloud = document.getElementById("wordcloud");
    let spanElements = cloud.getElementsByTagName("span");

    console.log(spanElements.length + "개의 데이터 확인!");
    for (let i = 0; i < spanElements.length; i++) {

      let spanElement = spanElements[i];
      spanElement.style.borderRadius = '15px';
      spanElement.style.paddingLeft = '0.25em';
      spanElement.style.paddingRight = '0.25em';
      spanElement.style.backgroundColor = 'RGB('
        + (Math.floor(Math.random() * 255)+100) + ','
        + (Math.floor(Math.random() * 255)+100) + ','
        + (Math.floor(Math.random() * 255)+100) + ')';
      //console.log(i + "번째 데이터에 스타일 적용 완료");
    }
  }, 100);


}