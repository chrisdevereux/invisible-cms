import ReactModal from "react-modal";
import React, { useState, ReactNode, useEffect } from "react";
import { useField } from 'react-jeff'
import { EditUiButton, FormPrompt, Paper, Columns } from "./atoms";
import { TextField, Form } from "./forms";
import { noop } from "../util";

interface PromptModalState {
  visible: boolean
  setVisible: (visible: boolean) => void
  close: () => void
  open: () => void
}

export const fixedOpenModal: PromptModalState = {
  visible: true,
  setVisible: noop,
  close: noop,
  open: noop
}

export const useModal = ({ onClose = noop, onOpen = noop } = {}) => {
  const [visible, setVisibleState] = useState(false)
  const setVisible = (visible: boolean) => {
    if (!visible) {
      onClose()
    } else {
      onOpen()
    }

    setVisibleState(visible)
  }

  return {
    visible,
    setVisible,
    close: () => setVisible(false),
    open: () => setVisible(true)
  }
}

interface ModalViewProps {
  state: PromptModalState
  children?: ReactNode
}

export const ModalView = ({ state, children }: ModalViewProps) => (
  <ReactModal
    isOpen={state.visible}
    style={modalStyle}
    ariaHideApp={false}
    onRequestClose={state.close}
  >
    <Paper>
      {children}
    </Paper>
  </ReactModal>
)

interface FieldModalProps extends ModalViewProps {
  prompt: string
  value: string
  onChange: (value: string) => void
}

export const FieldModal = ({ state, value, prompt, children, onChange, ...props }: FieldModalProps) => {
  const field = useField({ defaultValue: value || '' })
  useEffect(() => {
    field.setValue(value || '')
  }, [value])

  return (
    <ModalView state={state}>
      <Form
        onSubmit={() => {
          onChange(field.value)
          state.close()
        }}
      >
        <FormPrompt>
          {prompt}:
        </FormPrompt>
        <Columns>
          <TextField autoFocus field={field} {...props} />
          {children}
          <EditUiButton type="submit">Ok</EditUiButton>
        </Columns>
      </Form>
    </ModalView>
  )
}

const modalStyle = {
  content: {
    position: 'absolute',
    border: 'none',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    bottom: 'auto',
    right: 'auto'
  }
}