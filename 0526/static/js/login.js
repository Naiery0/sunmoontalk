document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const notice = document.getElementById("notice");

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = escapeHTML(usernameInput.value);
            const password = escapeHTML(passwordInput.value);
            console.log("보낼 계정:" + username, password);

            fetch('/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "username=" + encodeURIComponent(username) +
                    "&password=" + encodeURIComponent(password)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('로그인 실패');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("서버가 준 데이타:" + data.message);
                    if (data.message == '로그인에 성공했습니다.') {
                        console.log("서버가 준 세션:" + data.sessionID);
                        document.cookie = `sessionID=${data.sessionID}; path=/`;
                        setTimeout(() => {
                            console.log("로그인 하며 얻은 쿠키:" + document.cookie);
                            window.location.href = '../index.html';
                        }, 1000);
                    } else {
                        notice.style.display = 'block';
                        console.log('로그인 실패');
                    }
                })
                .catch((error) => {
                    notice.style.display = 'block';
                    console.error('로그인 요청 에러', error);
                });
        });
    }
});


function escapeHTML(text) {
    let element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}
