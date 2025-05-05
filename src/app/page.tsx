'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
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
import TokenRefresherComponent from '@/components/TokenRefreshComponent'
import { getNotes, NotesResponse } from '@/lib/api'
import Cookies from 'js-cookie'
import NotesComponent from '@/components/NotesComponent'
import CreateNoteComponent from '@/components/CreateNoteComponent'

export default function Home() {
	const [refreshNotes, setRefreshNotes] = useState(0)

	// Function to trigger notes refresh
	const handleNoteCreated = useCallback(() => {
		setRefreshNotes(prev => prev + 1)
	}, [])

	return (
		<>
			<TokenRefresherComponent />
			<HeaderComponent />
			<CreateNoteComponent onNoteCreated={handleNoteCreated} />
			<NotesComponent key={refreshNotes} />
		</>
	)
}
