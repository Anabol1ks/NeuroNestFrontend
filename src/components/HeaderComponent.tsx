'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import IconWithAnimation from '@/components/IconWithAnimation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Cookies from 'js-cookie'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import DialogAuthComponent from './DialogAuthComponent'

export default function HeaderComponent() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const router = useRouter()

	useEffect(() => {
		// Проверяем наличие токенов в куки
		const accessToken = Cookies.get('access_token')
		const refreshToken = Cookies.get('refresh_token')
		setIsAuthenticated(!!accessToken && !!refreshToken)
	}, [])

	return (
		<header className='flex items-center mx-[325px] mt-9 h-20 rounded-4xl sm:px-6 lg:px-8 py-4 bg-[#1c1c21]'>
			<IconWithAnimation />
			<div className='ml-auto'>
				{isAuthenticated ? (
					<Avatar
						className='cursor-pointer w-12 h-12 bg-[#2B2B30] hover:bg-[#3B3B40] transition-colors duration-300 rounded-full flex items-center justify-center'
						onClick={() => router.push('/profile')}
					>
						<AvatarImage src='/path-to-user-avatar.jpg' alt='User Avatar' />
						<AvatarFallback className='text-stone-100 font-bold'>
							П
						</AvatarFallback>
					</Avatar>
				) : (
					<Dialog>
						<DialogTrigger asChild>
							<button className='auth_button'>Войти</button>
						</DialogTrigger>
						<DialogAuthComponent />
					</Dialog>
				)}
			</div>
		</header>
	)
}
