'use client'

import { useState, useEffect } from 'react'
import HeaderComponent from '@/components/HeaderComponent'
import { useAuth } from '@/contexts/AuthContext'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

export default function Profile() {
	const { user } = useAuth()

	const [nickname, setNickname] = useState('')
	const [email, setEmail] = useState('')
	const [isEmailFocused, setIsEmailFocused] = useState(false)

	useEffect(() => {
		if (user) {
			setNickname(user.nickname || '')
			setEmail(user.email || '')
		}
	}, [user])

	// Функция для обрезки email
	const getShortEmail = (email: string) => {
		const [localPart, domain] = email.split('@')
		if (localPart.length <= 5) return email // слишком короткий — не обрезаем
		return `${localPart.slice(0, 3)}.............${localPart.slice(-1)}@${domain}`
	}

	return (
		<>
			<HeaderComponent />
			{user ? (
				<Card className='mt-6 mx-auto max-w-2xl'>
					<CardHeader>
						<CardTitle className='mx-auto text-6xl'>ВАШ ПРОФИЛЬ</CardTitle>
						<CardDescription className='mx-auto'>
							ИНФОРМАЦИЯ О ВАШЕМ ПРОФИЛЕ
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Avatar className='w-[30%] h-[30%] mx-auto bg-[#2B2B30] rounded-full flex items-center justify-center'>
							<AvatarImage src={user.profile_pic} alt={user.nickname} />
							<AvatarFallback>{user.nickname[0]}</AvatarFallback>
						</Avatar>

						<div className='mt-8'>
							<p className='text-lg mb-2'>Никнейм</p>
							<Input
								type='text'
								value={nickname}
								onChange={e => setNickname(e.target.value)}
								className='text-amber-50 font-black text-[18px]'
							/>
						</div>

						<div className='mt-6'>
							<p className='text-lg mb-2'>Почта</p>
							<Input
								type='email'
								value={isEmailFocused ? email : getShortEmail(email)}
								onFocus={() => setIsEmailFocused(true)}
								onBlur={() => setIsEmailFocused(false)}
								onChange={e => setEmail(e.target.value)}
								className='text-amber-50 font-black text-[18px]'
							/>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-center w-full text-muted-foreground'>
							Здесь будет кнопка сохранения
						</p>
					</CardFooter>
				</Card>
			) : (
				<div className='text-center mt-10 text-2xl font-bold'>
					ВЫ НЕ АВТОРИЗОВАНЫ
				</div>
			)}
		</>
	)
}
