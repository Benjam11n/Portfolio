import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html as="div" center className="flex flex-col items-center justify-center">
      <span>
        <p className="mt-10 text-sm font-extrabold text-[#F1F1F1]">
          {progress !== 0 ? `${progress.toFixed(2)}%` : 'Loading ...'}
        </p>
      </span>
    </Html>
  );
};

export default CanvasLoader;
