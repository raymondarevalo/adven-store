import {Suspense} from 'react';
import clsx from 'clsx';
import {
  gql,
  ProductOptionsProvider,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
  Money,
  useMoney,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {getExcerpt, isDiscounted} from '~/lib/utils';
import {NotFound, Layout, ProductSwimlane} from '~/components/index.server';
import {
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '~/components';

export default function Product() {
  const {handle} = useRouteParams();
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {
    data: {product, shop},
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  const {media, title, vendor, descriptionHtml, id, productType} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const {
    priceV2,
    compareAtPriceV2,
    id: variantId,
    sku,
    title: variantTitle,
  } = product.variants.nodes[0];

  useServerAnalytics({
    shopify: {
      canonicalPath: `/products/${handle}`,
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: id,
      products: [
        {
          product_gid: id,
          variant_gid: variantId,
          variant: variantTitle,
          name: title,
          brand: vendor,
          category: productType,
          price: priceV2.amount,
          sku,
        },
      ],
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <ProductOptionsProvider data={product}>
        <Section padding="pdp" className="">
          <div className="grid items-start md:gap-6 lg:gap-16 md:grid-cols-2 lg:grid-cols-4">
            <ProductGallery
              media={media.nodes}
              className="w-full md:w-full md:col-span-2"
            />
            <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll md:col-span-2">
              <section className="flex flex-col w-full gap-8 py-6 md:max-w-xl md:px-0">
                <div className="grid gap-2">
                  <Heading
                    as="h1"
                    format
                    className="whitespace-normal"
                    size="display"
                  >
                    {title}
                  </Heading>
                  <div className="grid grid-flow-col justify-start gap-3">
                    <p className="h5">
                      <Money withoutTrailingZeros data={priceV2} />
                    </p>
                    {isDiscounted(priceV2, compareAtPriceV2) && (
                      <CompareAtPrice
                        className={'opacity-50'}
                        data={compareAtPriceV2}
                      />
                    )}
                  </div>
                </div>
                <ProductForm />
                <div className="grid gap-4 py-4">
                  {descriptionHtml && (
                    <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Returns"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </Section>
        <Suspense>
          <ProductSwimlane title="Related Products" data={id} />
        </Suspense>
      </ProductOptionsProvider>
    </Layout>
  );
}

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      productType
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike h5', className);

  return (
    <p className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </p>
  );
}
