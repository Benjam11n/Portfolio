import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html as="div" center className="flex justify-center items-center flex-col">
      <span className="canvas-loader">
        <p className="text-sm text-[#F1F1F1] font-extrabold mt-10">
          {progress !== 0 ? `${progress.toFixed(2)}%` : 'Loading ...'}
        </p>
      </span>
    </Html>
  );
};

export default CanvasLoader;
