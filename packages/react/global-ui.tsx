import React from 'react'
import { CmsRevision } from "@invisible-cms/core";

interface GlobalUiProps {
  revision: CmsRevision
  onPublish: () => void
  onSave: () => void
}

export const GlobalUi =  ({ onPublish, onSave }: GlobalUiProps) => {
  return (
    <div style={{ textAlign: 'center', fontSize: 10, backgroundColor: 'tomato', fontFamily: 'sans-serif', bottom: 0, right: 0, margin: '1rem', padding: '1rem', position: 'fixed', zIndex: 16777271 }}>
      <div style={{ marginBottom: '0.5rem' }}>invisible-cms</div>
      <button style={{ marginRight: '0.5rem' }} onClick={onSave}>
        Save
      </button>
      <button onClick={onPublish}>
        Publish
      </button>
    </div>
  )
}
