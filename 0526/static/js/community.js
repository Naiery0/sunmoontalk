// 글 목록을 가져오는 함수
function getPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>글쓴이: ${post.author}</p>
                    <p>등록일: ${post.date}</p>
                    <p>조회수: ${post.views}</p>
                    <p>추천수: ${post.likes}</p>
                `;
                postList.appendChild(postItem);
            });
        });
}

// 글 추가 함수
function addPostToBoard(post) {
    const contentFrame = document.querySelector('.ContentFrame');

    const row = document.createElement('tr');
    row.classList.add('ContentRow');

    row.innerHTML = `
        <td class="Content Index">${post.index}</td>
        <td class="Content Title">${post.title}</td>
        <td class="Content Writer">${post.author}</td>
        <td class="Content Date">${post.date}</td>
        <td class="Content Hits">${post.views}</td>
        <td class="Content Recommend">${post.likes}</td>
    `;

    contentFrame.appendChild(row);
}

// 페이지 로드 시 글 목록 가져오기
window.onload = function() {
    getPosts().then(posts => {
        posts.forEach(post => {
            addPostToBoard(post);
        });
    });

    const createPostForm = document.getElementById('create-post-form');
    createPostForm.addEventListener('submit', createPost);
};
