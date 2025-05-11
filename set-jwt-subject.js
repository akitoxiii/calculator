require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CLERK_API_KEY = process.env.CLERK_API_KEY;
const TEMPLATE_ID = 'jtmp_2wnqEa1bapaIJbylicV3qGr9xdH';

const claims = {
  "aud": "authenticated",
  "role": "authenticated",
  "email": "{{user.primary_email_address}}",
  "app_metadata": {},
  "userMetadata": "{{user.public_metadata}}",
  "customSubject": "{{user.id}}",
  "user_metadata": {}
};

async function updateJWTTemplate() {
  const url = `https://api.clerk.com/v1/jwt_templates/${TEMPLATE_ID}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${CLERK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: TEMPLATE_ID,
      claims,
      subject_template: '{{user.id}}'
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update JWT template: ${error}`);
  }

  console.log('JWTテンプレートのsubjectTemplateを{{user.id}}に更新しました');
}

async function listJWTTemplates() {
  const url = `https://api.clerk.com/v1/jwt_templates`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CLERK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();
  console.log(data);
}

updateJWTTemplate().catch(console.error);
listJWTTemplates().catch(console.error);