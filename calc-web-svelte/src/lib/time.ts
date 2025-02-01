export function timeDiff(from?: string, to?: string) {
	const fromDate = from && new Date(from);
	const toDate = to && new Date(to);

	if (!fromDate) return '-';
	if (!toDate) return '-';

	const diff = toDate.getTime() - fromDate.getTime();

	return prettyTime(diff);
}

export function prettyTime(time: number): string {
	const ms = time % 1000;
	const s = Math.floor(time / 1000) % 60;
	const m = Math.floor(time / (60 * 1000)) % 60;
	const h = Math.floor(time / (60 * 60 * 1000));
	if (time < 1000) {
		return `${time}ms`;
	}

	if (time < 60 * 1000) {
		return `${Math.floor(time / 100) / 10}s`;
	}

	if (time < 60 * 60 * 1000) {
		return `${m}m${s == 0 ? '' : `${s}s`}`;
	}

	return `${h}h${m == 0 ? '' : `${m}m`}`;
}
