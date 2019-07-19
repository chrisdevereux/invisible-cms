import React from 'react'
import { CmsRevision } from "@invisiblecms/core";

interface GlobalUiProps {
  revision: CmsRevision
  onPublish: () => void
}

export const GlobalUi =  ({ onPublish }: GlobalUiProps) => {
  return (
    <div style={{ textAlign: 'center', fontSize: 10, backgroundColor: 'tomato', fontFamily: 'sans-serif', bottom: 0, right: 0, margin: '1rem', padding: '1rem', position: 'fixed', zIndex: 16777271 }}>
      <div style={{ marginBottom: '0.5rem' }}>INVISIBLECMS</div>
      <button onClick={onPublish}>
        Publish
      </button>
    </div>
  )
}
