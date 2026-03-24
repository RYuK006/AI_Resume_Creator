import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';

export const EditorScene = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 15, 435, 450], [0, 1, 1, 0]);
	const x = interpolate(frame, [0, 450], [0, -200]);

	return (
		<AbsoluteFill style={{ padding: 60, opacity }}>
			<div style={{ display: 'flex', gap: 40, height: '100%' }}>
				<div style={{ flex: 1, borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
					<Img src={staticFile('editor.png')} style={{ width: '100%', transform: `translateX(${x}px)` }} />
				</div>
				<div style={{ width: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
					<div style={{ padding: 40, background: 'white', borderRadius: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
						<h3 style={{ fontSize: 48, fontWeight: 900, color: '#0061a4', marginBottom: 16 }}>AI Brain Optimization</h3>
						<p style={{ fontSize: 24, color: '#666', lineHeight: 1.5 }}>Simulate recruiter scans and get instant power rewrites.</p>
					</div>
					<div style={{ padding: 40, background: 'white', borderRadius: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
						<h3 style={{ fontSize: 48, fontWeight: 900, color: '#10b981', marginBottom: 16 }}>LinkedIn SEO</h3>
						<p style={{ fontSize: 24, color: '#666', lineHeight: 1.5 }}>SEO headlines and outreach scripts that convert.</p>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
