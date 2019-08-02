import React from 'react'
import { CmsRevision } from "@invisible-cms/core";

interface GlobalUiProps {
  revision: CmsRevision
  onPublish: () => void
  onSave: () => void
}

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'

export const GlobalUi =  ({ onPublish, onSave }: GlobalUiProps) => {
  return (
    <div style={{ borderRadius: 2, boxShadow: '0px 2px 5px 2px rgba(0,0,0,0.2)', textAlign: 'center', fontSize: 12, fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.5)', fontFamily: systemFont, bottom: 0, right: 0, margin: '1rem', padding: '1rem', position: 'fixed', zIndex: 16777271 }}>
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
