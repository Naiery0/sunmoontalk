document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const notice = document.getElementById("notice");
    let localusername;
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // 폼 기본 동작 방지

            const username = usernameInput.value;
            const password = passwordInput.value;
            console.log("보낼 계정:" + username, password);

            // 서버로 로그인 요청을 보냅니다.
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

                    localusername=username;
                    localStorage.setItem('username',localusername); //클라에 유저넴 저장

                    console.log("서버가 준 데이타:" + data.message);
                    // 로그인 요청의 응답을 처리합니다.
                    if (data.message == '로그인에 성공했습니다.') {
                        // 세션 아이디를 쿠키로 설정합니다.
                        console.log("서버가 준 세션:" + data.sessionID);
                        document.cookie = `sessionID=${data.sessionID}; path=/`;
                        // 로그인 성공 시 처리할 내용을 작성하세요. 
                        setTimeout(() => {
                            console.log("로그인 하며 얻은 쿠키:" + document.cookie);
                            // 예: 리디렉션 또는 다른 작업 수행
                            window.location.href = '../index.html';
                        }, 1000); // 적절한 시간 지연을 줍니다.
                    } else {
                        // 로그인 실패 시 처리할 내용을 작성하세요.
                        notice.style.display = 'block';
                        console.log('로그인 실패');
                        // 예: 에러 메시지 표시 또는 다른 작업 수행
                    }
                })
                .catch((error) => {
                    // 에러 발생 시 처리할 내용을 작성하세요.
                    notice.style.display = 'block';
                    console.error('로그인 요청 에러', error);
                });
        });
    }
});
