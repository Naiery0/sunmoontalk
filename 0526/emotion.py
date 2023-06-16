import sys
import json
import mysql.connector
from transformers import BertTokenizer, BertForSequenceClassification
import torch

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

# 감정 분석을 위한 koBERT 모델과 토크나이저 로드
model = BertForSequenceClassification.from_pretrained('beomi/kcbert-base')
tokenizer = BertTokenizer.from_pretrained('beomi/kcbert-base')

# 채팅로그의 메시지를 감정 분석하고 통계 생성
def analyze_chat_logs(chat_logs):
    emotions = {'0': 'Neutral', '1': 'Anger', '2': 'Disgust', '3': 'Fear', '4': 'Happiness', '5': 'Sadness', '6': 'Surprise'}
    emotion_counts = {'Neutral': 0, 'Anger': 0, 'Disgust': 0, 'Fear': 0, 'Happiness': 0, 'Sadness': 0, 'Surprise': 0}
    
    for log in chat_logs:
        message = log['message']
        
        # 텍스트를 토큰화하고 입력 형식에 맞게 변환
        inputs = tokenizer(message, return_tensors='pt', padding=True, truncation=True)
        
        # 모델에 입력 전달하여 감정 예측
        outputs = model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=1)
        
        # 감정별 카운트 증가
        for pred in predictions:
            emotion = emotions[str(pred.item())]
            emotion_counts[emotion] += 1
    
    return emotion_counts

# 채팅로그 데이터 가져오기
chat_logs = fetch_chat_logs()

# 감정 분석 및 통계 생성
emotion_counts = analyze_chat_logs(chat_logs)

# 결과를 JSON 형식으로 변환하여 출력
result_json = json.dumps(emotion_counts, ensure_ascii=False)
print(result_json)

# 결과를 stderr로 전달
sys.stderr.write(result_json)
