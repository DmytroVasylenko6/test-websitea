import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icons must be raster, so the SVG mark is redrawn here at 180x180.
export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					background: "#14201e",
					borderRadius: 34,
					display: "flex",
				}}
			>
				<div
					style={{
						position: "absolute",
						left: 28,
						top: 28,
						width: 79,
						height: 124,
						borderRadius: 8,
						background: "#c5d4c8",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 73,
						top: 73,
						width: 79,
						height: 79,
						borderRadius: 8,
						background: "#2f6f68",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 90,
						top: 90,
						width: 45,
						height: 45,
						borderRadius: 6,
						background: "#14201e",
					}}
				/>
			</div>
		),
		size,
	);
}
