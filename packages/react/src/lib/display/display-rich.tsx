import  React, { createElement, HTMLAttributes, DOMAttributes, ReactHTML, ReactSVG, ClassAttributes, ComponentType } from "react";
import createPurify from 'dompurify'
import parse, { DomElement, domToReact } from 'html-react-parser'
import { useContent } from "../content";
import { RichEditor } from "../editor/rich-editor";
import { RichText } from "@invisible-cms/core";

const purify = createPurify()

interface DisplayRichTextProps extends HTMLAttributes<{}> {
  tagName?: string
  customElements?: Partial<Record<HtmlElementName, ElementClass>>
}

type HtmlElementName = keyof ReactHTML & keyof ReactSVG
type ElementClass = ComponentType<ClassAttributes<{}>>

export const DisplayRichText = ({ tagName = 'div', customElements ={}, ...props }: DisplayRichTextProps) => {
  const content = useContent<RichText>()
  const html = purify.sanitize(content.value && content.value.__html || '')

  if (process.env.REACT_APP_CMS_NOADMIN || !content.editable) {
    const parseOpts = {
      replace: (node: DomElement) => {
        const CustomElement = customElements[node.name]
        console.log(node.attribs)
        if (CustomElement) {
          console.log(node)
          return (
            <CustomElement {...node.attribs}>
              {domToReact(node.children, parseOpts)}
            </CustomElement>
          )
        }
      }
    }

    return createElement(tagName, props, parse(html, parseOpts))
  }

  return (
    <RichEditor
      {...props}
      tagName={tagName}
      value={{ __html: html }}
      onChange={content.onChange}
    />
  )
}
