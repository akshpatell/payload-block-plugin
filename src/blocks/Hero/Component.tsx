import type { HeroBlock } from '../../payload-types.js'
import Image from 'next/image'
import React from 'react'

export const HeroComponent: React.FC<HeroBlock> = ({ buttons, headline, image, subheadline }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{headline}</span>
              </h1>
              {subheadline && (
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {subheadline}
                </p>
              )}
              {buttons && buttons.length > 0 && (
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {buttons.map((button, i) => (
                    <div className={i > 0 ? 'mt-3 sm:mt-0 sm:ml-3' : ''} key={i}>
                      <a
                        className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 ${
                          button.type === 'primary'
                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                            : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                        }`}
                        href={button.link || '#'}
                      >
                        {button.label}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      {image && typeof image === 'object' && !('length' in image) && image.url && (
        <div className="relative h-56 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
          <Image alt={image.alt || ''} className="object-cover" fill src={image.url} />
        </div>
      )}
    </div>
  )
}
