'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import {
	DialogContent,
	DialogHeader,
	DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function DialogAuthComponent() {
	return (
		<>
			<DialogContent className='bg-[#1c1c21] rounded-2xl max-w-[45%] min-w-[10%] w-full h-auto'>
				<DialogHeader>
					<Tabs defaultValue='login' className='w-full'>
						<TabsList className='mx-auto mt-5'>
							<TabsTrigger
								value='login'
								className='text-stone-100 text-[24px] font-bold px-6 py-2'
							>
								ВХОД
							</TabsTrigger>
							<TabsTrigger
								value='register'
								className='text-stone-100 text-[24px] font-bold px-6 py-2'
							>
								РЕГИСТРАЦИЯ
							</TabsTrigger>
						</TabsList>
						<TabsContent value='login'>
							<Input
								type='email'
								placeholder='Email'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
							/>
							<Input
								type='password'
								placeholder='Password'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
							/>
							<button className='log_reg_button'>Войти</button>
						</TabsContent>
						<TabsContent value='register'>
							<Input
								type='text'
								placeholder='Имя'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
							/>
							<Input
								type='email'
								placeholder='Email'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
							/>
							<Input
								type='password'
								placeholder='Password'
								className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[75%] h-14'
							/>
							<button className='log_reg_button'>Зарегистрироваться</button>
						</TabsContent>
					</Tabs>
					<DialogDescription className='text-center mt-4 mb-4'>
						ИЛИ
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</>
	)
}
