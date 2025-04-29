import {
	DialogContent,
	DialogHeader,
	DialogDescription,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { deleteAvatar } from '@/lib/api'
import Cookies from 'js-cookie'
import { Label } from '@/components/ui/label'

interface AvatarDialogComponentProps {
	onAvatarUpdate?: (newUrl: string) => void
	onCloseDialog?: () => void
}


export default function AvatarDelComponent({ onAvatarUpdate, onCloseDialog }: AvatarDialogComponentProps) {
	const { user } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const token = Cookies.get('access_token')

	const handleAvatarDelete = async () => {
		try {
			setLoading(true)
			await deleteAvatar(token!)
      if (user) user.profile_pic = ""
      onAvatarUpdate?.('')
			onCloseDialog?.()
		} catch (error: any) {
			console.error('Ошибка удаления аватарки:', error.message)
		} finally {
			setLoading(false)
		}
	}
	return (
		<DialogContent className='w-full max-w-md mx-auto bg-[#1C1C21] rounded-2xl overflow-hidden'>
			<DialogHeader>
				<DialogDescription />
				<div className='mt-4 flex flex-col items-center'>
					<Label className='text-[#E6E8F2] text-2xl mb-8'>
						Вы уверены что хотите удалить аватарку?
					</Label>
					<button
						className={`red_button mx-auto ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						onClick={handleAvatarDelete}
						disabled={loading}
					>
						{loading ? (
							<span className='flex items-center'>
								<svg
									className='animate-spin h-5 w-5 mr-2 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
									></path>
								</svg>
								УДАЛЕНИЕ...
							</span>
						) : (
							'УДАЛИТЬ'
						)}
					</button>
				</div>
			</DialogHeader>
		</DialogContent>
	)
}
