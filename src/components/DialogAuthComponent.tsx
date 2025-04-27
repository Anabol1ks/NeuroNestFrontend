'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
  DialogContent,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { loginUser, registerUser, TokenResponse } from '@/lib/api';

export default function DialogAuthComponent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data: TokenResponse = await loginUser({ email, password });
      Cookies.set('access_token', data.access_token);
      Cookies.set('refresh_token', data.refresh_token);

			window.location.reload()
      router.push('/');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await registerUser({ email, password, nickname });
      // Optionally auto-login after register
      await handleLogin();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
	return (
		<>
			<DialogContent className='bg-[#1c1c21] rounded-2xl max-w-[45%] min-w-[10%] w-full h-auto'>
				<DialogHeader>
					<Tabs
						value={activeTab}
						onValueChange={v => {
							setActiveTab(v as 'login' | 'register')
							setError('') 
						}}
						className='w-full'
					>
						<TabsList className='mx-auto mt-5'>
							<TabsTrigger value='login'>ВХОД</TabsTrigger>
							<TabsTrigger value='register'>РЕГИСТРАЦИЯ</TabsTrigger>
						</TabsList>
						<TabsContent value='login'>
							<Input
								type='email'
								placeholder='Email'
								value={email}
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
								onChange={e => setEmail(e.target.value)}
							/>
							<Input
								type='password'
								placeholder='Password'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{error && <p className='text-red-500 mt-2'>{error}</p>}
							<button
								className='log_reg_button'
								onClick={handleLogin}
								disabled={loading}
							>
								{loading ? 'Загрузка...' : 'Войти'}
							</button>
						</TabsContent>
						<TabsContent value='register'>
							<Input
								type='text'
								placeholder='Имя'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
								value={nickname}
								onChange={e => setNickname(e.target.value)}
							/>
							<Input
								type='email'
								placeholder='Email'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<Input
								type='password'
								placeholder='Password'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{error && <p className='text-red-500 mt-2'>{error}</p>}
							<button
								className='log_reg_button mt-4'
								onClick={handleRegister}
								disabled={loading}
							>
								{loading ? 'Загрузка...' : 'Зарегистрироваться'}
							</button>
						</TabsContent>
					</Tabs>
					<DialogDescription className='text-center mt-4 mb-4'>
						ИЛИ
					</DialogDescription>
					<button
						className='yandex_auth_button'
						onClick={() =>
							(window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/yandex/login`)
						}
					>
						Войти через Яндекс
					</button>
				</DialogHeader>
			</DialogContent>
		</>
	)
}
