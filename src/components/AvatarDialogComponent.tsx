import {
	DialogContent,
	DialogHeader,
	DialogDescription,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { uploadAvatar } from '@/lib/api'
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
		<DialogContent className='max-w-[50%] mx-auto max-h-[90%] min-h-[40%] bg-[#1C1C21] rounded-2xl'>
			<DialogHeader>
				<DialogDescription />

				<div className='mt-4 flex flex-col items-center'>
					<Label className='text-[#E6E8F2] text-2xl mb-4'>
						Загрузить аватарку
					</Label>

					{previewUrl && (
						<img
							src={previewUrl}
							alt='Preview'
							className='w-32 h-32 rounded-full object-cover border border-[#666] mb-4'
						/>
					)}
					<div
						onClick={openFileDialog}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						className='w-[60%] h-[40%] flex items-center justify-center text-center text-[#A1A1AA] border-2 border-dashed border-[#444] rounded-xl bg-[#2E2E38] hover:bg-[#3B3B47] cursor-pointer transition-colors mb-4'
					>
						{file ? (
							<span>{file.name}</span>
						) : (
							<span>Нажмите или перетащите файл сюда</span>
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
						className='log_reg_button mt-2'
						onClick={handleAvatarUpload}
						disabled={loading}
					>
						{loading ? 'Загрузка...' : 'Обновить аватарку'}
					</button>
				</div>
			</DialogHeader>
		</DialogContent>
	)
}
