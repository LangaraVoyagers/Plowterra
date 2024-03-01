import { useCallback, useState } from 'react'

export const usePersistedState = <T>(key: string, initialValue: T) => {
	const getInitialValue = useCallback(() => {
		try {
			const rawData = localStorage.getItem(key)

			return typeof rawData === 'string'
				? (JSON.parse(rawData) as T)
				: initialValue
		} catch (error) {
			return initialValue
		}
	}, [initialValue, key])

	const [storedValue, setStoredValue] = useState<T>(getInitialValue())

	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			const stateToPersist =
				value instanceof Function ? value(getInitialValue()) : value
			setStoredValue(stateToPersist)

			localStorage.setItem(key, JSON.stringify(stateToPersist))
		},
		[key, getInitialValue]
	)

	return [storedValue, setValue] as const
}
