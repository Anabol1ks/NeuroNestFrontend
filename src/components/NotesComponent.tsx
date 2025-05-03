'use client'

import { getNotes, NotesResponse } from '@/lib/api'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function NotesComponent() {
	const token = Cookies.get('access_token')
	const [notes, setNotes] = useState<NotesResponse | null>(null)
	const [error, setError] = useState('')
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
	const [expandedCard, setExpandedCard] = useState<number | null>(null)
	const [openDropdown, setOpenDropdown] = useState<number | null>(null)

	useEffect(() => {
		// Update authentication status when token changes
		setIsAuthenticated(!!token)

		const fetchNotes = async () => {
			try {
				const data: NotesResponse = await getNotes(token!)
				setNotes(data)
				console.log(data)
			} catch (e: any) {
				setError(e.message)
				console.error('ошибка ', e)
			}
		}

		if (token) {
			fetchNotes()
		}
	}, [token]) // Only re-run if token changes

	if (!isAuthenticated) {
		return (
			<div className='p-4 text-center'>
				<p className='mb-4'>
					Вы не авторизованы. Пожалуйста, войдите в систему для просмотра
					заметок.
				</p>
			</div>
		)
	}

	const truncateText = (text: string, maxLength: number = 50) => {
		if (!text) return ''
		return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
	}

	// Function to handle dropdown open state
	const handleDropdownOpenChange = (open: boolean, noteId: number) => {
		if (open) {
			setOpenDropdown(noteId)
			setExpandedCard(noteId) // Keep card expanded when dropdown opens
		} else {
			setOpenDropdown(null)
			// Only reset expandedCard if mouse is not over the card
			if (expandedCard !== noteId) {
				setExpandedCard(null)
			}
		}
	}

	return (
		<>
			<div className='container mx-auto p-4'>
				{error && (
					<p className='text-red-500 p-3 bg-red-50 rounded-md mb-4'>
						Error: {error}
					</p>
				)}
				{notes && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{notes.notes?.map(note => (
							<div
								key={note.id}
								className='relative transform-gpu transition-all duration-500 ease-in-out hover:z-10'
								style={{
									transformOrigin: 'center',
									transform:
										expandedCard === note.id || openDropdown === note.id
											? 'scale(1.02)'
											: 'scale(1)',
									boxShadow:
										expandedCard === note.id || openDropdown === note.id
											? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
											: 'none',
								}}
								onMouseEnter={() => setExpandedCard(note.id)}
								onMouseLeave={() => {
									// Only collapse if dropdown is not open for this card
									if (openDropdown !== note.id) {
										setExpandedCard(null)
									}
								}}
							>
								<Card className='h-full flex flex-col overflow-hidden transition-all duration-500'>
									<CardHeader className='transition-all duration-500'>
										<CardTitle>{note.title}</CardTitle>
									</CardHeader>
									<CardContent className='flex-grow transition-all duration-500'>
										{note.summary ? (
											<div className='transition-all duration-500'>
												<p className='text-sm text-gray-500 mb-1'>
													Краткое содержание:
												</p>
												<CardDescription
													className='transition-all duration-500 overflow-hidden'
													style={{
														maxHeight:
															expandedCard === note.id ||
															openDropdown === note.id
																? '500px'
																: '60px',
													}}
												>
													{expandedCard === note.id || openDropdown === note.id
														? note.summary
														: truncateText(note.summary)}
												</CardDescription>
											</div>
										) : note.content ? (
											<div className='transition-all duration-500'>
												<p className='text-sm text-gray-500 mb-1'>
													Содержание:
												</p>
												<CardDescription
													className='transition-all duration-500 overflow-hidden text-wrap break-words'
													style={{
														maxHeight:
															expandedCard === note.id ||
															openDropdown === note.id
																? '500px'
																: '60px',
														overflowY:
															expandedCard === note.id ||
															openDropdown === note.id
																? 'auto'
																: 'hidden',
														wordBreak: 'break-word',
														whiteSpace: 'normal',
														textOverflow: 'ellipsis',
													}}
												>
													{expandedCard === note.id || openDropdown === note.id
														? note.content
														: truncateText(note.content)}
												</CardDescription>
											</div>
										) : (
											<CardDescription>Нет содержания</CardDescription>
										)}
									</CardContent>
									<CardFooter className='text-sm text-gray-500 transition-all duration-500'>
										{new Date(note.created_at).toLocaleDateString()}
										<p className='ml-auto font-black'>
											{note?.tags?.length > 0 ? (
												<DropdownMenu
													onOpenChange={open =>
														handleDropdownOpenChange(open, note.id)
													}
												>
													<DropdownMenuTrigger
														asChild
														className='bg-[#2B2B30] text-white rounded-2xl hover:bg-[#3B3B40] transition-colors duration-300 text-center px-3.5 py-2'
													>
														<div>Теги</div>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														{note?.tags?.map(tag => (
															<DropdownMenuItem
																key={tag.id}
																className='bg-[#2B2B30] hover:bg-[#3B3B40] text-white'
															>
																{tag.name}
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
											) : (
												<p className='px-3.5 py-2'>Тегов нет</p>
											)}
										</p>
									</CardFooter>
								</Card>
							</div>
						))}
					</div>
				)}
				{notes && notes.notes?.length === 0 && (
					<div className='text-center p-8 bg-gray-50 rounded-lg'>
						<p className='text-gray-600'>
							У вас пока нет заметок. Создайте свою первую заметку!
						</p>
					</div>
				)}
			</div>
		</>
	)
}
