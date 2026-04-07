/**
 * Quill Delta JSON → TipTap ProseMirror JSON converter.
 *
 * Existing notes are stored as Quill Delta JSON. TipTap uses ProseMirror's
 * document model. This module handles detection and conversion between formats.
 */

interface DeltaOp {
  insert?: string | Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}

/**
 * Check if content string is Quill Delta format (has `ops` array).
 */
export function isDeltaFormat(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed?.ops);
  } catch {
    return false;
  }
}

/**
 * Check if content string is ProseMirror/TipTap format (has `type: "doc"`).
 */
export function isTipTapFormat(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return parsed?.type === 'doc';
  } catch {
    return false;
  }
}

/**
 * Convert Quill Delta JSON string to TipTap ProseMirror JSON object.
 */
export function deltaToTipTapJson(deltaJson: string): ProseMirrorNode {
  const delta = JSON.parse(deltaJson);
  const ops: DeltaOp[] = delta.ops ?? [];

  const doc: ProseMirrorNode = { type: 'doc', content: [] };
  let currentParagraph: ProseMirrorNode = { type: 'paragraph', content: [] };

  for (const op of ops) {
    if (typeof op.insert !== 'string') continue;

    const text = op.insert;
    const attrs = op.attributes ?? {};

    // Newlines split paragraphs / create list items
    if (text === '\n') {
      if (attrs.list) {
        const listType = attrs.list === 'ordered' ? 'orderedList' :
                         attrs.list === 'bullet' ? 'bulletList' :
                         'taskList';

        const listItem: ProseMirrorNode = listType === 'taskList'
          ? { type: 'taskItem', attrs: { checked: attrs.list === 'checked' }, content: [currentParagraph] }
          : { type: 'listItem', content: [currentParagraph] };

        // Check if last doc node is same list type, if so append
        const lastNode = doc.content![doc.content!.length - 1];
        if (lastNode?.type === listType) {
          lastNode.content!.push(listItem);
        } else {
          doc.content!.push({ type: listType, content: [listItem] });
        }
      } else {
        // Apply paragraph-level attributes
        if (attrs.align) {
          currentParagraph.attrs = { textAlign: attrs.align };
        }
        doc.content!.push(currentParagraph);
      }
      currentParagraph = { type: 'paragraph', content: [] };
      continue;
    }

    // Split by newlines within the text
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        doc.content!.push(currentParagraph);
        currentParagraph = { type: 'paragraph', content: [] };
      }

      if (lines[i].length > 0) {
        const textNode: ProseMirrorNode = { type: 'text', text: lines[i] };
        const marks: { type: string; attrs?: Record<string, unknown> }[] = [];
        if (attrs.bold) marks.push({ type: 'bold' });
        if (attrs.italic) marks.push({ type: 'italic' });
        if (attrs.underline) marks.push({ type: 'underline' });
        if (attrs.strike) marks.push({ type: 'strike' });
        if (marks.length > 0) textNode.marks = marks;
        currentParagraph.content!.push(textNode);
      }
    }
  }

  // Push any remaining paragraph
  if (currentParagraph.content!.length > 0) {
    doc.content!.push(currentParagraph);
  }

  // Ensure doc has at least one paragraph
  if (doc.content!.length === 0) {
    doc.content!.push({ type: 'paragraph' });
  }

  return doc;
}

/**
 * Extract plain text from a TipTap/ProseMirror JSON document.
 */
export function tipTapJsonToPlainText(doc: ProseMirrorNode): string {
  const lines: string[] = [];

  function extractText(node: ProseMirrorNode): void {
    if (node.text) {
      lines.push(node.text);
      return;
    }
    if (node.content) {
      for (const child of node.content) {
        extractText(child);
      }
      // Add newline after block-level nodes
      if (['paragraph', 'heading', 'listItem', 'taskItem'].includes(node.type)) {
        lines.push('\n');
      }
    }
  }

  extractText(doc);
  return lines.join('').trim();
}

/**
 * Parse content string, auto-detecting format.
 * Returns TipTap JSON object ready for editor.setContent().
 */
export function parseNoteContent(content: string): ProseMirrorNode | null {
  if (!content) return null;

  if (isTipTapFormat(content)) {
    return JSON.parse(content);
  }

  if (isDeltaFormat(content)) {
    return deltaToTipTapJson(content);
  }

  // Plain text fallback
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }],
  };
}
