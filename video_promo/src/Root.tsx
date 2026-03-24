import { Composition, registerRoot } from 'remotion';
import { Main } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyVideo"
				component={Main}
				durationInFrames={1050} // 35 seconds * 30 fps
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};

registerRoot(RemotionRoot);
