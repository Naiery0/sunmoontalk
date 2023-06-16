const nicknameFrame = document.getElementById("");
let reversedPosts;
let maxPage;
let myname;
// 글 목록을 가져오는 함수
function getPosts() {
    return fetch('/getPosts')
        .then(response => response.json())
        .then(posts => {
            return posts;
        })
        .catch(error => {
            console.error('Error:', error);
            // 에러 처리
        });
}

function initializeBoard() {
    const contentFrame = document.getElementById("readCommentWrap");

    getPosts().then(posts => {

        const commentNav = document.getElementById("commentNav");
        for (let i = 1; i <= ((posts.length / 10) + 1); i++) {
            commentNav.innerHTML += "<span class='navBtn' id='nav" + i + "' onclick='displayPage(" + (i - 1) + ")'>" + i + "</span>";

            if (i == 1) {
                document.getElementById("nav" + 1).style.color = 'darkgray';
            }
        }
        maxPage = Math.floor(((posts.length / 10) + 1));

        reversedPosts = posts.reverse();
        displayPage(0);
        /*
        reversedPosts.forEach(post => {
            const utcTime = post.writetime;
            const date = new Date(utcTime);
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                //second: 'numeric',
                hour12: false
            };
            const localTime = date.toLocaleString('ko-KR', options);

            const commentWrap = document.createElement('span');
            commentWrap.classList.add('commentWrap');

            commentWrap.innerHTML = `
                <span class="commentAuthor">${post.writer}</span>
                <span class="commentDate">${localTime}</span>
                <span class="commentContent">${post.content}</span>
            `;

            contentFrame.appendChild(commentWrap);
        });
        */
    });
}

function displayPage(index) {
    const contentFrame = document.getElementById("readCommentWrap");
    contentFrame.innerHTML = "";

    for (let i = 0; i < maxPage; i++) {

        const nav = document.getElementById("nav" + (i + 1));
        if (index == i) {
            nav.style.color = 'darkgray';
        }
        else {
            nav.style.color = 'black';
        }
    }

    for (let i = (index * 10); i < ((index * 10) + 10); i++) {

        if (reversedPosts[i] != null) {
            const utcTime = reversedPosts[i].writetime;
            const date = new Date(utcTime);
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                //second: 'numeric',
                hour12: false
            };
            const localTime = date.toLocaleString('ko-KR', options);

            const commentWrap = document.createElement('span');
            commentWrap.classList.add('commentWrap');

            commentWrap.innerHTML = `
            <span class="commentAuthor">${reversedPosts[i].writer}</span>
            <span class="commentDate">${localTime}</span>
            <span class="commentContent">${reversedPosts[i].content}</span>
            <span class="commentDelete" id=del${i} onclick="deleteComment(${reversedPosts[i].id})">삭제</span>
            `;

            contentFrame.appendChild(commentWrap);

            const del = document.getElementById("del" + i);
            if (reversedPosts[i].username == decryptSessionID(document.cookie)) {
                del.style.display = 'block';
            }
            else {
                del.style.display = 'none';
            }
        }
        else break;
    }

}

function decryptSessionID(encryptedSessionID) {
    const encryptedString = encryptedSessionID.replace('sessionID=', '');
    const base64Decoded = atob(encryptedString);
    const decoder = new TextDecoder('utf-8');
    const decryptedSessionID = decoder.decode(new Uint8Array([...base64Decoded].map((c) => c.charCodeAt(0))));

    return decryptedSessionID;
}

// 현재 날짜 문자열 반환 함수
function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let hour = ("" + today.getHours()).slice(-2);
    let min = ("" + today.getMinutes()).slice(-2);
    let sec = ("0" + today.getSeconds()).slice(-2);
    let currentDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

    return currentDate;
}

function updateTextLength() {
    var textarea = document.getElementById('comment');
    var textLength = textarea.value.length;
    var maxLength = parseInt(document.getElementById('maxLength').innerText);
    var length = document.getElementById('textLength');

    length.innerText = textLength;

    if (textLength > maxLength) {
        textarea.value = textarea.value.substring(0, maxLength);
        length.style.color = 'red'; // 예를 들어, 초과한 글자 수를 강조하는 스타일을 추가
        length.innerText = maxLength;
    } else {
        length.style.color = ''; // 초과하지 않은 경우 스타일을 초기화
    }
}
function sendPost() {

    let temp = getSessionID();

    if (temp != "" && temp != null) {

        // 게시글 정보 가져오기
        //const postTitle = document.getElementById('post-title').value; 제목 필요없어짐
        const postAuthor = decryptSessionID(document.cookie);
        const postDate = getCurrentDate();
        const postContent = document.getElementById('comment').value;

        if (postContent != "") {
            // 서버로 데이터 전송 (예시: Fetch API 사용)
            fetch('/savePost', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "writer=" + encodeURIComponent(postAuthor) +
                    "&writetime=" + encodeURIComponent(postDate) +
                    "&content=" + encodeURIComponent(postContent)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    postContent.innerText = "";
                    window.location.reload();
                    // 서버 응답 처리
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // 에러 처리
                });
        }
        else {
            alert("입력된 내용이 없습니다!")
        }
    }
    else {
        alert("로그인 후 사용하실 수 있습니다");
        window.parent.location.href = "../html/login.html";
    }
}

function deleteComment(commentID) {

    if (confirm("댓글을 삭제하시겠습니까?")) {
        fetch('/removePost', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "id=" + encodeURIComponent(commentID)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                window.location.reload();
                // 서버 응답 처리
            })
            .catch((error) => {
                console.error('Error:', error);
                // 에러 처리
            });
    }
}

function getSessionID() {
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

// 페이지 로드 시 게시판 초기화
window.onload = function () {
    initializeBoard();
};