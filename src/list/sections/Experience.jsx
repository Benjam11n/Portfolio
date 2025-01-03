import { Canvas } from '@react-three/fiber';
import { workExperiences } from '../../constants';
import { OrbitControls, SpotLight } from '@react-three/drei';
import { Suspense } from 'react';
import CanvasLoader from '../components/CanvasLoader';
// import Avatar from '../components/Avatar';
import { RetroComputer } from '../components/RetroComputer';
import { useState } from 'react';

const Experience = () => {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
  const currentWork = workExperiences[selectedWorkIndex];

  return (
    <section className="c-space my-20" id="experience">
      <div className="w-full text-white-600">
        <h3 className="head-text">My Work Experience</h3>
        <div className="work-container">
          <div className="border border-black-300 bg-black-200 rounded-lg h-96 md:h-full">
            <Canvas>
              <ambientLight intensity={2} />
              <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <OrbitControls
                maxPolarAngle={Math.PI / 2}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
                enableZoom={false}
              />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />
              <Suspense fallback={<CanvasLoader />}>
                <ambientLight intensity={2} />
                <group position-y={-1.5} position-x={0} scale={0.055}>
                  <RetroComputer texture={currentWork.texture} />
                </group>
              </Suspense>
            </Canvas>
          </div>

          <div className="work-content">
            <div className="sm:py-10 py-5 sm:px-5 px-2.5">
              {workExperiences.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedWorkIndex(index)}
                  onPointerOver={() => setSelectedWorkIndex(index)}
                  className={`work-content_container group ${
                    index === selectedWorkIndex ? 'bg-black-300 ' : ''
                  }`}
                >
                  <div className="flex flex-col h-full justify-start items-center py-2">
                    <div className="work-content_logo">
                      <img className="w-full h-full" src={item.icon} alt="" />
                    </div>

                    <div className="work-content_bar" />
                  </div>

                  <div className="sm:p-5 px-2.5 py-5">
                    <p className="font-bold text-white-800">{item.name}</p>
                    <p className="text-sm mb-5">
                      {item.pos} -- <span>{item.duration}</span>
                    </p>
                    <p className="group-hover:text-white transition-all ease-in-out duration-500">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
