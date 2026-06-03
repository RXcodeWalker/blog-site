declare module "*.mdx" {
  import type { ComponentType, ComponentPropsWithoutRef, ElementType } from "react";

  type MDXComponents = Record<string, ComponentType | ElementType>;

  interface MDXContentProps {
    components?: MDXComponents;
    [key: string]: unknown;
  }

  const Content: ComponentType<MDXContentProps>;
  export const frontmatter: Record<string, unknown>;
  export default Content;
}
