import styled from 'styled-components'
import React from 'react'
import {Link} from 'react-router-dom'
import cloud from '../cloud.svg'
import week from '../week.svg'
import sousaku from '../sousaku.svg'

const UpperHeading = styled.div`
  position: relative;
  height: ${props => props.theme.heading_height}rem;
  background-color: #e84393;
  color: white;
`

const LowerHeading = styled.div`
  position: relative;
  height: ${props => props.theme.heading_height}rem;
  background-color: #fd79a8;
  color: white;
`

const Title = styled.img`
  position: absolute;
  right: 5%;
  bottom: 20%;

  height: ${props => props.theme.heading_height - 1.5}rem;
`

const SubTitle = styled.img`
  position: absolute;
  right: 30%;
  bottom: 20%;

  height: ${props => props.theme.heading_height - 1.5}rem;
`

const Button = styled.div`
  margin: 0 32px;
  background-color: #00cec9;
`

const ButtonText = styled.div`
  padding: 30px;
  text-align: center;
  color: white;
`

const Cloud = styled.div`
  position: absolute;
  width: 40vw;
  left: -10%;
  top: -60%;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`

const Home = () => (
  <div>
    <UpperHeading>
      <Title src={week} />
    </UpperHeading>
    <LowerHeading>
      <Cloud>
        <img src={cloud} />
      </Cloud>
      <SubTitle src={sousaku} />
    </LowerHeading>
    <Container>
      <Button>
        <Link data-test='home-login' to='/lottery/login'>
          <ButtonText>
            <h3>QRコード読み取り</h3>
            <p>(カメラが起動します)</p>
          </ButtonText>
        </Link>
      </Button>
    </Container>
  </div>
)

export default Home
