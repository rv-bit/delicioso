import React from "react";

export function useLocalStorage<Type>(key: string, initialValue: Type) {
	const [storedValue, setStoredValue] = React.useState<Type>(() => {
		const storedValue = localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : initialValue;
	});

	React.useEffect(() => {
		function fromStorage(ev: StorageEvent) {
			if (ev.key === key) {
				const newVal = ev.newValue ? (JSON.parse(ev.newValue) as Type) : initialValue;
				setStoredValue(newVal);
			}
		}

		window.addEventListener("storage", fromStorage);

		return () => {
			window.removeEventListener("storage", fromStorage);
		};
	}, [key]);

	const setValue = React.useCallback(
		(value: Type | ((prevValue: Type) => Type)) => {
			setStoredValue((prevValue) => {
				const newValue = typeof value === "function" ? (value as Function)(prevValue) : value;
				localStorage.setItem(key, JSON.stringify(newValue));
				return newValue;
			});
		},
		[key],
	);

	return [storedValue, setValue] as const;
}
