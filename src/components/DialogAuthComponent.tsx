import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DialogAuthComponent() {
	return (
		<DialogContent className='bg-[#1c1c21] rounded-2xl max-w-[60%] min-w-[60%] w-full h-auto'>
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
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[70%] h-14'
						/>
						<Input
							type='password'
							placeholder='Password'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[70%] h-14'
						/>
					</TabsContent>
					<TabsContent value='register'>
						<Input
							type='text'
							placeholder='Имя'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[70%] h-14'
						/>
						<Input
							type='email'
							placeholder='Email'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[70%] h-14'
						/>
						<Input
							type='password'
							placeholder='Password'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full max-w-[70%] h-14'
						/>
					</TabsContent>
				</Tabs>
				<DialogDescription></DialogDescription>
			</DialogHeader>
		</DialogContent>
	)
}