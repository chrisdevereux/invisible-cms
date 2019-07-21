import React, { createElement } from "react";
import { useContent, placeholderContent, ContentType } from "./content";
import { ContentIterator } from "./content-item";

export const DisplayList = ({ tagName = 'div', itemType, children, ...props }) => {
  const content = useContent<any[]>()

  if (!content.editable) {
    return createElement(tagName, { props, children })
  }

  return (
    <ListEditor type={ContentType.list({ elementType: itemType })} tagName={tagName} elementProps={props} {...content}>
      <ContentIterator>
        {children}
      </ContentIterator>
    </ListEditor>
  )
}

const ListEditor = ({ tagName, value, onChange, type, elementProps, children  }) => {
  const onClick = () => {
    if (Array.isArray(value)) {
      onChange([...value, placeholderContent(type.elementType, value.length)])
    } else {
      onChange([placeholderContent(type.elementType)])
    }
  }

  return createElement(tagName, elementProps,
    <>
      <div style={{ padding: "1rem", position: 'absolute', right: 0, fontFamily: "sans-serif", fontSize: 10 }}>
        <button onClick={onClick}>
          Add {type.name}…
        </button>
      </div>

      {children}
    </>
  )
}
