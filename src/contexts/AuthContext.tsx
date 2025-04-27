'use client'

import React, {
	createContext,
	useState,
	useEffect,
	ReactNode,
	useContext,
} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

type UserProfile = {
	nickname: string
	email: string
	first_name: string
	last_name: string
	profile_pic: string
}

type AuthContextType = {
	user: UserProfile | null
	setUser: (u: UserProfile | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null)

	useEffect(() => {
		const token = Cookies.get('access_token')
		if (!token) return

		axios
			.get<UserProfile>(`${process.env.NEXT_PUBLIC_API_URL}/profile/get`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(res => setUser(res.data))
			.catch(() => setUser(null))
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be inside AuthProvider')
	return ctx
}
