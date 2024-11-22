import { useEffect } from 'react'

const THEME_MODE = 'theme-mode'
const defaultTheme = 'light'
const darkTheme = 'dark'

const useDarkMode = () => {
	const storeThemeToLs = (themeMode: string) => {
		localStorage.setItem(THEME_MODE, themeMode)
	}
	const readThemeFromLs = () => {
		return localStorage.getItem(THEME_MODE) || ''
	}

	const updateTheme = (newTheme: string, previousTheme?: string) => {
		const { classList } = document.documentElement
		if (previousTheme) classList.remove(previousTheme)
		classList.add(newTheme)
	}

	const toggleTheme = () => {
		const previousTheme = readThemeFromLs()
		const newTheme = previousTheme === defaultTheme ? darkTheme : defaultTheme
		updateTheme(newTheme, previousTheme)
		storeThemeToLs(newTheme)
	}

	useEffect(() => {
		const oldTheme = readThemeFromLs()
		if (oldTheme) {
			return updateTheme(oldTheme)
        }
        console.log('Checking for dark mode preference')
if (typeof window === 'undefined') {
	console.log('Not running in a browser environment')
	return
}
		// const runningOnDarkMode = window.matchMedia(
		// 	'(prefers-color-scheme: dark)'
		// ).matches
		// console.log('runningOnDarkMode-', runningOnDarkMode)

		if (typeof window !== 'undefined') {
			const runningOnDarkMode = window.matchMedia(
				'(prefers-color-scheme: dark)'
			).matches
			console.log(
				'runningOnDarkMode-',

				runningOnDarkMode
			)

			if (runningOnDarkMode) {
				updateTheme(darkTheme)
				storeThemeToLs(darkTheme)
			} else {
				updateTheme(defaultTheme)
				storeThemeToLs(defaultTheme)
			}
		}

		// if (runningOnDarkMode) {
		// 	updateTheme(darkTheme)
		// 	storeThemeToLs(darkTheme)
		// } else {
		// 	updateTheme(defaultTheme)
		// 	storeThemeToLs(defaultTheme)
		// }
	}, [])

	return { toggleTheme }
}

export default useDarkMode
