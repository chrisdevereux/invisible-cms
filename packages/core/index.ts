import { ReactNode, ComponentType } from "react";
import { Readable } from "stream";

export interface CmsAuthProvider {
  loginUi: ComponentType<CmsLoginUiProps>
  init: () => Promise<string | undefined>
}

export interface CmsLoginUiProps { onLogin: (props: { token: string }) => void }

export interface CmsDeployTarget {
  publish(): Promise<void>
}

export interface CmsBackend {
  putFile(file: Readable, contentType: string): Promise<CmsFileRef>
  createPageRevision(page: string, revision: CmsRevisionProps): Promise<CmsRevision>
  getPageRevision(page: string, revisionId?: string): Promise<CmsRevision>
  putPageRevision(page: string, revisionId: string, content: CmsRevisionProps): Promise<CmsRevision>
  getPublishedPageRevision(page: string): Promise<CmsRevision>
  publish(page: string, id: string): Promise<void>
}

export interface CmsRevisionProps {
  content: any
}

export interface CmsFileRef {
  url: string
}

export interface CmsRevision extends CmsRevisionProps {
  id: string
  timestamp: number
}
