const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mailInfo = require('./mailInfo');
const mailfrom = '@naver.com'; //자기 네이버 메일

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'userdata'
});

const logdata = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'chatlogs'
});

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/js', express.static(path.join(__dirname, 'static/js')));
app.use('/assets', express.static(path.join(__dirname, 'static/assets')));
app.use('/html', express.static(path.join(__dirname, 'static/html')));
app.use('./static/index.html', express.static(path.join(__dirname, 'static/index.html')));

app.get('/', (req, res) => {
  fs.readFile('./static/index.html', function (err, data) {
    if (err) {
      res.send('Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    }
  });
});
app.get('/index.html', (req, res) => {
  fs.readFile('./static/index.html', function (err, data) {
    if (err) {
      res.send('Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

  // 사용자 인증 로직 (예시: 데이터베이스에서 검색)
  connection.query(
    'SELECT * FROM userdata WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (results.length === 0) {
        // 사용자 정보가 일치하지 않을 경우
        res.status(401).json({ message: '로그인에 실패했습니다.' });
      } else {
        // 사용자 정보가 일치할 경우
        const sessionID = generateSessionID(); // 세션 아이디 생성 함수 호출
        res.cookie('sessionID', sessionID, { httpOnly: false }); // 세션 아이디를 쿠키에 설정 
        res.status(200).json({ message: '로그인에 성공했습니다.', sessionID });
        console.log('응답 전송:', { message: '로그인에 성공했습니다.', sessionID });
      }
    }
  );
});

app.post('/check-username', (req, res) => {
  const username = req.body.username;

  connection.query(
    'SELECT * FROM userdata WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      const exists = results.length > 0;
      res.status(200).json({ exists });
    }
  );
});

let mailCode;
app.post('/send-verification', (req, res) => {
  const email = req.body.email;

  connection.query( //이메일 중복확인
    'SELECT * FROM userdata WHERE email = ?',
    [email],
    (err, results) => {
      const exists = results.length > 0;
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (exists) {
        res.status(200).json({ exists });
        return;
      }
      else {
        sendMail(req, res, email);
      }
    }
  );
});


const sendMail = (req, res, email) => {
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  mailCode = verificationCode;

  // 이메일 전송 설정
  const transporter = nodemailer.createTransport({
    service: 'Naver',
    host: 'smtp.naver.com',
    auth: {
      user: mailInfo.funideaEmailIfo.user, // 보내는 이메일 계정
      pass: mailInfo.funideaEmailIfo.pass // 보내는 이메일 계정의 비밀번호
    }
  });
  const mailOptions = {
    from: mailfrom, // 보내는 사람 이메일 주소
    to: email, // 받는 사람 이메일 주소
    subject: '선문톡에서 보낸 인증코드 이메일입니다.', // 이메일 제목
    text: `인증코드: ${verificationCode}` // 이메일 내용
  };

  // 이메일 전송
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: '이메일 전송에 실패했습니다.' });
    } else {
      console.log('Email sent: ' + info.response);
      const exists = false;
      res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.', code: mailCode, exists: exists });
    }
  });
}


app.post('/send-findAccount', (req, res) => {
  const email = req.body.email;

  // 사용자 정보 조회
  connection.query(
    'SELECT username, password FROM userdata WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: '데이터베이스 오류' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ message: '일치하는 계정이 없습니다.' });
        return;
      }
    })

  const accountInfo = results[0];
  const username = accountInfo.username;
  const password = accountInfo.password;

  // 이메일 전송 설정
  const transporter = nodemailer.createTransport({
    service: 'Naver',
    host: 'smtp.naver.com',
    auth: {
      user: mailInfo.funideaEmailIfo.user, // 보내는 이메일 계정
      pass: mailInfo.funideaEmailIfo.pass // 보내는 이메일 계정의 비밀번호
    }
  });
  const mailOptions = {
    from: 'molly724@naver.com', // 보내는 사람 이메일 주소
    to: email, // 받는 사람 이메일 주소
    subject: '선문톡에서 보낸 계정 정보입니다.', // 이메일 제목
    text: `아이디: ${username}\n비밀번호: ${password}` // 이메일 내용
  };

  // 이메일 전송
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: '이메일 전송에 실패했습니다.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    }
  });
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  /*const verificationCode = req.body.verificationCode;
  console.log("메일코드"+mailCode);
  console.log(req.body);
  if (!username || !password || !email || !verificationCode) {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }

  if (verificationCode != mailCode) {
    res.status(401).json({ error: 'Invalid verification code' });
    return;
  }*/

  connection.query(
    'INSERT INTO userdata (username, password, email) VALUES (?, ?, ?)',
    [username, password, email],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.status(200).json({ message: 'Signup successful' });
    }
  );
});

// 내 정보 조회 요청 응답
app.post('/myPage', (req, res) => {
  // 클라이언트로부터 전달받은 username
  const username = req.body.username;
  connection.query('SELECT username, password, email, nickname FROM userdata WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('내정보 조회 에러:', error);
      res.status(500).json({ error: '내정보 조회 중 서버 오류가 발생했습니다.' });
    } else {
      // 검색된 사용자 정보를 클라이언트에게 응답합니다.
      if (results.length > 0) {
        const userData = results[0];
        res.json(userData);
      } else {
        res.status(404).json({ error: '해당 사용자를 찾을 수 없습니다.' });
      }
    }
  });
});
/*
// 워드클라우드 데이터 요청에 대한 처리.....형태소 분석이 없는 ver
app.get('/wordcloud', (req, res) => {
  // 채팅 로그 데이터를 DB에서 가져오는 작업
  logdata.query('SELECT message FROM chatlogs', (err, results) => {
    if (err) {
      console.error('채팅 로그 데이터 조회 에러:', err);
      res.status(500).json({ error: '채팅 로그 데이터 조회에 실패했습니다.' });
      return;
    }

    // 채팅 로그 데이터를 단어로 분리하여 단어 빈도수를 계산하는 작업
    const wordCounts = {}; // 단어 빈도수를 저장할 객체

    for (let i = 0; i < results.length; i++) {
      const message = results[i].message;

      // 은/는/이/가/을/를에 따라 단어를 분리
      const words = message.split(/은 |는 |이 |가 |을 |를|, |. /);

      for (let j = 0; j < words.length; j++) {
        const word = words[j].trim();

        // 자음이나 모음만 있는 글자는 제외
        if (isOnlyConsonantsOrVowels(word)) {
          continue;
        }

        if (wordCounts[word]) {
          wordCounts[word]++; // 이미 존재하는 단어면 빈도수 증가
        } else {
          wordCounts[word] = 1; // 새로운 단어면 빈도수 초기화
        }
      }
    }

    // 클라이언트로 단어 빈도수 정보를 전달
    res.json({ wordCounts });
  });
});

// 자음이나 모음만 있는 글자인지 확인하는 함수
function isOnlyConsonantsOrVowels(word) {
  const consonants = /[ㄱ-ㅎ]/;
  const vowels = /[ㅏ-ㅣ]/;

  // 자음이나 모음만 있는 글자인지 검사
  return word.split('').every((char) => {
    return consonants.test(char) || vowels.test(char);
  });
}*/

// 워드클라우드 데이터 요청에 대한 처리
app.get('/wordcloud', (req, res) => {
  exec('python wordCloud.py', (error, stdout, stderr) => {
    if (error) {
      console.error('파이썬 스크립트 실행 에러:', error);
      res.status(500).json({ error: '워드클라우드 데이터 처리에 실패했습니다.' });
      return;
    }

    try {
      const wordCounts = JSON.parse(stdout);
      res.json({ wordCounts });
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      res.status(500).json({ error: '데이터 파싱에 실패했습니다.' });
    }
  });
});


function generateSessionID() {
  // 세션 아이디를 생성하는 로직을 구현합니다.
  // 예시: 현재 시간을 기반으로 랜덤한 문자열을 생성하여 사용

  const timestamp = new Date().getTime().toString();
  const randomString = Math.random().toString(36).substring(2, 10);
  const sessionID = timestamp + randomString;

  return sessionID;
}


const server = http.createServer(app);
const io = socket(server);
// 사용자들을 저장할 배열
const users = [];
// 매칭 대기열을 저장할 배열
const matchQueue = [];
// 채팅방들을 저장할 객체
const chatRooms = {};
// 채팅방이 로그를 전달했는지
let logSave = {};

//const chatRoomId = getChatRoomId(socket); 하고 socket.to(chatRoomId).emit 로 보내면 채팅방에 보내짐!

io.sockets.on('connection', function (socket) {
  // 매칭 요청을 받았을 때 처리
  socket.on('requestMatch', () => {
    console.log(`${socket.id}이(가) 매칭을 요청했습니다.`);

    // 매칭 대기열에 사용자 추가
    matchQueue.push(socket);

    // 매칭 시도
    tryMatch();

    // 매칭 대기 메시지 전송
    socket.emit('matchWaiting');
  });

  socket.on('newUser', function (name) {
    console.log(name + ' 님이 접속하였습니다요~.');
    socket.name = name;
    console.log(name + '이라고 저장은 했다요~');
    /*io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + '님이 접속하였습니다.',
    });*/

    // 사용자 배열에 추가
    users.push(socket);
  });

  // 이부분에서 룸아디를 다시 받아서 해당 방의 정보를 재설정!!
  socket.on('sendRoomId', function (chatRoomId) {
    logSave[chatRoomId]=0;//로그 보냈나 설정
    const chatRoom = chatRooms[chatRoomId];
    if (chatRoom) {
      // 채팅방이 유효한 경우에만 처리합니다.
      const updatedChatRoom = {
        id: chatRoom.id,
        users: [...chatRoom.users, socket.id]
      };
      chatRooms[chatRoomId] = updatedChatRoom;
      socket.join(chatRoomId);
    }


  })

  socket.on('message', function (data) {
    data.name = socket.name;
    // 현재 소켓이 속한 채팅방 ID를 가져옵니다.
    const chatRoomId = getChatRoomId(socket);

    //console.log("가져온 룸id:" + chatRoomId);

    if (chatRoomId) {
      // 해당 채팅방에만 메시지 전송
      socket.to(chatRoomId).emit('update', data);
    }

  });
  //소켓이 연결을 종료했을 때
  //메시지를 보낼 때마다 로그를 저장하기엔 서버가 할 일이 많으니 이때 하도록 하자 
  //로그를 저장했나 안했나
  socket.on('disconnect', function () {
    const chatRoomId = getChatRoomId(socket);
    //로그 요청 
    socket.to(chatRoomId).emit('giveLog');
    console.log(`${socket.id}이(가) 연결을 종료했습니다.`);
    console.log(socket.name + ' 님이 나가셨습니다.');
    socket.to(chatRoomId).emit('update', {
      type: 'disconnect',
      name: 'SERVER',
      message: /*socket.name +*/ '상대방이 채팅을 종료했습니다.',
    });

  });
  //채팅 로그저장
  socket.on('log', function (chatLog) {
    const chatRoomId = getChatRoomId(socket);
    if (logSave[chatRoomId] == 0) { //
      //로그를 받고
      chatLog.forEach(log => {
      const {roomid, username, message, sendtime} = log;
      logdata.query(
        'INSERT INTO chatlogs (roomid ,username, message, sendtime) VALUES (?, ?, ?, ?)',[log.roomid, log.username, log.message, log.sendtime]);    
      }); 
      console.log("로그저장 완료");
      logSave[chatRoomId] = 1;
    }
  });
  // 사용자 배열에서 제거
  const index = users.findIndex(user => user.id === socket.id);
  if (index !== -1) {
    users.splice(index, 1);
  }

  // 매칭 대기열에서 제거
  const queueIndex = matchQueue.findIndex(user => user.id === socket.id);
  if (queueIndex !== -1) {
    matchQueue.splice(queueIndex, 1);
  }
});




// 매칭 시도 함수
function tryMatch() {
  // 매칭 대기열에 있는 사용자가 2명 이상일 때 매칭 시도
  if (matchQueue.length >= 2) {
    // 매칭할 사용자들을 랜덤하게 선택
    const randomIndexes = getRandomIndexes(matchQueue.length, 2);
    const user1 = matchQueue[randomIndexes[0]];
    const user2 = matchQueue[randomIndexes[1]];

    // 매칭 성공
    console.log(`${user1.id}과(와) ${user2.id}이(가) 매칭되었습니다.`);

    // 채팅방 생성
    const chatRoomId = generateChatRoomId();
    const chatRoom = {
      id: chatRoomId,
      users: [user1.id, user2.id]
    };
    chatRooms[chatRoomId] = chatRoom;
    console.log("생성된 chatRoomId : " + chatRoomId);
    // 채팅방에 입장
    user1.join(chatRoomId); //이 부분이 필요할까?
    user2.join(chatRoomId);

    // 매칭된 사용자들에게 매칭 성공 및 채팅방 정보 전송
    // 이 부분에 대해서도 건드릴 필요가 있음
    user1.emit('matchSuccess', {
      chatRoomId: chatRoomId,
      matchedUser: {
        id: user2.id,
        name: user2.name
      }
    });
    user2.emit('matchSuccess', {
      chatRoomId: chatRoomId,
      matchedUser: {
        id: user1.id,
        name: user1.name
      }
    });

    // 입장한 사용자들에게 채팅방 정보 전송
    io.to(chatRoomId).emit('chatRoomInfo', chatRoom);

    // 매칭된 사용자들을 대기열에서 제거
    matchQueue.splice(randomIndexes[0], 1);
    matchQueue.splice(randomIndexes[1], 1);

    // 다음 매칭 시도
    tryMatch();
  }
}

// 채팅방 ID를 생성하는 함수
function generateChatRoomId() {
  // 채팅방 ID는 간단하게 UUID 형태로 생성으로 가려했으나 현재 시간까지 넣어서 절대 겹치는 일 없게
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요, 앞에 0을 붙여 2자리로 만듦
  let day = ("0" + date.getDate()).slice(-2); // 일, 앞에 0을 붙여 2자리로 만듦
  let hour = ("0" + date.getHours()).slice(-2);
  let min = ("0" + date.getMinutes()).slice(-2);
  let sec = ("0" + date.getSeconds()).slice(-2);
  const timestamp = `${year}-${month}-${day}/${hour}:${min}:${sec}`
  console.log("생성된 룸:"+'room_' + Math.random().toString(36).substr(2, 9)+timestamp);
  return 'room_' + Math.random().toString(36).substr(2, 9)+timestamp;
}

// 랜덤한 인덱스를 생성하는 함수
function getRandomIndexes(length, count) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[randomIndex]] = [indexes[randomIndex], indexes[i]];
  }
  return indexes.slice(0, count);
}
function getChatRoomId(socket) {
  //console.log("룸아디 찾으려는 소켓아디 : " + socket.id);
  // 현재 소켓이 속한 채팅방 ID를 찾습니다.
  for (const chatRoomId in chatRooms) {
    const chatRoom = chatRooms[chatRoomId];
    if (chatRoom.users.includes(socket.id)) {
      return chatRoomId;
    }
  }
  return null;
}

server.listen(80, () => {
  console.log('Server is listening on port 80');
});
