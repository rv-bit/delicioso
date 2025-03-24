import React from "react";

export function useLocalStorage<Type>(key: string, initialValue: Type) {
	const [storedValue, setStoredValue] = React.useState<Type>(() => {
		const storedValue = localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : initialValue;
	});

	React.useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				const newValue = event.newValue ? (JSON.parse(event.newValue) as Type) : initialValue;
				setStoredValue(newValue);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key]);

	const setValue = React.useCallback(
		(value: Type | ((prevValue: Type) => Type)) => {
			setStoredValue((prevValue) => {
				const newValue = typeof value === "function" ? (value as Function)(prevValue) : value;
				localStorage.setItem(key, JSON.stringify(newValue));
				window.dispatchEvent(new Event("local-storage-update"));
				return newValue;
			});
		},
		[key],
	);

	React.useEffect(() => {
		const handleCustomUpdate = () => {
			const storedValue = localStorage.getItem(key);
			setStoredValue(storedValue ? JSON.parse(storedValue) : initialValue);
		};

		window.addEventListener("local-storage-update", handleCustomUpdate);
		return () => window.removeEventListener("local-storage-update", handleCustomUpdate);
	}, [key]);

	return [storedValue, setValue] as const;
}
