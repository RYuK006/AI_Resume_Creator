import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Intro = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
	const scale = spring({ frame, fps, config: { damping: 12 } });

	return (
		<AbsoluteFill style={{ 
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'center', 
			background: 'linear-gradient(135deg, #0061a4 0%, #2196f3 100%)' 
		}}>
			<div style={{ transform: `scale(${scale})`, opacity, textAlign: 'center', color: 'white' }}>
				<h1 style={{ fontSize: 120, fontWeight: 900, marginBottom: 20 }}>Luminance AI</h1>
				<p style={{ fontSize: 40, fontWeight: 600, opacity: 0.8 }}>Your Career, Elevated.</p>
			</div>
		</AbsoluteFill>
	);
};
