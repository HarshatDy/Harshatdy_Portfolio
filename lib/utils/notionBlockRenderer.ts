/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Converts Notion block objects to HTML strings.
 * Uses Tailwind prose classes (prose-invert applied at the wrapper level).
 */

function richTextToHtml(richText: any[]): string {
  if (!richText?.length) return ''
  return richText
    .map((rt: any) => {
      let text = rt.plain_text ?? ''
      // Escape HTML
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const ann = rt.annotations ?? {}
      if (ann.bold) text = `<strong>${text}</strong>`
      if (ann.italic) text = `<em>${text}</em>`
      if (ann.strikethrough) text = `<del>${text}</del>`
      if (ann.underline) text = `<u>${text}</u>`
      if (ann.code) text = `<code class="notion-inline-code">${text}</code>`
      if (rt.href) text = `<a href="${rt.href}" target="_blank" rel="noopener">${text}</a>`
      return text
    })
    .join('')
}

function blockToHtml(block: any): string {
  const type = block.type
  const data = block[type] ?? {}

  switch (type) {
    case 'paragraph':
      return `<p>${richTextToHtml(data.rich_text)}</p>`

    case 'heading_1':
      return `<h1>${richTextToHtml(data.rich_text)}</h1>`

    case 'heading_2':
      return `<h2>${richTextToHtml(data.rich_text)}</h2>`

    case 'heading_3':
      return `<h3>${richTextToHtml(data.rich_text)}</h3>`

    case 'bulleted_list_item':
      return `<li>${richTextToHtml(data.rich_text)}</li>`

    case 'numbered_list_item':
      return `<li>${richTextToHtml(data.rich_text)}</li>`

    case 'quote':
      return `<blockquote>${richTextToHtml(data.rich_text)}</blockquote>`

    case 'code': {
      const lang = data.language ?? ''
      const code = richTextToHtml(data.rich_text)
      return `<pre><code class="language-${lang}">${code}</code></pre>`
    }

    case 'callout': {
      const emoji = data.icon?.emoji ?? 'ℹ️'
      return `<div class="notion-callout"><span class="notion-callout-icon">${emoji}</span><div>${richTextToHtml(data.rich_text)}</div></div>`
    }

    case 'divider':
      return '<hr/>'

    case 'image': {
      const src =
        data.type === 'external' ? data.external?.url : data.file?.url ?? ''
      const caption = richTextToHtml(data.caption ?? [])
      return `<figure><img src="${src}" alt="${caption || 'image'}" loading="lazy"/>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
    }

    case 'toggle':
      return `<details><summary>${richTextToHtml(data.rich_text)}</summary></details>`

    case 'table_of_contents':
      return '' // Skip TOC blocks

    case 'child_page':
      // Rendered as a link when encountered in content (not in tree building)
      return `<p><a href="#" class="notion-child-page">${data.title ?? 'Subpage'}</a></p>`

    default:
      return ''
  }
}

/**
 * Convert an array of Notion blocks to an HTML string.
 * Wraps consecutive list items in <ul> or <ol>.
 */
export function blocksToHtml(blocks: any[]): string {
  const parts: string[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    const type = block.type

    if (type === 'bulleted_list_item') {
      const items: string[] = []
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blockToHtml(blocks[i]))
        i++
      }
      parts.push(`<ul>${items.join('')}</ul>`)
    } else if (type === 'numbered_list_item') {
      const items: string[] = []
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blockToHtml(blocks[i]))
        i++
      }
      parts.push(`<ol>${items.join('')}</ol>`)
    } else {
      parts.push(blockToHtml(block))
      i++
    }
  }

  return parts.join('\n')
}

/** Extract plain text from all blocks — for newsletter content */
export function blocksToPlainText(blocks: any[]): string {
  return blocks
    .map((b: any) => {
      const data = b[b.type] ?? {}
      return (data.rich_text ?? []).map((rt: any) => rt.plain_text ?? '').join('')
    })
    .join('\n')
}
