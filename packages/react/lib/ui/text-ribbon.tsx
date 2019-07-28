import { EditUiControls, EditUiButton } from "./atoms";
import React from "react";
import { LinkIcon } from "./icons";
import { noop } from "../util";
import { useModal, FieldModal } from "./modal";

interface TextRibbonProps {
  value?: TextStyle
  onChange?: (value?: TextStyle) => void
  onModalClosed?: () => void
  onModalOpened?: () => void
}

export interface TextStyle {
  strong?: boolean
  em?: boolean
  link?: string
}

export const TextRibbon = ({ value = {}, onModalClosed, onModalOpened, onChange = noop }: TextRibbonProps) => {
  const linkModal = useModal({
    onClose: onModalClosed,
    onOpen: onModalOpened
  })

  const { strong, em, link } = value

  const toggle = (key: 'strong' | 'em') => (event) => {
    onChange({ ...value, [key]: !value[key] })
  }

  const setLink = (link?: string) => {
    onChange({ ...value, link })
    linkModal.close()
  }

  return (
    <>
      <FieldModal
        prompt="Link URL"
        state={linkModal}
        value={value.link}
        onChange={setLink}
      >
        {
          value.link && (
            <EditUiButton type="button" onClick={() => setLink(undefined)}>
              Remove
            </EditUiButton>
          )
        }
      </FieldModal>

      <EditUiControls>
        <EditUiButton onMouseDown={preventFocus} onClick={toggle('strong')} selected={strong}><strong>B</strong></EditUiButton>
        <EditUiButton onMouseDown={preventFocus} onClick={toggle('em')} selected={em}><em>I</em></EditUiButton>
        <EditUiButton onMouseDown={preventFocus} onClick={linkModal.open} selected={Boolean(link)}><LinkIcon /></EditUiButton>
      </EditUiControls>
    </>
  )
}

const preventFocus = e => {
  e.preventDefault()
}
