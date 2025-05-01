import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // 30秒かけて20ユーザーまで増加
    { duration: '1m', target: 20 },  // 1分間20ユーザーを維持
    { duration: '30s', target: 0 },  // 30秒かけて0ユーザーまで減少
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%のリクエストが500ms以内に完了
    http_req_failed: ['rate<0.01'],   // エラー率が1%未満
  },
};

export default function () {
  const res = http.get(__ENV.TARGET_URL || 'https://your-production-url.vercel.app');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
} 