'use client'
import Cookies from 'js-cookie'
import { NoteInput } from '@/lib/api'
import { useState, useRef, ChangeEvent } from 'react'
import { createNote } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import {
	DialogContent,
	DialogHeader,
	DialogDescription,
	Dialog,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function CreateNoteComponent({
	onNoteCreated,
}: {
	onNoteCreated?: () => void
}) {
	const token = Cookies.get('access_token')
	const [note, setNote] = useState<NoteInput>({
		title: '',
		content: '',
		related_ids: [],
		tag_ids: [],
		attachments: [],
	})

	const [file, setFile] = useState<File[] | null>(null)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [open, setOpen] = useState(false)

	const handleCreateNote = async () => {
		try {
			if (!token) {
				console.error('No access token found')
				return
			}
			const noteWithAttachments: NoteInput = {
				...note,
				attachments: file || [],
			}

			console.log('Sending note data:', noteWithAttachments)
			console.log('tag_ids:', noteWithAttachments.tag_ids)
			console.log('related_ids:', noteWithAttachments.related_ids)

			await createNote(token, noteWithAttachments)
			// Reset form after successful creation
			setNote({
				title: '',
				content: '',
				related_ids: [],
				tag_ids: [],
				attachments: [],
			})
			setFile(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
			console.log('Note created successfully')

			// Close the dialog
			setOpen(false)

			// Notify parent component to refresh notes
			if (onNoteCreated) {
				onNoteCreated()
			}
		} catch (error) {
			console.error('Error creating note:', error)
		}
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setNote(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files)
			setFile(filesArray)
		}
	}

	// Handle tag input (comma-separated values)
	const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
		const tagInput = e.target.value
		// This is a simplified version - in a real app, you'd likely have a more sophisticated tag selection UI
		const tagIds = tagInput
			.split(',')
			.map(tag => parseInt(tag.trim()))
			.filter(id => !isNaN(id))

		setNote(prev => ({
			...prev,
			tag_ids: tagIds,
		}))
	}

	// Handle related notes input (comma-separated values)
	const handleRelatedInput = (e: ChangeEvent<HTMLInputElement>) => {
		const relatedInput = e.target.value
		const relatedIds = relatedInput
			.split(',')
			.map(id => parseInt(id.trim()))
			.filter(id => !isNaN(id))

		setNote(prev => ({
			...prev,
			related_ids: relatedIds,
		}))
	}

	const { user } = useAuth()

	return (
		<>
			{user ? (
				<>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<button className='auth_button'> создать заметку</button>
						</DialogTrigger>
						<DialogContent className='bg-[#1c1c21] rounded-2xl max-w-[45%] min-w-[10%] w-full h-auto'>
							<div className='flex flex-col space-y-4 p-4 max-w-2xl mx-auto'>
								<Label className='text-2xl font-bold text-[#E6E8F2]  mb-3'>
									Создание заметки
								</Label>

								<div>
									<Label
										htmlFor='title'
										className='block text-sm font-bold mb-1 text-[#E6E8F2]'
									>
										Title
									</Label>
									<Input
										id='title'
										name='title'
										value={note.title}
										onChange={handleInputChange}
										placeholder='Note title'
										className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto mt-6 px-4 w-full h-14'
										required
									/>
								</div>

								<div>
									<Label
										htmlFor='content'
										className='block text-sm font-bold mb-1 text-[#E6E8F2]'
									>
										Content
									</Label>
									<textarea
										id='content'
										name='content'
										value={note.content}
										onChange={handleInputChange}
										placeholder='Note content'
										className='text-amber-50 font-black text-[18px w-full min-h-[150px] max-h-[160px] border-s-2 border-[#000000] bg-[#18181c] rounded-md borders px-3 py-2'
										required
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<Label
											htmlFor='tag_ids'
											className='block text-sm font-bold mb-1 text-[#E6E8F2]'
										>
											Tags
										</Label>
										<Input
											id='tag_ids'
											name='tag_ids'
											onChange={handleTagInput}
											placeholder='1, 2, 3'
											className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto px-4 w-full h-14'
										/>
									</div>

									<div>
										<Label
											htmlFor='related_ids'
											className='block text-sm font-bold mb-1 text-[#E6E8F2]'
										>
											Related Notes
										</Label>
										<Input
											id='related_ids'
											name='related_ids'
											onChange={handleRelatedInput}
											placeholder='1, 2, 3'
											className='text-amber-50 font-black text-[18px] pl-6 border-s-2 border-[#000000] bg-[#18181c] mx-auto px-4 w-full h-14'
										/>
									</div>
								</div>

								<div className='w-full text-[#A1A1AA] border-2 border-dashed border-[#444] rounded-xl bg-[#2E2E38] hover:bg-[#3B3B47] cursor-pointer transition-colors mb-4'>
									<Label
										htmlFor='attachments'
										className='block text-sm font-bold mb-1 text-[#E6E8F2]'
									>
										Attachments
									</Label>
									<Input
										id='attachments'
										name='attachments'
										type='file'
										ref={fileInputRef}
										onChange={handleFileChange}
										multiple
										className='w-full'
									/>
									{file && file.length > 0 && (
										<div className='mt-2'>
											<p className='text-sm'>
												Selected files: {file.map(f => f.name).join(', ')}
											</p>
										</div>
									)}
								</div>

								<button onClick={handleCreateNote} className='log_reg_button'>
									Create Note
								</button>
							</div>
						</DialogContent>
					</Dialog>
				</>
			) : null}
		</>
	)
}
