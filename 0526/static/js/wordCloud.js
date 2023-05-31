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
      // 워드클라우드 생성 옵션 설정
      const options = {
        list: Object.entries(wordCounts),
        gridSize: 10,
        weightFactor: 5,
       //fontFamily: 'Arial', 폰트 직접 이 파일에서 적용하는게 빠를 듯
        color: 'random-dark',
        rotateRatio: 0.5,
        backgroundColor: '#fff',
        shuffle: true,
        shape: 'square',
        drawOutOfBound: false,
        origin: [400, 250]
      };

      // 워드클라우드 생성
      WordCloud(document.getElementById('wordcloud'), options);
    }