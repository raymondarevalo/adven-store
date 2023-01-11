import clsx from 'clsx';

import {Heading} from '~/components';
import {missingClass} from '~/lib/utils';

export function Section({
  as: Component = 'section',
  children,
  className,
  divider = 'none',
  display = 'grid',
  heading,
  padding = 'all',
  ...props
}) {
  const paddings = {
    x: 'px-5 md:px-16',
    y: 'py-12 md:py-16',
    swimlane: 'pt-4 md:pt-8 lg:pt-12 md:pb-4 lg:pb-8',
    pdp: 'py-6 px-5 md:px-16 md:py-12',
    cdp: 'px-5 md:px-16 pb-12 md:pb-16',
    all: 'px-5 py-12 md:p-16',
  };

  const dividers = {
    none: 'border-none',
    top: 'border-t border-primary/05',
    bottom: 'border-b border-primary/05',
    both: 'border-y border-primary/05',
  };

  const displays = {
    flex: 'flex',
    grid: 'grid',
  };

  const styles = clsx(
    'w-full gap-4',
    displays[display],
    missingClass(className, '\\mp[xy]?-') && paddings[padding],
    dividers[divider],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {heading && (
        <Heading size="lead" className={padding === 'y' ? paddings['x'] : ''}>
          {heading}
        </Heading>
      )}
      {children}
    </Component>
  );
}
