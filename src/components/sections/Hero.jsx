import {Image, Link} from '@shopify/hydrogen';

import {Heading, Text} from '~/components';

export function Hero({byline, cta, handle, heading, loading, spread}) {
  return (
    <section
      className={`relative flex flex-col justify-between md:flex-row w-full`}
    >
      <div className="flex flex-col basis-full md:basis-1/2 items-baseline justify-between gap-4 py-8 md:py-16 px-5 md:px-16">
        {heading?.value && (
          <Heading format as="h2" size="display" className="">
            {heading.value}
          </Heading>
        )}
        {byline?.value && (
          <Text format width="narrow" as="p" size="lead">
            {byline.value}
          </Text>
        )}
        {cta?.value && (
          <Link to={`/collections/${handle}`}>
            <Text size="lead">{cta.value}</Text>{' '}
          </Link>
        )}
      </div>

      <div className="basis-full md:basis-1/2 lg:basis-2/5 md:py-16 px-5 md:px-16">
        {spread?.reference && (
          <Image
            className="aspect-[3/4] w-full object-cover fadeIn"
            sizes={
              spread?.reference
                ? '(min-width: 80em) 700px, (min-width: 48em) 450px, 500px'
                : '(min-width: 80em) 1400px, (min-width: 48em) 900px, 500px'
            }
            widths={spread?.reference ? [500, 450, 700] : [500, 900, 1400]}
            width={spread?.reference ? 375 : 750}
            data={spread.reference.image}
            loading={loading}
            alt={'Marketing Banner Image'}
          />
        )}
      </div>
    </section>
  );
}
