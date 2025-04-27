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


const unbounded = Unbounded({ subsets: ['latin'] });

export default function Home() {
  return (
		<>
			<HeaderComponent />
		</>
	)
}
