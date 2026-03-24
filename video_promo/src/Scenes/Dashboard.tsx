import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';

export const DashboardScene = () => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, 300], [0.9, 1.1]);
	const opacity = interpolate(frame, [0, 15, 285, 300], [0, 1, 1, 0]);

	return (
		<AbsoluteFill style={{ 
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'center', 
			padding: 50,
			opacity 
		}}>
			<div style={{ position: 'relative', width: '90%', height: '80%', overflow: 'hidden', borderRadius: 40, boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
				<Img 
					src={staticFile('dashboard.png')} 
					style={{ width: '100%', transform: `scale(${scale})` }} 
				/>
				<div style={{ 
					position: 'absolute', 
					bottom: 100, 
					left: 100, 
					background: 'rgba(255,255,255,0.9)', 
					backdropFilter: 'blur(20px)',
					padding: '24px 48px',
					borderRadius: 100,
					fontSize: 48,
					fontWeight: 900,
					color: '#0061a4'
				}}>
					Intelligent Career Oversight
				</div>
			</div>
		</AbsoluteFill>
	);
};
