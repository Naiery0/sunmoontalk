import mysql.connector
import json
import sys
import requests
from collections import defaultdict

# MySQL 연결 설정
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='123456',
    database='chatlogs'
)

# 시간별 채팅 분포 통계 생성
def generate_hourly_chat_stats():
    cursor = connection.cursor()
    cursor.execute('SELECT HOUR(sendtime) AS hour, COUNT(*) AS count FROM chatlogs GROUP BY HOUR(sendtime)')
    results = cursor.fetchall()
    cursor.close()

    stats = defaultdict(int)
    for hour, count in results:
        stats[str(hour)] = count

    return stats

def format_hourly_stats(stats):
    formatted_stats = {}
    hour_ranges = [
        ('0~2', range(0, 3)),
        ('3~5', range(3, 6)),
        ('6~8', range(6, 9)),
        ('9~11', range(9, 12)),
        ('12~14', range(12, 15)),
        ('15~17', range(15, 18)),
        ('18~20', range(18, 21)),
        ('21~23', range(21, 24))
    ]

    for label, hour_range in hour_ranges:
        count = sum(stats[str(hour)] for hour in hour_range)
        formatted_stats[label] = count

    return formatted_stats

# 시간별 채팅 분포 통계 생성
chat_stat = generate_hourly_chat_stats()

chat_stats = format_hourly_stats(chat_stat)

# 결과를 JSON 형식으로 변환하여 출력
result_json = json.dumps(chat_stats, ensure_ascii=False)
print(result_json)

# 결과를 stderr로 전달
sys.stderr.write(result_json)