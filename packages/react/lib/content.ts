import { createContext, useContext, createElement, PropsWithChildren, Children } from "react";
import { ContentPlaceholder } from "./content-placeholder";

export interface Content<T = {}> {
  value: T
  onChange: (x: T) => void
  onRemove?: () => void
  availableTypes?: ContentType[]
  label?: string
  editable: boolean
}

export interface ContentMapper<Src = {}, Dest = {}> {
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
  validator: (x: unknown) => boolean
}

export interface ContainerType extends ContentType {
  elementType: ContentType
}

export const ContentType = {
  title: (): ContentType => ({ name: 'title', placeholder: ContentPlaceholder.words(), validator: x => typeof x === 'string' }),
  rich: (): ContentType => ({ name: 'content', placeholder: ContentPlaceholder.sentence(), validator: x => typeof x === 'string' }),
  list: ({ elementType }): ContainerType => ({
    name: elementType.name + ' list',
    placeholder: () => [],
    elementType,
    validator: x => Array.isArray(x) && x.every(elementType.validator)
  }),
  tagged: ({ tag, name = tag, placeholder = (seed) => ({}) }) => ({
    name,
    placeholder: (seed) => ({ ...placeholder(seed), type: tag }),
    validator: x => x && x.type === tag,
  })
}

export const placeholderContent = (type: ContentType, seed = 0) => type.placeholder(seed)

export const ContentContext = createContext<Content<any>>(undefined)
export const ProvideContent = ({ children, ...value }: PropsWithChildren<Content<any>>) => createElement(ContentContext.Provider, {value}, ...Children.toArray(children))

export const useContent = <T>() => useContext<Content<T>>(ContentContext)
