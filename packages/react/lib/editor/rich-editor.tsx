import { Editor, EditorState, ContentState, convertFromHTML, Modifier, SelectionState, RichUtils, CompositeDecorator, Entity } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html'
import React, { useState, useMemo, createElement, useEffect, useRef } from 'react';
import Popover from 'react-tiny-popover'
import { TextRibbon } from '../ui/text-ribbon';
import {  useDebounce } from '../util';

interface RichEditorProps {
  tagName: string
  value: RichText
  onChange: (value: RichText) => void
}

interface RichText {
  __html: string
}

export const RichEditor = ({ value, onChange, tagName, ...wrapperProps }: RichEditorProps) => {
  const editor = useRef<Editor>()

  const [focused, setFocused] = useState(false)
  const [editorState, setEditorState] = useState(
    value.__html
    ? EditorState.createWithContent(
      useMemo(() => importHtml(value), []),
      linkDecorator
    )
    : EditorState.createEmpty(linkDecorator)
  )

  let mounted = false
  useEffect(() => {
    if (!mounted) {
      return
    }

    mounted = true
    setEditorState(
      EditorState.forceSelection(
        EditorState.createWithContent(importHtml(value), linkDecorator),
        editorState.getSelection()
      )
    )
  }, [value, editorState])

  const dispatchChange = useDebounce(1000, (change: EditorState) => {
    onChange({
      __html: stateToHTML(change.getCurrentContent())
    })
  }, [onChange])

  const update = (change: EditorState) => {
    if (change.getCurrentContent() !== editorState.getCurrentContent()) {
      dispatchChange(change)
    }

    setEditorState(change)
  }

  const cursorStyle = {
    strong: editorState.getCurrentInlineStyle().has('BOLD'),
    em: editorState.getCurrentInlineStyle().has('ITALIC'),
    link: extractLink(editorState)
  }

  const setCursorStyle = (style) => {
    let next = editorState
    next = (style.em === cursorStyle.em) ? next : setInlineStyle(next, 'ITALIC', style.em)
    next = (style.strong === cursorStyle.strong) ? next : setInlineStyle(next, 'BOLD', style.strong)
    next = (style.link === cursorStyle.link) ? next : setLink(next, style.link)

    update(next)
  }

  const restoreFocus = () => {
    setFocused(true)
  }

  return (
    <>
      <Popover
        containerStyle={{ overflow: 'visible' }}
        align="start"
        position="top"
        isOpen={focused}
        content={
          <TextRibbon
            value={cursorStyle}
            onChange={setCursorStyle}
            onModalClosed={restoreFocus}
          />}
      >
        {createElement(
          tagName,
          wrapperProps,
          <Editor
            ref={editor}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            editorState={editorState}
            onChange={update}
          />
        )}
      </Popover>
    </>
  )
}

const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = Entity.get(props.entityKey).getData();
  return (
    <a href={url} onClick={e => e.preventDefault()}>
      {props.children}
    </a>
  );
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
])

const setLink = (editorState: EditorState, url?: string) => {
  if (url) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    return RichUtils.toggleLink(
      newEditorState,
      expandCollapsedSelectionToWord(editorState),
      entityKey
    )

  } else {
    let selection = editorState.getSelection();

    const contentState = editorState.getCurrentContent()
    const startKey = selection.getStartKey()
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey)

    selection = setStartOffset(selection, 0)
    selection = setEndOffset(selection, blockWithLinkAtBeginning.getLength())

    return RichUtils.toggleLink(
      editorState,
      selection,
      null
    )
  }
}

const extractLink = (editorState: EditorState) => {
  const selection = editorState.getSelection()

  const contentState = editorState.getCurrentContent()
  const startKey = selection.getStartKey()
  const startOffset = selection.getStartOffset()
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey)
  const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset)

  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey)
    return linkInstance.getData().url || undefined

  } else {
    return undefined
  }
}

const setInlineStyle = (state: EditorState, style: string, active: boolean) => {
  const selection = expandCollapsedSelectionToWord(state)

  const nextContent = active
  ? Modifier.applyInlineStyle(state.getCurrentContent(), selection, style)
  : Modifier.removeInlineStyle(state.getCurrentContent(), selection, style)

  return EditorState.forceSelection(
    EditorState.createWithContent(nextContent, linkDecorator),
    state.getSelection()
  )
}

const expandCollapsedSelectionToWord = (state: EditorState) => {
  let sel = state.getSelection()

  if (!sel.isCollapsed()) {
    return sel
  }

  const content = state.getCurrentContent().getBlockForKey(sel.getStartKey()).getText()

  while (sel.getStartOffset() > 0 && !isWhitespace(content[sel.getStartOffset() - 1])) {
    sel = setStartOffset(sel, sel.getStartOffset() - 1)
  }
  while (sel.getEndOffset() < content.length && !isWhitespace(content[sel.getEndOffset()])) {
    sel = setEndOffset(sel, sel.getEndOffset() + 1)
  }

  return sel
}

const isWhitespace = (x: string) => Boolean(x.match(/\s/))

const setStartOffset = (state: SelectionState, offset: number) => {
  return new SelectionState(state.getIsBackward() ? state.set('focusOffset', offset) : state.set('anchorOffset', offset))
}

const setEndOffset = (state: SelectionState, offset: number) => {
  return new SelectionState(state.getIsBackward() ? state.set('anchorOffset', offset) : state.set('focusOffset', offset))
}

const importHtml = ({ __html }: RichText) => {
  const blocksFromHTML = convertFromHTML(__html);

  return ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
}