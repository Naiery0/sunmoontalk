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

      // 상위 30개 키워드 추출
      const topKeywords = sortedWordCounts.slice(0, 30);

      // 워드클라우드 생성 옵션 설정
      const options = {
        list: topKeywords,
        gridSize: 20,
        weightFactor: 17,
        fontFamily: 'omyu_pretty', 
        color: 'random-dark',
        rotateRatio: 0,
        backgroundColor: '#fff',
        shuffle: true,
        shape: 'square',
        drawOutOfBound: false,
        origin: [570, 330]
      };

      // 워드클라우드 생성
      WordCloud(document.getElementById('wordcloud'), options);
    }