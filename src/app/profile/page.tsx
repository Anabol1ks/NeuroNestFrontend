'use client'

import { useState, useEffect, ChangeEvent } from 'react'
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
import { updateProfile, uploadAvatar } from '@/lib/api'
import Cookies from 'js-cookie';
import { Pencil, Trash2 } from 'lucide-react'
import AvatarDialogComponent from '@/components/AvatarDialogComponent'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import AvatarDelComponent from '@/components/AvatarDelComponent'
import TokenRefresherComponent from '@/components/TokenRefreshComponent'

export default function Profile() {
	const { user } = useAuth()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [nickname, setNickname] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [isEmailFocused, setIsEmailFocused] = useState(false)
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)


	useEffect(() => {
		if (user) {
			setNickname(user.nickname || '')
			// setEmail(user.email || '')
			setFirstName(user.first_name || '')
			setLastName(user.last_name || '')
			setAvatarUrl(user.profile_pic || null)
		}
	}, [user])

	// Функция для обрезки email
	const getShortEmail = (email: string) => {
		const [localPart, domain] = email.split('@')
		if (localPart.length <= 3) return email // слишком короткий — не обрезаем
		const maskedPart = '.'.repeat(localPart.length - 3) // заменяем остальные символы на точки
		return `${localPart[0]}${maskedPart}${localPart.slice(-2)}@${domain}`
	}

	const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

	const token = Cookies.get('access_token')

	const setUpdateFirstName = (first_name: string) => {
		setFirstName(first_name);
	}

	const handlerUpdate  = async () => {
		setLoading(true);
		setError('');
		const updatedData: {
			nickname?: string
			first_name?: string
			last_name?: string
		} = {}
		if (nickname !== user.nickname) updatedData.nickname = nickname.trim()
		if (first_name !== user.first_name)
			updatedData.first_name = first_name.trim()
		if (last_name !== user.last_name) updatedData.last_name = last_name.trim()
		console.log('Отправляемые данные:', updatedData)

		try {
			await updateProfile(token!, updatedData)
		} catch (e: any) {
			setError(e.message);
			console.error('Ошибка обновления профиля:', e)
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<TokenRefresherComponent/>
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
							<AvatarImage
								src={avatarUrl || user.profile_pic}
								alt={user.nickname}
							/>
							<AvatarFallback>{user.nickname[0]}</AvatarFallback>
						</Avatar>
						<div className='mt-[2%] flex items-center justify-center gap-x-2.5'>
							<Dialog>
								<DialogTrigger asChild>
									<button className='inline-flex w-fit'>
										<Pencil color='#8c8b8d' size={28} />
									</button>
								</DialogTrigger>
								<AvatarDialogComponent onAvatarUpdate={setAvatarUrl} />
							</Dialog>
							<Dialog
								open={isDeleteDialogOpen}
								onOpenChange={setIsDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<button className='inline-flex w-fit'>
										<Trash2 color='#8c8b8d' size={28} />
									</button>
								</DialogTrigger>
								<AvatarDelComponent
									onAvatarUpdate={setAvatarUrl}
									onCloseDialog={() => setIsDeleteDialogOpen(false)}
								/>
							</Dialog>
						</div>
						<div className='mt-8 flex flex-col gap-6'>
							{/* Никнейм на отдельной строке */}
							<div className='flex flex-col items-center'>
								<p className='text-lg mb-2 text-stone-50'>Никнейм</p>
								<Input
									type='text'
									value={nickname}
									onChange={e => setNickname(e.target.value)}
									className='text-amber-50 font-black text-[18px] w-3/4 md:w-1/2'
								/>
							</div>

							{/* Имя и Фамилия на одной строке */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<p className='text-lg mb-2 text-stone-50'>Имя</p>
									<Input
										type='text'
										value={first_name}
										onChange={e => setUpdateFirstName(e.target.value)}
										className='text-amber-50 font-black text-[18px] w-full'
									/>
								</div>
								<div>
									<p className='text-lg mb-2 text-stone-50'>Фамилия</p>
									<Input
										type='text'
										value={last_name}
										onChange={e => setLastName(e.target.value)}
										className='text-amber-50 font-black text-[18px] w-full'
									/>
								</div>
							</div>
						</div>

						<div className='mt-6'>
							<p className='text-lg mb-2 text-stone-50'>Почта</p>
							<div className='text-amber-50 font-black text-[18px] bg-[#18181c] border border-[#2B2B30] rounded-md px-3 py-2 cursor-not-allowed'>
								{getShortEmail(user.email)}
							</div>
						</div>
					</CardContent>
					<CardFooter>
						{error && <p className='text-red-500 mt-2'>{error}</p>}
						<button
							className='log_reg_button'
							onClick={handlerUpdate}
							disabled={loading}
						>
							{loading ? 'Сохранение...' : 'Сохранить'}
						</button>
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
