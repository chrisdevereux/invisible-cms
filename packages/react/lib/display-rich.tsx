import  React, { createElement } from "react";
import createPurify from 'dompurify'
import { useContent } from "./content";
import { RichEditor } from "./editor/rich-editor";

const purify = createPurify()

export const DisplayRichText = ({ tagName = 'div', ...props }) => {
  const content = useContent<string>()
  const html = {
    __html: purify.sanitize(content.value) || ''
  }

  if (!content.editable) {
    return createElement(tagName, props, <div dangerouslySetInnerHTML={html} />)
  }

  return (
    <RichEditor
      {...props}
      tagName={tagName}
      value={html}
      onChange={({ __html }) => content.onChange(__html)}
    />
  )
}
