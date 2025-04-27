'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setError('Не удалось получить токены авторизации.');
      return;
    }

    Cookies.set('access_token', accessToken);
    Cookies.set('refresh_token', refreshToken)

    router.replace('/');
  }, [params, router]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Ошибка авторизации: {error}
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      Авторизация через Яндекс...<br />
      Пожалуйста, подождите.
    </div>
  );
}
