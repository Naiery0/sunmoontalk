let checkId = 0;
let checkEmail = 0;
let mailCode;
// 중복 체크 버튼의 이벤트 리스너
function checkUsername() {

  const username = document.getElementById("username").value;
  event.preventDefault();

  if (username != "" && username != null) {
    fetch("/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "username=" + encodeURIComponent(username)
    })
      .then(response => response.json())
      .then(data => {
        const noticeID = document.getElementById("noticeID");
        noticeID.style.display = 'inline';

        if (data.exists) {
          noticeID.style.color = 'RGB(214,0,63)';
          noticeID.innerText = "이미 존재하는 아이디입니다";
        } else {
          checkId = 1;
          noticeID.style.color = 'RGB(0,117,128)';
          noticeID.innerText = "사용가능한 아이디입니다";
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  else {
    const noticeID = document.getElementById("noticeID");
    noticeID.style.display = 'inline';
    noticeID.style.color = 'RGB(214,0,63)';
    noticeID.innerText = "아이디를 입력해주세요";
  }
}

// 인증 코드 전송 버튼의 이벤트 리스너
function sendVerificationCode(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  const noticeEMAIL = document.getElementById("noticeEMAIL");
  let flag = 0;

  if (email !== "" && email !== null) {
    //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.sunmoon\.ac\.kr$/;

    const checkEmailUse = email.indexOf("@");

    if (checkEmailUse !== -1) {
      // 입력된 값이 올바른 이메일 형식인지 확인하는 함수
      function validateEmail(emailValue) {
        if (!(emailRegex.test(emailValue))) {
          noticeEMAIL.style.display = 'inline';
          noticeEMAIL.style.color = 'RGB(214,0,63)';
          noticeEMAIL.innerText = "올바른 이메일 형식이 아닙니다";
          flag = 1;
        } else noticeEMAIL.style.display = 'none';
      }
      validateEmail(email);
    }
    else {
      email = email + "@mail.sunmoon.ac.kr";
    }

    if (flag == 0) {
      const formData = new URLSearchParams();
      formData.append("email", email);

      fetch("/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      })
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            noticeEMAIL.style.display = 'inline';
            noticeEMAIL.style.color = 'RGB(214,0,63)';
            noticeEMAIL.innerText = "해당 이메일의 계정이 이미 존재합니다.";
          }
          else{
            mailCode = data.code;
            const noticeCODE = document.getElementById("noticeEMAIL");
            noticeCODE.style.display = 'inline';
            noticeCODE.style.color = 'RGB(0,117,128)';
            noticeCODE.innerText = "인증코드가 전송되었습니다!";
            checkEmail = 1;
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  } 
  else {
    const noticeCODE = document.getElementById("noticeEMAIL");
    noticeCODE.style.display = 'inline';
    noticeCODE.style.color = 'RGB(214,0,63)';
    noticeCODE.innerText = "이메일을 입력해주세요";
  }
}
// 폼 제출 버튼의 이벤트 리스너
function submitForm() {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  let email = document.getElementById("email").value;
  const verificationCode = document.getElementById("verification-code").value;

  const checkEmail = email.indexOf("@");
  if(!(checkEmail !== -1)) {
    email = email + "@mail.sunmoon.ac.kr";
  }

  if (password !== confirmPassword) {
    alert("패스워드가 일치하지 않습니다.");
    return;
  }

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "username=" + encodeURIComponent(username) +
      "&password=" + encodeURIComponent(password) +
      "&email=" + encodeURIComponent(email) +
      "&verificationCode=" + encodeURIComponent(verificationCode)
  })
    .then(response => response.json())
    .then(data => {
      window.location.href = '../html/login.html';
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

// 페이지 로드 시 실행될 초기화 함수
function initialize() {
  const checkUsernameBtn = document.getElementById("check-username-btn");
  const sendVerificationBtn = document.getElementById("send-verification-btn");
  const form = document.querySelector("form");

  checkUsernameBtn.addEventListener("click", checkUsername);
  sendVerificationBtn.addEventListener("click", sendVerificationCode);
  form.addEventListener("submit", submitForm);
}

// 뒤로 가기 버튼의 이벤트 리스너
function goBack() {
  window.location.href = "../html/login.html";
}

document.addEventListener("DOMContentLoaded", initialize);

function checkInfo(event) {

  //noticeID , noticePW , noticePWCheck , noticeEMAIL , noticeCODE
  //username , password , confirm-password , email , verification-code
  // red : 214, 0 ,63 // green : 0 , 117 , 128

  event.preventDefault(); // 오류가 발생한 채로 제출 방지
  let flag = 0;

  const ID = document.getElementById("username");
  const PW = document.getElementById("password");
  const CheckPW = document.getElementById("confirm-password");
  const EMAIL = document.getElementById("email");
  const CODE = document.getElementById("verification-code");

  const noticeID = document.getElementById("noticeID");
  const noticePW = document.getElementById("noticePW");
  const noticePWCheck = document.getElementById("noticePWCheck");
  const noticeEMAIL = document.getElementById("noticeEMAIL");
  const noticeCODE = document.getElementById("noticeCODE");

  // 아이디 체크
  if (ID.value == "" || ID.value == null) {
    noticeID.style.display = 'inline';
    noticeID.style.color = 'RGB(214,0,63)';
    noticeID.innerText = "생성할 아이디를 입력해주세요";
    flag = 1;
  }
  else {
    const symbols = /[!@#$%^&*(),.?":{}|<>\\]/;

    function checkSymbols(Input) {
      if (symbols.test(Input)) {
        // 특수 기호가 포함되어 있을 경우
        noticeID.style.display = 'inline';
        noticeID.innerText = "특수기호를 포함할 수 없습니다";
        noticeID.style.color = 'RGB(214,0,63)';
        flag = 1;
      }
      else noticeID.style.display = 'none';
    }
    checkSymbols(ID.value);
  }

  if(checkId==0){
    noticeID.style.display = 'inline';
    noticeID.innerText = "아이디 중복을 확인해주세요";
    noticeID.style.color = 'RGB(214,0,63)';
    flag = 1;
  }
  else{
    noticeID.style.display = 'none';
  }
  
  // 비밀번호 체크
  if (PW.value == "" || PW.value == null) {
    noticePW.style.display = 'inline';
    noticePW.innerText = "비밀번호를 입력해주세요";
    flag = 1;
  }
  else if (PW.value.length < 8) {
    noticePW.style.display = 'inline';
    noticePW.innerText = "비밀번호는 8자리 이상 설정해주세요";
    flag = 1;
  }
  else noticePW.style.display = 'none';

  // 비밀번호 재입력 체크
  if (CheckPW.value == "" || CheckPW.value == null) {
    noticePWCheck.style.display = 'inline';
    noticePWCheck.innerText = "비밀번호를 다시 입력해주세요";
    flag = 1;
  }
  else if (PW.value != CheckPW.value) {
    noticePWCheck.style.display = 'inline';
    noticePWCheck.innerText = "비밀번호가 일치하지 않습니다";
    flag = 1;
  }
  else noticePWCheck.style.display = 'none';

  if (EMAIL.value == "" || EMAIL.value == null) {
    noticeEMAIL.style.display = 'inline';
    noticeEMAIL.style.color = 'RGB(214,0,63)';
    noticeEMAIL.innerText = "이메일을 입력해주세요";
    flag = 1;
  }
  else {
    noticeEMAIL.style.display = 'none';
  }

  if(checkEmail===0){
    noticeEMAIL.style.display = 'inline';
    noticeEMAIL.style.color = 'RGB(214,0,63)';
    noticeEMAIL.innerText = "이메일 인증을 해주세요";
    flag = 1;
  }
  else{
    noticeEMAIL.style.display = 'none';
  }

  if (CODE.value == "" || CODE.value == null) {
    noticeCODE.style.display = 'inline';
    noticeCODE.innerText = "인증코드를 입력해주세요"
    flag = 1;
  }
  else if(CODE.value != mailCode){
    noticeCODE.style.display = 'inline';
    noticeEMAIL.style.color = 'RGB(214,0,63)';
    noticeCODE.innerText = "인증코드가 올바르지 않습니다."
    flag = 1;
  }
  else noticeCODE.style.display = 'none';

  // 만약 위 사항을 모두 만족한다면 서버에 데이터 전송
  if (flag == 0) {
    submitForm();
  }
}

function changeID(){
  let usernameInput = document.getElementById("username");
  let previousValue = usernameInput.dataset.previousValue || "";
  let currentValue = usernameInput.value;

  if (previousValue !== currentValue) {
    usernameInput.dataset.previousValue = currentValue;
    checkId = 0;
  }
}
function changeEmail(){
  let emailInput = document.getElementById("email");
  let previousValue = emailInput.dataset.previousValue || "";
  let currentValue = emailInput.value;

  if (previousValue !== currentValue&&checkEmail==1) {
    // 이전 값과 현재 값이 다르면 이벤트를 발생시킴
    emailInput.dataset.previousValue = currentValue;
    checkEmail = 0;
  }
}