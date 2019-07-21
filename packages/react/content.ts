import { createContext, useContext, createElement, PropsWithChildren, Children } from "react";
import { ContentPlaceholder } from "./content-placeholder";

export interface Content<T = {}> {
  value: T
  onChange: (x: T) => void
  label?: string
  editable: boolean
}

export interface ContentMapper<Src, Dest> {
  map: (x: Dest) => Src
  reverseMap: (x: Src) => Dest
}

export const ContentMapper = {
  identity: {
    map: <T>(x: T) => x,
    reverseMap: <T>(x: T) => x,
  }
}

export interface ContentType {
  name: string
  placeholder: ContentPlaceholder
}

export interface ContainerType extends ContentType {
  elementType: ContentType
}

export const ContentType = {
  title: (): ContentType => ({ name: 'title', placeholder: ContentPlaceholder.words() }),
  rich: (): ContentType => ({ name: 'content', placeholder: ContentPlaceholder.sentence() }),
  list: ({ elementType }): ContainerType => ({
    name: elementType.name,
    placeholder: ContentPlaceholder.array({ innerType: elementType }),
    elementType
  }),
}

export const placeholderContent = (type: ContentType, seed = 0) => type.placeholder(seed)

export const ContentContext = createContext<Content<any>>(undefined)

export const useContent = <T>() => useContext<Content<T>>(ContentContext)
export const ProvideContent = ({ children, ...value }: PropsWithChildren<Content<any>>) => createElement(ContentContext.Provider, {value}, ...Children.toArray(children))
