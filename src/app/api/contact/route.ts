import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 管理者宛てのメール送信
    await resend.emails.send({
      from: 'マイリー家計簿 <noreply@myly-kakeibo.com>',
      to: process.env.ADMIN_EMAIL || '',
      subject: `【お問い合わせ】${subject}`,
      text: `
お名前: ${name}
メールアドレス: ${email}
件名: ${subject}
メッセージ:
${message}
      `,
    });

    // 自動返信メール送信
    await resend.emails.send({
      from: 'マイリー家計簿 <noreply@myly-kakeibo.com>',
      to: email,
      subject: '【自動返信】お問い合わせありがとうございます',
      text: `
${name} 様

お問い合わせありがとうございます。
以下の内容で承りました。

件名: ${subject}
メッセージ:
${message}

内容を確認次第、担当者より折り返しご連絡いたします。
なお、このメールは自動送信されています。

--
マイリー家計簿
      `,
    });

    return NextResponse.json(
      { message: 'お問い合わせを受け付けました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('お問い合わせ送信エラー:', error);
    return NextResponse.json(
      { message: '送信に失敗しました' },
      { status: 500 }
    );
  }
} 