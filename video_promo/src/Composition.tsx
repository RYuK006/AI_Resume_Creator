import { interpolate, Sequence, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { Intro } from './Scenes/Intro';
import { DashboardScene } from './Scenes/Dashboard';
import { EditorScene } from './Scenes/Editor';
import { Outro } from './Scenes/Outro';

export const Main = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter' }}>
			<Sequence from={0} durationInFrames={fps * 4}>
				<Intro />
			</Sequence>
			<Sequence from={fps * 4} durationInFrames={fps * 10}>
				<DashboardScene />
			</Sequence>
			<Sequence from={fps * 14} durationInFrames={fps * 15}>
				<EditorScene />
			</Sequence>
			<Sequence from={fps * 29} durationInFrames={fps * 6}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};
