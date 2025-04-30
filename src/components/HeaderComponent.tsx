'use client'

import { useRouter } from 'next/navigation'
import IconWithAnimation from '@/components/IconWithAnimation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import DialogAuthComponent from './DialogAuthComponent'
import { useAuth } from '@/contexts/AuthContext'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Cookies from 'js-cookie'


export default function HeaderComponent() {
  const { user } = useAuth()
	const router = useRouter()

    return (
			<header className='flex items-center mx-[325px] mt-9 h-20 rounded-4xl sm:px-6 lg:px-8 py-4 bg-[#1c1c21]'>
				<button onClick={() => router.push('/')} className='focus:outline-none'>
					<IconWithAnimation />
				</button>
				<div className='ml-auto'>
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className='cursor-pointer w-12 h-12 bg-[#2B2B30] hover:bg-[#3B3B40] transition-colors duration-300 rounded-full flex items-center justify-center'>
									<AvatarImage src={user.profile_pic} alt={user.nickname} />
									<AvatarFallback>{user.nickname[0]}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-48'>
								<DropdownMenuItem onClick={() => router.push('/profile')}>
									Профиль
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										Cookies.remove('access_token')
										Cookies.remove('refresh_token')
										console.log('Выход')
										window.location.reload()
									}}
								>
									Выйти
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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