const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chat_Input");

const socket = io();

const username = decryptSessionID(document.cookie);
let whatname;
let colorMine;
let colorOther;

let chatLogs=[];
let chatRoomId;
let hereIsGroup=false; //이게 트루면 그룹채팅방임. //socket.on('update' 부분에서 닉네임 쓰려면 data.username 하면됨

//연결
socket.on('connect', function () {
    const name = decryptSessionID(document.cookie); 
    //이부분에서 match.js에서 보내준 chatRoomId를 받아서
    chatRoomId = localStorage.getItem('roomid');
    if (chatRoomId=='groupchat'){
        hereIsGroup=true;
    }
    //서버에 새로운 유저가 왔다 알림
    //이부분에서 chatRoomId를 서버로 보낸다.
    //서버가 받으면 수신한 소켓에게 chatRoomId를 부여한다.
    socket.emit('sendRoomId', chatRoomId);
    socket.emit('newUser', name); //사실 여기서 보내는 이름은 id임

    let rand = Math.floor(Math.random()*255);
    let rand2 = Math.floor(Math.random()*255);
    let rand3 = Math.floor(Math.random()*255);
    let color = "RGB("+rand+","+rand2+","+rand3+")";

    colorMine = color;

    rand = Math.floor(Math.random()*255);
    rand2 = Math.floor(Math.random()*255);
    rand3 = Math.floor(Math.random()*255);
    color = "RGB("+rand+","+rand2+","+rand3+")";

    colorOther = color;
})
socket.on('roomIndex',function (data){
    chatLog.innerHTML +=
    "<span class='chat_message_wrap'>"
    + "<span class='chat_notice'>"
    + "<span class='chat_output'>" + '단체 채팅에 입장하셨습니다! 현재 인원 수 : '+`${data.roomIndex}` + "</span>"
    + "</span>"
    + "</span>";
})

//입장 시 상대방 이름 통보
socket.on('welcome',function (data) { //여기서 받는게 닉네임
    chatLog.innerHTML +=
    "<span class='chat_message_wrap'>"
    + "<span class='chat_notice'>"
    + "<span class='chat_output'>" + `${data.message}` + "</span>"
    + "</span>"
    + "</span>";
})

//로그 요청 받음
socket.on('giveLog',function(){
    socket.emit('log', chatLogs);
})

socket.on('disconnect', function () {
    // 서버와의 연결이 끊겼음을 사용자에게 알림
    chatLog.innerHTML +=
        "<span class='chat_message_wrap'>"
        + "<span class='chat_notice'>"
        + "<span class='chat_output'>" + '서버와의 연결이 끊어졌습니다.' + "</span>"
        + "</span>"
        + "</span>";

    // 채팅 입력 폼 비활성화
    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.disabled = true;
    hereIsGroup=false;
});

socket.on('update', function (data) { 
    if (data.type == 'disconnect') { //이 부분은 상대가 나갔으면 상대방 나갔다고 출력하는 부분임. `${data.message}`만 유지해주면 댐
        chatLog.innerHTML +=
            "<span class='chat_message_wrap'>"
            + "<span class='chat_notice'>"
            + "<span class='chat_output'>" + `${data.message}` + "</span>"
            + "</span>"
            + "</span>";
        if (chatRoomId=='groupchat'){
            
        }
        else {
            chatInput.disabled = true;
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    }
    else {
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요, 앞에 0을 붙여 2자리로 만듦
        let day = ("0" + date.getDate()).slice(-2); // 일, 앞에 0을 붙여 2자리로 만듦
        let hour = ("" + date.getHours()).slice(-2);
        let min = ("" + date.getMinutes()).slice(-2); //001~009 뜨는거 이 부분 수정해봤으니 적용되는지 확인해야됨
        let sec = ("0" + date.getSeconds()).slice(-2);

        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;

        if(hereIsGroup){
            chatLog.innerHTML +=
            "<div class='chat_message_wrap'>" +
                "<div class='chat chat_message_other'>" +
                    "<div class='chat_profile' style='background-color:"+colorOther+"'>" +
                        "<div class='chat_username'>"+`${data.username}`+"</div>"+
                        "<img class='Imgprofile' src='../assets/person.png'>" +
                    "</div>" +
                    "<div class='chat_output'>" +
                        `${data.message}` +
                    "</div>" +
                    "<div class='chat_time chat_time_other'>" +
                        hour +":" +min +
                    "</div>" +
                "</div>" +
            "</div>";
        }
        else{
            chatLog.innerHTML +=
            "<div class='chat_message_wrap'>" +
                "<div class='chat chat_message_other'>" +
                    "<div class='chat_profile' style='background-color:"+colorOther+"'>" +
                        "<img class='Imgprofile' src='../assets/person.png'>" +
                    "</div>" +
                    "<div class='chat_output'>" +
                        `${data.message}` +
                    "</div>" +
                    "<div class='chat_time chat_time_other'>" +
                        hour +":" +min +
                    "</div>" +
                "</div>" +
            "</div>";
        }
        chatLog.scrollTop = chatLog.scrollHeight;
        chatLogs.push({ roomid: chatRoomId, username: `${data.userid}`, message: `${data.message}`, sendtime: `${year}-${month}-${day} ${hour}:${min}:${sec}` });
    }
});

// 메세지 전송함수
function send() {
    // 입력한 메세지를 message에 저장
    let message = chatInput.value;

    if (message != "") {

        let escapedMessage = escapeHTML(message);

        // 메세지 입력 칸 초기화
        chatInput.value = ''

        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요, 앞에 0을 붙여 2자리로 만듦
        let day = ("0" + date.getDate()).slice(-2); // 일, 앞에 0을 붙여 2자리로 만듦
        let hour = ("" + date.getHours()).slice(-2);
        let min = ("" + date.getMinutes()).slice(-2);
        let sec = ("0" + date.getSeconds()).slice(-2);

        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;

        chatLog.innerHTML +=
            "<div class='chat_message_wrap'>" +
                "<div class='chat chat_message_mine'>" +
                    "<div class='chat_time chat_time_mine'>" +
                        hour +":" +min +
                    "</div>" +
                    "<div class='chat_output'>" +
                        escapedMessage +
                    "</div>" +
                    "<div class='chat_profile' style='background-color:"+colorMine+"'>" +
                        "<img class='Imgprofile' src='../assets/person.png'>" +
                    "</div>" +
                "</div>" +
            "</div>";

        //서버에 메세지 이벤트, 내용 전달
        socket.emit('message', { type: 'message', username: username, userid: username, message: message });
        if(chatRoomId=='groupchat'){
            const groupChatLog=[];
            groupChatLog.push({ roomid: chatRoomId, username: username,  message: message, sendtime: `${year}-${month}-${day} ${hour}:${min}:${sec}` })
            socket.emit('groupLog', groupChatLog);
        }
        else{
            chatLogs.push({ roomid: chatRoomId, username: username,  message: message, sendtime: `${year}-${month}-${day} ${hour}:${min}:${sec}` });
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}



addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        send();
    }
});

// input에서 document에 접근하지 못하도록 만드는 기능
function escapeHTML(html) {
    let element = document.createElement('div');
    element.innerText = html;
    return element.innerHTML;
}

function decryptSessionID(encryptedSessionID) {
    const encryptedString = encryptedSessionID.replace('sessionID=', '');
    const base64Decoded = atob(encryptedString);
    const decoder = new TextDecoder('utf-8');
    const decryptedSessionID = decoder.decode(new Uint8Array([...base64Decoded].map((c) => c.charCodeAt(0))));
  
    return decryptedSessionID;
  }
  
function decryptSessionID(encryptedSessionID) {
    const encryptedString = encryptedSessionID.replace('sessionID=', '');
    const base64Decoded = atob(encryptedString);
    const decoder = new TextDecoder('utf-8');
    const decryptedSessionID = decoder.decode(new Uint8Array([...base64Decoded].map((c) => c.charCodeAt(0))));

    return decryptedSessionID;
}

function darkmode() {
    const isDarked = sessionStorage.getItem("darkmode");
    if (isDarked=="true") {
        console.log("다크모드 활성화!");    
        const chatLog = document.getElementById('chatLog');
        chatLog.classList.toggle('darkmode');

        const root = document.documentElement;
        root.classList.add('darkmode'); // 다크 모드 클래스 추가
    }
    else{
        console.log("다크모드 해제!");
        const root = document.documentElement;
        root.classList.remove('darkmode'); // 다크 모드 클래스 제거
    }
}
// 페이지 로드가 완료된 후 darkmode() 함수 호출
window.addEventListener('load', darkmode);