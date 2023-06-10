const findEmailInput = document.getElementById('findEmail');

const sendVerificationButton = document.querySelector('.btn[value="발송"]');
sendVerificationButton.addEventListener('click', sendFindAccount);

function sendFindAccount(event) {
  event.preventDefault();

  const email = escapeHTML(document.getElementById("findEmail").value);

  if (email !== "" && email !== null) {
    const formData = new URLSearchParams();
    formData.append("email", email);

    fetch("/send-findAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    })
      .then(function (response) {
        // 서버 응답 처리
        if (response.status == 404) {
          alert('등록된 이메일이 아닙니다.');
          return;
        }
        else if (response.status == 200) {
          alert("이메일을 전송하였습니다!");
          window.parent.location.href = "../html/login.html";
        }
      }).catch(error => {
        console.error("Error:", error);
      });
  } else {//이메일을 입력하지 않았을 때
      alert("이메일을 입력해주세요");
  }
}

addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    sendFindAccount();
  }
});

function escapeHTML(text) {
  let element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
}