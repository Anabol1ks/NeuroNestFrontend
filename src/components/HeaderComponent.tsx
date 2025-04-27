'use client'

import { useRouter } from 'next/navigation'
import IconWithAnimation from '@/components/IconWithAnimation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import DialogAuthComponent from './DialogAuthComponent'
import { useAuth } from '@/contexts/AuthContext'

export default function HeaderComponent() {
  const { user } = useAuth()
	const router = useRouter()

    return (
			<header className='flex items-center mx-[325px] mt-9 h-20 rounded-4xl sm:px-6 lg:px-8 py-4 bg-[#1c1c21]'>
				<IconWithAnimation />
				<div className='ml-auto'>
					{user ? (
						<Avatar
							className='cursor-pointer w-12 h-12 bg-[#2B2B30] hover:bg-[#3B3B40] transition-colors duration-300 rounded-full flex items-center justify-center'
							onClick={() => router.push('/profile')}
						>
							<AvatarImage src={user.profile_pic} alt={user.nickname} />
							<AvatarFallback>{user.nickname[0]}</AvatarFallback>
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