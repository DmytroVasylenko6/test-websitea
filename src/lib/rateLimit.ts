type Bucket = { timestamps: number[] };

const hits = new Map<string, Bucket>();

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
	const now = Date.now();
	const bucket = hits.get(key) ?? { timestamps: [] };
	bucket.timestamps = bucket.timestamps.filter((time) => now - time < windowMs);

	if (bucket.timestamps.length >= limit) {
		hits.set(key, bucket);
		return true;
	}

	bucket.timestamps.push(now);
	hits.set(key, bucket);
	return false;
}
