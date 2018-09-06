import styled from 'styled-components'
import React from 'react'
import {Link} from 'react-router-dom'
import { darken } from 'polished'

import Triangle from '../util/triangle'

const Button = styled.div`
  margin: 0 32px;
  background-color: ${props => props.theme.button_color};

  position: relative;

  border-radius: 4px;
  box-shadow:0px 6px 0px 0px ${props => darken(0.2, props.theme.button_color)};
`

const ButtonText = styled.div`
  padding: 30px;
  text-align: center;
  color: #000;
  font-size: 1.5rem;

  /* To bring text in front of triangle */
  position: relative;
`

export default ({to, children}) => (
  <Button>
    <Link to={to} data-test='button-link'>
      <Triangle />
      <ButtonText data-test='button-text'>
        {children}
      </ButtonText>
    </Link>
  </Button>
)
