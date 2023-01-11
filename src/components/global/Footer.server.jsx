import {Section, Heading, FooterMenu} from '~/components';

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({menu}) {
  return (
    <Section
      divider="top"
      as="footer"
      role="contentinfo"
      className={`grid min-h-[20rem] items-start grid-flow-row w-full gap-12 py-12 md:py-16 px-5 md:px-16 
         grid-cols-2  lg:grid-cols-4
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <div className="col-span-2">
        <Heading className="font-bold" size="lead" as="h4">
          Adven
        </Heading>
        <div className={`opacity-50 pt-2`}>
          &copy; {new Date().getFullYear()} Adven
        </div>
      </div>
      <FooterMenu menu={menu} />
    </Section>
  );
}
