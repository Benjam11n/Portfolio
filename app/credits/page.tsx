import Link from 'next/link';

import { MODEL_CREDITS } from '@/constants';

export default function CreditsPage() {
  return (
    <div className="c-space py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Credits</h1>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">3D Models</h2>
          <ul className="space-y-4">
            {MODEL_CREDITS.map((model, index) => (
              <li key={index} className="rounded-lg bg-white/5 p-4">
                <h3 className="text-lg font-medium">
                  <a
                    href={model.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {model.title}
                  </a>
                </h3>
                <p className="text-muted-foreground">
                  Created by
                  <a
                    href={model.authorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {` ${model.author}`}
                  </a>
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  License:
                  <a
                    href={model.licenseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {` ${model.license}`}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="bg-primary/20 text-primary hover:bg-primary/30 rounded-md px-4 py-2 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
