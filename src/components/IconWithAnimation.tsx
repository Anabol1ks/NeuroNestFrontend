// src/components/IconWithAnimation.tsx
'use client'

import { useEffect, useRef } from 'react'
import '../style/neuronest.css'

export default function IconWithAnimation() {
	const svgRef = useRef<SVGSVGElement>(null)

	useEffect(() => {
		const timer = setTimeout(() => {
			svgRef.current?.classList.add('active')
		}, 100)
		return () => clearTimeout(timer)
	}, [])

	return (
		<svg
			ref={svgRef}
			className='neuronest-icon'
			width='48'
			height='48'
			viewBox='0 0 100 100'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<defs>
				<linearGradient
					id='blueGradient'
					x1='0'
					y1='0'
					x2='100'
					y2='100'
					gradientUnits='userSpaceOnUse'
				>
					<stop stopColor='#0D1A33' />
					<stop offset='1' stopColor='#4DA1FF' />
				</linearGradient>
			</defs>

			<path
				className='svg-elem-1'
				d='M20 80 C20 30, 80 70, 80 20'
				stroke='url(#blueGradient)'
				strokeWidth='6'
				fill='none'
				strokeLinecap='round'
			/>
			<path
				className='svg-elem-2'
				d='M20 80 L20 20 L80 80 L80 20'
				stroke='url(#blueGradient)'
				strokeWidth='6'
				fill='none'
				strokeLinecap='round'
			/>
			<circle className='svg-elem-3' cx='20' cy='20' r='3' fill='#4DA1FF' />
			<circle className='svg-elem-4' cx='80' cy='20' r='3' fill='#4DA1FF' />
			<circle className='svg-elem-5' cx='20' cy='80' r='3' fill='#4DA1FF' />
			<circle className='svg-elem-6' cx='80' cy='80' r='3' fill='#4DA1FF' />
		</svg>
	)
}
