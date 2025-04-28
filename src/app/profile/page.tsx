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
import { Label } from '@/components/ui/label'

export default function Profile() {
	const { user } = useAuth()

	const [nickname, setNickname] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [isEmailFocused, setIsEmailFocused] = useState(false)

	useEffect(() => {
		if (user) {
			setNickname(user.nickname || '')
			// setEmail(user.email || '')
			setFirstName(user.first_name || '')
			setLastName(user.last_name || '')
		}
	}, [user])

	// Функция для обрезки email
	const getShortEmail = (email: string) => {
		const [localPart, domain] = email.split('@')
		if (localPart.length <= 5) return email // слишком короткий — не обрезаем
		return `${localPart.slice(0, 3)}.............${localPart.slice(-1)}@${domain}`
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

	const [file, setFile] = useState<File | null>(null)
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setError('')
		const selectedFile = e.target.files?.[0]
		if (!selectedFile) return

		// Проверяем MIME-тип
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
		if (!allowedTypes.includes(selectedFile.type)) {
			setError('Только PNG и JPEG/JPG файлы разрешены.')
			return
		}

		// Проверяем размер файла
		const maxSize = 2 * 1024 * 1024 // 2 MB
		if (selectedFile.size > maxSize) {
			setError('Максимальный размер файла — 2 МБ.')
			return
		}

		setFile(selectedFile) // Сохраняем файл в состояние
	}

	const handleAvatarUpload = async () => {
		if (!file) {
			alert('Пожалуйста, выберите файл для загрузки.')
			return
		}

		try {
			setLoading(true)
			const updatedAvatarUrl = await uploadAvatar(token!, file) // Загружаем аватарку
			if (user) user.profile_pic = updatedAvatarUrl
			setFile(null) // Сбрасываем выбранный файл
		} catch (error: any) {
			console.error('Ошибка загрузки аватарки:', error.message)
		} finally {
			setLoading(false)
		}
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
						<div className='mt-4'>
							<Label htmlFor='avatar'>Загрузить аватарку</Label>
							<Input
								id='avatar'
								type='file'
								accept='image/png,image/jpeg,image/jpg'
								onChange={handleFileChange}
							/>
							{error && <p className='text-sm text-red-600'>{error}</p>}
						</div>

						<button
							className='log_reg_button mt-4'
							onClick={handleAvatarUpload}
							disabled={loading}
						>
							{loading ? 'Загрузка...' : 'Обновить аватарку'}
						</button>

						<div className='mt-8'>
							<p className='text-lg mb-2'>Никнейм</p>
							<Input
								type='text'
								value={nickname}
								onChange={e => setNickname(e.target.value)}
								className='text-amber-50 font-black text-[18px]'
							/>
						</div>
						<div className='mt-8'>
							<p className='text-lg mb-2'>Имя</p>
							<Input
								type='text'
								value={first_name}
								onChange={e => setUpdateFirstName(e.target.value)}
								className='text-amber-50 font-black text-[18px]'
							/>
						</div>
						<div className='mt-8'>
							<p className='text-lg mb-2'>Фамилия</p>
							<Input
								type='text'
								value={last_name}
								onChange={e => setLastName(e.target.value)}
								className='text-amber-50 font-black text-[18px]'
							/>
						</div>

						<div className='mt-6'>
							<p className='text-lg mb-2'>Почта</p>
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
