import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('Auth error:', error, error_description);
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=${encodeURIComponent(error_description || 'Authentication failed')}`
    );
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent('Failed to complete authentication')}`
      );
    }
  }

  return NextResponse.redirect(requestUrl.origin);
} 