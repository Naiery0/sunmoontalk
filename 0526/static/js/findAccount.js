const findEmailInput = document.getElementById('findEmail');

const sendVerificationButton = document.querySelector('.btn[value="발송"]');
sendVerificationButton.addEventListener('click', sendFindAccount);

function sendFindAccount(event) {
    event.preventDefault();
  
    const email = document.getElementById("findEmail").value;
  
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
        .then(response => response.json())
        .then(data => {//이메일을 전송했을 때 화면전환
            console.log("계정이메일 전송 완료");
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else {//이메일을 입력하지 않았을 때
    }
  }
