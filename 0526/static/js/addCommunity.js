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