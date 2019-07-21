import { ReactNode, ComponentType } from "react";

export interface CmsAuthProvider {
  loginUi: ComponentType<CmsLoginUiProps>
  init: () => Promise<string | undefined>
}

export interface CmsLoginUiProps { onLogin: (props: { token: string }) => void }

export interface CmsDeployTarget {
  publish(): Promise<void>
}

export interface CmsBackend {
  // listRevisions(): Promise<CmsRevision>
  getRevision(id?: string): Promise<CmsRevision>
  createRevision(revision: Omit<CmsRevision, 'id'>): Promise<CmsRevision>
  putRevision(revision: CmsRevision): Promise<void>
  setPublishedRevision(id: string): Promise<void>
  getPublishedRevisionId(): Promise<string>
}

export interface CmsRevisionProps {
  content: any
}

export interface CmsRevision extends CmsRevisionProps {
  id: string
  timestamp: number
}
