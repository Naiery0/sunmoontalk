import mysql.connector
from konlpy.tag import Hannanum
import json
import sys
import io
import re

# UTF-8 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# MySQL 연결 설정
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='123456',
    database='chatlogs'
)

# 채팅 로그 데이터를 DB에서 가져오는 작업
def fetch_chat_logs():
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT message FROM chatlogs')
    results = cursor.fetchall()
    cursor.close()
    # 빈 메시지 필터링
    chat_logs = [result for result in results if result['message'].strip() != '']
    return chat_logs

# 단어 빈도수 계산 작업
def calculate_word_counts(messages):
    word_counts = {}

    hannanum = Hannanum()
    
    for message in messages:
        words = hannanum.nouns(message['message'])
        for word in words:
            if len(re.sub('[^가-힣]', '', word)) > 0:  # 자음 또는 모음만 있는 경우 제외
                if word in word_counts:
                    word_counts[word] += 1
                else:
                    word_counts[word] = 1
    
    return word_counts

# 워드클라우드 데이터 처리 함수
def process_wordcloud_data():
    chat_logs = fetch_chat_logs()
    word_counts = calculate_word_counts(chat_logs)
    return word_counts

# 메인 함수
if __name__ == '__main__':
    wordcloud_data = process_wordcloud_data()
    json_data = json.dumps(wordcloud_data, ensure_ascii=False)
    print(json_data)
