import { useState } from 'react';
import Globe from 'react-globe.gl';

import Button from '../components/Button.jsx';
import { exploreInfo } from '../../constants';

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(' adrian@jsmastery.pro');
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <section className="c-space my-20" id="about">
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img
              src="assets/grid1.png"
              alt="grid-1"
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Hi, I&apos;m Benjamin</p>
              <p className="grid-subtext">
                With 1 year of experience, I have honed my skills in both
                frontend and backend development, with a focus on using the
                power of AI to imrpove user experiences on websites.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img
              src="assets/grid2.png"
              alt="grid-2"
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Tech Stack</p>
              <p className="grid-subtext">
                I specialize in a variety of languages and frameworks, including
                React, Next.js, Node.js, and MongoDB. I am also have experience
                with machine learning and deep learning.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe
                height={386}
                width={386}
                backgroundColor="rgba(0, 0, 0, 0)"
                backgroundImageOpacity={0.5}
                showAtmosphere
                showGraticules
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                labelsData={[
                  {
                    lat: 1.29027,
                    lng: 103.851959,
                    text: 'Singapore',
                    color: 'white',
                    size: 30,
                  },
                ]}
              />
            </div>
            <div>
              <p className="grid-headtext">
                I&apos;m very flexible with time zone communications & locations
              </p>
              <p className="grid-subtext">
                I&apos;m based in Singapore and open to remote work worldwide.
              </p>
              <Button name="Contact Me" isBeam containerClass="w-full mt-10" />
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container">
            <img
              src="assets/grid3.png"
              alt="grid-3"
              className="w-full sm:h-[340px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext"> My Coding Philosophy</p>
              <p className="grid-subtext">
                I am always learning and improving my skills to keep up with the
                latest technologies. I believe that code has the power to change
                the world and I am passionate about using my skills to make a
                positive impact.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <img
              src="assets/grid4.png"
              alt="grid-4"
              className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <img
                  src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'}
                  alt="copy"
                />
                <p className="lg:text-lg md:text-md font-medium text-gray_gradient text-white">
                  {exploreInfo.contact.mail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
