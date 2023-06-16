// 서버에 워드클라우드 데이터 요청
fetch('/wordcloud')
  .then((response) => {
    if (!response.ok) {
      throw new Error('워드클라우드 데이터 요청 실패');
    }
    return response.json();
  })
  .then((data) => {
    // 워드클라우드 생성
    createWordCloud(data.wordCounts);
  })
  .catch((error) => {
    // 에러 발생 시 처리할 내용을 작성하세요.
    console.error('워드클라우드 데이터 요청 에러', error);
  });

// 워드클라우드 생성 함수
function createWordCloud(wordCounts) {
  // 빈도수가 n회 이상인 단어 필터링
  const filteredWordCounts = Object.entries(wordCounts).filter(([word, count]) => count >= 1);

  // 빈도수 기준 내림차순으로 정렬
  const sortedWordCounts = filteredWordCounts.sort((a, b) => b[1] - a[1]);

  // 상위 50개 키워드 추출
  const topKeywords = sortedWordCounts.slice(0, 50);

  const chatstat = document.getElementById("chatStat");

  // 워드클라우드 생성 옵션 설정
  const options = {
    list: topKeywords,
    gridSize: 20,
    weightFactor: 10,
    fontFamily: 'omyu_pretty',
    backgroundColor: 'skyblue',
    color: 'black',
    rotateRatio: 0,
    shuffle: true,
    shape: 'circle',
    drawOutOfBound: false,
    origin: [(chatstat.offsetWidth/2), (chatstat.offsetHeight/2.2)]
  };
  // 워드클라우드 생성
  WordCloud(document.getElementById('chatStat'), options);
  setTimeout(() => {
    let cloud = document.getElementById("chatStat");
    let spanElements = cloud.getElementsByTagName("span");
    for (let i = 0; i < spanElements.length; i++) {

      let spanElement = spanElements[i];
      spanElement.style.borderRadius = '15px';
      spanElement.style.paddingLeft = '0.25em';
      spanElement.style.paddingRight = '0.25em';
      spanElement.style.backgroundColor = 'RGB('
        + (Math.floor(Math.random() * 255)+100) + ','
        + (Math.floor(Math.random() * 255)+100) + ','
        + (Math.floor(Math.random() * 255)+100) + ')';
    }cloud.innerHTML += "<span class='label'>가장 많이 오갔던 대화는?</span>"
  }, 300);
  
}

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
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderColor: 'rgba(255, 255, 255, 1)',
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