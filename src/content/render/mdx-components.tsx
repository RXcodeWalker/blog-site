/**
 * Custom MDX component mappings.
 * Each element maps to a styled React component that matches the publication design system.
 */
import type { ComponentPropsWithoutRef } from 'react';
import { Link } from '@tanstack/react-router';

type AnchorProps = ComponentPropsWithoutRef<'a'>;
type ImgProps = ComponentPropsWithoutRef<'img'>;

function MdxLink({ href = '', children, ...rest }: AnchorProps) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  if (isInternal) {
    return (
      <Link to={href} {...(rest as object)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxImage({ src, alt, ...rest }: ImgProps) {
  return (
    <figure className="my-10">
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        className="w-full rounded object-cover"
        {...rest}
      />
      {alt && (
        <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

function MdxBlockquote({ children, ...rest }: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      className="my-8 border-l-2 border-gold pl-6 font-serif text-xl italic leading-relaxed text-muted-foreground"
      {...rest}
    >
      {children}
    </blockquote>
  );
}

function MdxPre({ children, ...rest }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      className="my-8 overflow-x-auto rounded bg-secondary p-6 font-mono text-sm leading-relaxed"
      {...rest}
    >
      {children}
    </pre>
  );
}

function MdxCode({ children, ...rest }: ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-gold"
      {...rest}
    >
      {children}
    </code>
  );
}

function MdxH2({ children, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className="mt-14 mb-4 font-serif text-3xl font-light leading-tight tracking-tight"
      {...rest}
    >
      {children}
    </h2>
  );
}

function MdxH3({ children, ...rest }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className="mt-10 mb-3 font-serif text-2xl font-light leading-tight tracking-tight"
      {...rest}
    >
      {children}
    </h3>
  );
}

function MdxH4({ children, ...rest }: ComponentPropsWithoutRef<'h4'>) {
  return (
    <h4
      className="mt-8 mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
      {...rest}
    >
      {children}
    </h4>
  );
}

function MdxHr() {
  return <hr className="my-12 border-border" />;
}

function MdxUl({ children, ...rest }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul className="my-6 space-y-2 pl-6 list-disc marker:text-gold" {...rest}>
      {children}
    </ul>
  );
}

function MdxOl({ children, ...rest }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol className="my-6 space-y-2 pl-6 list-decimal marker:text-gold" {...rest}>
      {children}
    </ol>
  );
}

/**
 * Pass this to MDXProvider's `components` prop or to the compiled MDX component
 * via the `components` prop to apply publication styles globally.
 */
export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  blockquote: MdxBlockquote,
  pre: MdxPre,
  code: MdxCode,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  hr: MdxHr,
  ul: MdxUl,
  ol: MdxOl,
} as const;
