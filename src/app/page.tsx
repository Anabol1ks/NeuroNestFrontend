'use client'

import Image from "next/image";
import { Unbounded } from 'next/font/google'
import icon48 from '@/public/NeuroNest48.svg'
import IconWithAnimation from '@/components/IconWithAnimation'
import HeaderComponent from '@/components/HeaderComponent'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import TokenRefresherComponent from '@/components/TokenRefreshComponent'
import { getNotes, NotesResponse } from '@/lib/api'
import Cookies from 'js-cookie';
import NotesComponent from '@/components/NotesComponent'

export default function Home() {
  return (
		<>
			<TokenRefresherComponent />
			<HeaderComponent />
			<NotesComponent/>
			{/* <Dialog>
				<DialogTrigger asChild>
					<button className='text-amber-50 bg-red-500'>Создать заметку</button>
				</DialogTrigger>
			</Dialog> */}
		</>
	)
}
