// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Disclosure} from '@headlessui/react';
import {Link} from '@shopify/hydrogen';

/**
 * A server component that specifies the content of the footer on the website
 */
export function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
            <>
              {item?.items?.length > 0 && (
                <div
                  className={`max-h-48 h-fit overflow-hidden transition-all duration-300`}
                >
                  <Disclosure.Panel static>
                    <nav className={styles.nav}>
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.to}
                          target={subItem.target}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </nav>
                  </Disclosure.Panel>
                </div>
              )}
            </>
          </Disclosure>
        </section>
      ))}{' '}
    </>
  );
}
