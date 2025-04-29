import {
	DialogContent,
	DialogHeader,
	DialogDescription,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { uploadAvatar, deleteAvatar } from '@/lib/api'
import Cookies from 'js-cookie'
import { Label } from '@/components/ui/label'

interface AvatarDialogComponentProps {
	onAvatarUpdate?: (newUrl: string) => void
}

export default function AvatarDialogComponent({ onAvatarUpdate }: AvatarDialogComponentProps) {
	const { user } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const token = Cookies.get('access_token')

	const handleFile = (selectedFile: File) => {
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
		if (!allowedTypes.includes(selectedFile.type)) {
			setError('Только PNG и JPEG/JPG файлы разрешены.')
			return
		}

		const maxSize = 2 * 1024 * 1024
		if (selectedFile.size > maxSize) {
			setError('Максимальный размер файла — 2 МБ.')
			return
		}

		setFile(selectedFile)
		setPreviewUrl(URL.createObjectURL(selectedFile))
		setError('')
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0]
		if (selected) handleFile(selected)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0])
			e.dataTransfer.clearData()
		}
	}

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}

	const openFileDialog = () => {
		fileInputRef.current?.click()
	}

	const handleAvatarUpload = async () => {
		if (!file) {
			alert('Пожалуйста, выберите файл для загрузки.')
			return
		}

		try {
			setLoading(true)
			const updatedAvatarUrl = await uploadAvatar(token!, file)
			if (user) user.profile_pic = updatedAvatarUrl

      onAvatarUpdate?.(updatedAvatarUrl);
  
			setFile(null)
			setPreviewUrl(null)
		} catch (error: any) {
			console.error('Ошибка загрузки аватарки:', error.message)
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
						Загрузить аватарку
					</Label>

					{previewUrl && (
						<img
							src={previewUrl}
							alt='Preview'
							className='w-24 h-24 rounded-full object-cover border border-[#666] mb-4'
						/>
					)}
					<div
						onClick={openFileDialog}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						className='w-full max-w-xs min-h-[80px] px-4 py-3 flex items-center justify-center text-center text-[#A1A1AA] border-2 border-dashed border-[#444] rounded-xl bg-[#2E2E38] hover:bg-[#3B3B47] cursor-pointer transition-colors mb-4'
					>
						{file ? (
							<span className='break-all text-sm'>{file.name}</span>
						) : (
							<span className='text-sm'>Нажмите или перетащите файл сюда</span>
						)}
					</div>

					<input
						ref={fileInputRef}
						type='file'
						accept='image/png,image/jpeg,image/jpg'
						onChange={handleFileChange}
						className='hidden'
					/>
					{error && <p className='text-sm text-red-500 mb-2'>{error}</p>}
					<button
						className={`log_reg_button mx-auto ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						onClick={handleAvatarUpload}
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
								Загрузка...
							</span>
						) : (
							'Обновить аватарку'
						)}
					</button>
				</div>
			</DialogHeader>
		</DialogContent>
	)
}
