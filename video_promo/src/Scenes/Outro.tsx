import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Outro = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = interpolate(frame, [0, 20], [0, 1]);
	const scale = spring({ frame, fps, config: { damping: 12 } });

	return (
		<AbsoluteFill style={{ 
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'center', 
			background: 'linear-gradient(135deg, #2196f3 0%, #0061a4 100%)' 
		}}>
			<div style={{ transform: `scale(${scale})`, opacity, textAlign: 'center', color: 'white' }}>
				<h1 style={{ fontSize: 100, fontWeight: 900, marginBottom: 20 }}>Luminance AI</h1>
				<p style={{ fontSize: 48, fontWeight: 700, opacity: 0.9 }}>Craft Your Future Today.</p>
				<div style={{ marginTop: 60, padding: '20px 60px', borderRadius: 100, background: 'white', color: '#0061a4', fontSize: 32, fontWeight: 900 }}>
					luminance-ai.app
				</div>
			</div>
		</AbsoluteFill>
	);
};
