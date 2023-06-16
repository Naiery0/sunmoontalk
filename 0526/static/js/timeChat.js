fetch('/chattime')
    .then((response) => {
        if (!response.ok) {
            throw new Error('이모션 데이터 요청 실패');
        }
        return response.json();
    })
    .then((data) => {
        //그래프 생성
        console.log(data.timeCounts);
        createTimeGraph(data.timeCounts);
    })
    .catch((error) => {
        // 에러 발생 시 처리할 내용을 작성하세요.
        console.error('이모션 데이터 요청 에러', error);
    });


function createTimeGraph(timeCounts) {
    // 막대 그래프 생성
    const ctx = document.getElementById('timeChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(timeCounts),
            datasets: [{
                label: '시간대별 채팅 그래프',
                data: Object.values(timeCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}