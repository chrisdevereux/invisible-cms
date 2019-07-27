import styled from 'styled-components'

const transparent = 'rgba(0,0,0,0)'
const semiDarkened = 'rgba(0,0,0,0.1)'
const darkened = 'rgba(0,0,0,0.2)'

interface ControlProps {
  selected?: boolean
}

const control = ({ selected }: ControlProps) => `
  box-sizing: border-box;
  font-size: 12px;
  outline: none;
  border: none;
  background-color: ${selected ? darkened : transparent};
  box-shadow: ${selected ? '0px 1px 2px rgba(0,0,0,0.2)' : transparent};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0px;
  min-width: 2rem;

  &:hover {
    background-color: ${selected ? darkened : semiDarkened};
    box-shadow: 0px 1px 2px rgba(0,0,0,0.1);
  }

  &:active,
  &:focus {
    outline: none;
  }
`

export const EditUiButton = styled.button`
  ${control}
`

export const EditUiSelect = styled.select`
  ${control}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="black" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>');
  background-repeat: no-repeat, repeat;
  background-position: right 1rem top 50%, 0 0;
  padding-right 2rem;
  background-size: .65em auto, 100%;
`

export const EditUiControls = styled.div`
  display: inline-block;
  background-color: rgba(255,255,255,0.8);
  box-shadow: 0px 1px 5px rgba(0,0,0,0.3);
`

export const HoverOver = styled.div`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  z-index: 1000;

  *:hover > & {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
  }
`
