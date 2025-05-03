'use client'
import Cookies from 'js-cookie'
import { NoteInput } from '@/lib/api'
import { useState, useRef, ChangeEvent } from 'react'
import { createNote } from '@/lib/api'
import { Input } from '@/components/ui/input'

export default function CreateNoteComponent() {
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

	return (
		<div className='flex flex-col space-y-4 p-4 max-w-2xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4'>Create New Note</h2>

			<div>
				<label htmlFor='title' className='block text-sm font-medium mb-1'>
					Title
				</label>
				<Input
					id='title'
					name='title'
					value={note.title}
					onChange={handleInputChange}
					placeholder='Note title'
					className='w-full'
					required
				/>
			</div>

			<div>
				<label htmlFor='content' className='block text-sm font-medium mb-1'>
					Content
				</label>
				<textarea
					id='content'
					name='content'
					value={note.content}
					onChange={handleInputChange}
					placeholder='Note content'
					className='w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2'
					required
				/>
			</div>

			<div>
				<label htmlFor='tag_ids' className='block text-sm font-medium mb-1'>
					Tags (comma-separated IDs)
				</label>
				<Input
					id='tag_ids'
					name='tag_ids'
					onChange={handleTagInput}
					placeholder='1, 2, 3'
					className='w-full'
				/>
			</div>

			<div>
				<label htmlFor='related_ids' className='block text-sm font-medium mb-1'>
					Related Notes (comma-separated IDs)
				</label>
				<Input
					id='related_ids'
					name='related_ids'
					onChange={handleRelatedInput}
					placeholder='1, 2, 3'
					className='w-full'
				/>
			</div>

			<div>
				<label htmlFor='attachments' className='block text-sm font-medium mb-1'>
					Attachments
				</label>
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

			<button
				onClick={handleCreateNote}
				className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md'
			>
				Create Note
			</button>
		</div>
	)
}
