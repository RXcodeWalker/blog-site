// Build-time remark plugin. Validates MDX JSX usage against component contracts.
// Add to vite.config.ts remarkPlugins array. Errors throw in dev and fail vite build.

const VALID_CALLOUT_TYPES = ["info", "tip", "warning", "danger", "insight"] as const;
const VALID_WIDGET_NAMES = ["CounterDemo"] as const;

type MdastNode = {
  type: string;
  name?: string;
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
  children?: MdastNode[];
  position?: { start: { line: number; column: number } };
};

function getAttrValue(node: MdastNode, attrName: string): string | null {
  for (const attr of node.attributes ?? []) {
    if (attr.name === attrName && typeof attr.value === "string") {
      return attr.value;
    }
    // JSX expression attribute: { type: 'mdxJsxAttributeValueExpression', value: '"string"' }
    if (
      attr.name === attrName &&
      attr.value &&
      typeof attr.value === "object" &&
      "value" in attr.value &&
      typeof (attr.value as { value: string }).value === "string"
    ) {
      const raw = (attr.value as { value: string }).value.trim();
      const quoted = raw.replace(/^["']|["']$/g, "");
      return quoted;
    }
  }
  return null;
}

function loc(node: MdastNode): string {
  if (!node.position) return "";
  return ` (line ${node.position.start.line})`;
}

function walk(node: MdastNode, visitor: (n: MdastNode, parent?: MdastNode) => void, parent?: MdastNode) {
  visitor(node, parent);
  for (const child of node.children ?? []) {
    walk(child, visitor, node);
  }
}

export function remarkMdxLint() {
  return function (tree: MdastNode, file: { message: (msg: string) => void; fail: (msg: string) => never }) {
    const idsSeen = new Map<string, number>();
    const errors: string[] = [];
    const warnings: string[] = [];

    walk(tree, (node, parent) => {
      if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return;

      const name = node.name ?? "";

      // no-duplicate-ids
      const id = getAttrValue(node, "id");
      if (id) {
        const prev = idsSeen.get(id);
        if (prev !== undefined) {
          errors.push(`no-duplicate-ids: id="${id}" used more than once${loc(node)}`);
        } else {
          idsSeen.set(id, node.position?.start.line ?? 0);
        }
      }

      // figure-requires-alt
      if (name === "Figure") {
        const alt = getAttrValue(node, "alt");
        if (!alt) {
          errors.push(`figure-requires-alt: <Figure> is missing a non-empty alt prop${loc(node)}`);
        }
      }

      // valid-widget-name
      if (name === "InteractiveWidget") {
        const widgetName = getAttrValue(node, "name");
        if (widgetName && !(VALID_WIDGET_NAMES as readonly string[]).includes(widgetName)) {
          errors.push(
            `valid-widget-name: <InteractiveWidget name="${widgetName}"> is not registered. Valid names: ${VALID_WIDGET_NAMES.join(", ")}${loc(node)}`
          );
        }
      }

      // callout-valid-type
      if (name === "Callout") {
        const type = getAttrValue(node, "type");
        if (type && !(VALID_CALLOUT_TYPES as readonly string[]).includes(type)) {
          errors.push(
            `callout-valid-type: <Callout type="${type}"> is invalid. Valid: ${VALID_CALLOUT_TYPES.join(", ")}${loc(node)}`
          );
        }
      }

      // comparison-column-children: ComparisonBlock must have at least one ComparisonColumn child
      if (name === "ComparisonBlock") {
        const cols = (node.children ?? []).filter(
          (c) =>
            (c.type === "mdxJsxFlowElement" || c.type === "mdxJsxTextElement") &&
            c.name === "ComparisonColumn"
        );
        if (cols.length === 0) {
          errors.push(
            `comparison-column-children: <ComparisonBlock> has no <ComparisonColumn> children${loc(node)}`
          );
        }
      }

      // timeline-item-parent: TimelineItem must be inside Timeline
      if (name === "TimelineItem") {
        const inTimeline =
          parent &&
          (parent.type === "mdxJsxFlowElement" || parent.type === "mdxJsxTextElement") &&
          parent.name === "Timeline";
        if (!inTimeline) {
          errors.push(
            `timeline-item-parent: <TimelineItem> must be a direct child of <Timeline>${loc(node)}`
          );
        }
      }

      // deprecated-component (warn only)
      // Extend this list as components are deprecated
      const DEPRECATED: Record<string, string> = {};
      if (name in DEPRECATED) {
        warnings.push(`deprecated-component: <${name}> is deprecated. ${DEPRECATED[name]}${loc(node)}`);
      }
    });

    for (const w of warnings) {
      file.message(w);
    }
    if (errors.length > 0) {
      file.fail(`MDX lint errors:\n${errors.map((e) => `  • ${e}`).join("\n")}`);
    }
  };
}
