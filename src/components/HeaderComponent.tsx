import Image from 'next/image'
import { Unbounded } from 'next/font/google'
import icon48 from '@/public/NeuroNest48.svg'
import IconWithAnimation from '@/components/IconWithAnimation'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import DialogAuthComponent from './DialogAuthComponent'

const unbounded = Unbounded({ subsets: ['latin'] })

export default function HeaderComponent() {
	return (
		<>
			<header>
				<IconWithAnimation />
				<Dialog>
					<DialogTrigger asChild>
						<button className='auth_button'>Войти</button>
					</DialogTrigger>
					<DialogAuthComponent />
				</Dialog>
			</header>
		</>
	)
}
