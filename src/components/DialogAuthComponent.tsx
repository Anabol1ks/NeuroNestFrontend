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
		<DialogContent className='bg-[#1c1c21] rounded-2xl w-[900px] h-[850px]'>
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
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] max-w-4/6 mx-auto mt-8 min-h-1/4'
						/>
						<Input
							type='password'
							placeholder='Password'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] max-w-4/6 mx-auto mt-8 min-h-1/4'
						/>
					</TabsContent>
					<TabsContent value='register'>
						<Input
							type='text'
							placeholder='Имя'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] max-w-4/6 mx-auto mt-8 min-h-1/4'
						/>
						<Input
							type='email'
							placeholder='Email'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] max-w-4/6 mx-auto mt-8 min-h-1/4'
						/>
						<Input
							type='password'
							placeholder='Password'
							className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] max-w-4/6 mx-auto mt-8 min-h-1/4'
						/>
					</TabsContent>
				</Tabs>
				<DialogDescription></DialogDescription>
			</DialogHeader>
		</DialogContent>
	)
}
