import Link from 'next/link';

export default function CreditsPage() {
  return (
    <div className="c-space py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Credits</h1>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">3D Models</h2>
          <ul className="space-y-4">
            {/* Add your 3D model credits here */}
            <li className="rounded-lg bg-white/5 p-4">
              <h3 className="text-lg font-medium">Model Name</h3>
              <p className="text-muted-foreground">
                Created by{' '}
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Creator Name
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                License: CC BY 4.0
              </p>
            </li>

            <li className="rounded-lg bg-white/5 p-4">
              <h3 className="text-lg font-medium">Another 3D Asset</h3>
              <p className="text-muted-foreground">
                Created by{' '}
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Another Creator
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">License: MIT</p>
            </li>

            {/* Add more models as needed */}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Libraries & Frameworks
          </h2>
          <ul className="space-y-4">
            <li className="rounded-lg bg-white/5 p-4">
              <h3 className="text-lg font-medium">Three.js</h3>
              <p className="text-muted-foreground">
                <a
                  href="https://threejs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://threejs.org/
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">License: MIT</p>
            </li>

            <li className="rounded-lg bg-white/5 p-4">
              <h3 className="text-lg font-medium">React Three Fiber</h3>
              <p className="text-muted-foreground">
                <a
                  href="https://docs.pmnd.rs/react-three-fiber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://docs.pmnd.rs/react-three-fiber
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">License: MIT</p>
            </li>

            {/* Add more libraries as needed */}
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-md bg-primary/20 px-4 py-2 text-primary transition-colors hover:bg-primary/30"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
