export function maskSecret(value?: string | null): string {
	if (!value) {
		return "[empty]";
	}
	if (value.length <= 8) {
		return "***";
	}
	return `${value.slice(0, 3)}…${value.slice(-3)}`;
}
