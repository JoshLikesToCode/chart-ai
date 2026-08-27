import type { ComponentType } from "react";

export interface GenUIComponentProps {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
}

type GenUIMap = Record<string, ComponentType<GenUIComponentProps>>;

// Register gen-ui components for tool results here
// Example: { "generateDiagram": DiagramPreview }
const registry: GenUIMap = {};

export function registerGenUI(
  toolName: string,
  component: ComponentType<GenUIComponentProps>
) {
  registry[toolName] = component;
}

export function getGenUIComponent(
  toolName: string
): ComponentType<GenUIComponentProps> | null {
  return registry[toolName] ?? null;
}
