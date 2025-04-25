import Image from "next/image";
import { Unbounded } from 'next/font/google'
import icon48 from '@/public/NeuroNest48.svg'
import IconWithAnimation from '@/components/IconWithAnimation'

const unbounded = Unbounded({ subsets: ['latin'] });

export default function HeaderComponent() {
	return (
		<>
			<header>
				<IconWithAnimation />
				<button className='auth_button'>Войти</button>
			</header>
		</>
	)
}
