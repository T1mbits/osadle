import { useEffect, useState } from "react";

export default function useDark() {
	const [isDark, setDark] = useState(false);

	useEffect(() => {
		if (!localStorage.getItem("theme")) localStorage.setItem("theme", "light");
		setDark(localStorage.getItem("theme") === "dark");
	});

	return isDark;
}

export function setDark(dark: boolean) {
	localStorage.setItem("theme", dark ? "dark" : "light");
	window.location.reload(); // all that for nothing i guess
}
