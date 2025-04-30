'use client'

import { useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { refToken } from '@/lib/api'

const TokenRefresherComponent = () => {
  const token = Cookies.get('access_token')


	const handleRefreshToken = async () => {
		const refreshToken = Cookies.get('refresh_token')
		if (!refreshToken) {
			console.error('Refresh token не найден в куках')
			return
		}

		try {
			// Отправляем запрос на обновление токена
			const response = await refToken(token!);
			if (
				response &&
				response.access_token &&
				response.refresh_token
			) {
				// Устанавливаем новые токены в куки
				Cookies.set('access_token', response.access_token, {
					sameSite: 'strict',
					secure: true,
				})
				Cookies.set('refresh_token', response.refresh_token, {
					sameSite: 'strict',
					secure: true,
				})
			} else {
				console.error('Ответ от сервера не содержит токенов')
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					'Ошибка при обновлении токенов:',
					error.response?.data?.message || error.message
				)
			} else {
				console.error('Неизвестная ошибка:', error)
			}
		}
	}

	useEffect(() => {
		// Обновляем токен при монтировании компонента
		handleRefreshToken()

		// Устанавливаем интервал для периодического обновления токенов
		const interval = setInterval(() => {
			handleRefreshToken()
		}, 14 * 60 * 1000) // Обновление каждые 14 минут

		// Очищаем интервал при размонтировании компонента
		return () => clearInterval(interval)
	}, [])

	return null
}

export default TokenRefresherComponent