import './App.css';
import { Modal, } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import AccountDetail from './pages/AccountDetail';
import { getKeplr } from './helpers/getKeplr';
import ValidatorsList from './pages/ValidatorsList';
import {
  Routes,
  Route,
  Link,
  NavLink,
  useLocation
} from "react-router-dom";
import logo from './assets/img/another1_logo.png';
import keplrLogo from './assets/img/keplr.png'
import { Image, message } from 'antd';
import { GithubFilled, } from '@ant-design/icons'
import "@fontsource/montserrat"
import AccountList from './pages/AccountList';
import ProposalList from './pages/ProposalList';
import { FaDiscord } from "react-icons/fa";
import ProposalDetail from './pages/ProposalDetail';
import FrontPage from './pages/FrontPage';
import Airdrop from './pages/Airdrop';

const style = {
  button: {
    marginTop: '5rem',
  },
  divButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  navbar: {
    padding: 50,
    paddingTop: 0,
    paddingBottom: 50,
    backgroundColor: '#4D4D4D',
    position: 'fixed',
    zIndex: 1,
    top: 0,
    left: 0,
    overflowX: 'hidden',
    width: '300px'
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    verticalAlign: 'center',
    textAlign: 'left',
    paddingLeft: 0
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
  },
  contact: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    padding: 90,
    paddingTop: 0,
    paddingBottom: 0
  },
  li: {
    textAlign: 'left',
    paddingBottom: '2em'
  },
  contactText: {
    color: '#ffffff',
    fontSize: '16px'
  }
}

const App = () => {
  const [accounts, setAccounts] = useState(JSON.parse(localStorage.getItem('accounts')) || [])
  const [show, setShow] = useState(false)
  let location = useLocation();

  const wrapSetShow = useCallback((val) => {
    setShow(val)
  }, [setShow])

  const wrapSetAccounts = useCallback((val) => {
    setAccounts([...val])
  }, [setAccounts])

  const handleClose = () => {
    setShow(false)
  }

  const warning = (val) => {
    message.warning(val, 1)
  }

  const handleEnter = (e) => {
    e.target.style.color = '#5dfc8a'
  }

  const handleLeave = (e, tabName) => {
    if (!location.pathname.includes(tabName)) {
      e.target.style.color = '#ffffff'
    }
  }

  const connect = async (val) => {
    if (val === 'keplr') {
      const { accounts } = await getKeplr()
      if (accounts !== null) {
        if (!localStorage.getItem('accounts')) {
          localStorage.setItem('accounts', JSON.stringify([{ account: accounts[0], type: 'keplr' }]))
          setAccounts([{ account: accounts[0], type: 'keplr' }])
        }
        else if (localStorage.getItem('accounts')) {
          let accountsList = JSON.parse(localStorage.getItem('accounts'))
          if (accountsList.filter(acc => acc.account.address === accounts[0].address).length === 0) {
            accountsList.push({ account: accounts[0], type: 'keplr' })
            localStorage.setItem('accounts', JSON.stringify(accountsList))
            setAccounts([...accountsList])
            warning('Success')
          }
          else {
            warning('This wallet account already exist')
          }
        }
      }
    }
  }

  return (
    <div className="App">
      <div style={style.navbar}>
        <div style={{
          textAlign: 'left',
          borderBottom: 'solid 2px #5dfc8a',
          padding: 50,
          paddingLeft: 0,
          paddingRight: 100
        }}>
          <Link to='/'>
            <Image width={90}
              src={logo}
              preview={false}
            />
          </Link>
        </div>
        <div className='nav-bar'>
          <ul
            className='nav-button'
            style={{ listStyleType: 'none', alignItems: 'left' }}>
            <li style={style.li}>
              <NavLink to='/accounts'>
                <button style={{
                  fontSize: '20px',
                  backgroundColor: 'transparent',
                  color: location.pathname.includes('/accounts') ? '#5dfc8a' : '#ffffff',
                  padding: 0,
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: 0,
                  fontFamily: 'montserrat',
                  lineHeight: '100%',
                  fontStyle: 'regular',
                  fontWeight: 'bold'
                }} className='nav-link'>
                  Accounts
                </button>
              </NavLink>
            </li>
            <li style={style.li}>
              <NavLink to='/staking'>
                <button style={{
                  fontSize: '20px',
                  backgroundColor: 'transparent',
                  color: location.pathname.includes('/staking') ? '#5dfc8a' : '#ffffff',
                  padding: 0,
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: 0,
                  fontFamily: 'montserrat',
                  lineHeight: '100%',
                  fontStyle: 'regular',
                  fontWeight: 'bold'
                }} className='nav-link'>
                  Staking
                </button>
              </NavLink>
            </li>
            <li style={style.li}>
              <NavLink to='/proposals'>
                <button style={{
                  fontSize: '20px',
                  backgroundColor: 'transparent',
                  color: location.pathname.includes('/proposals') ? '#5dfc8a' : '#ffffff',
                  padding: 0,
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: 0,
                  fontFamily: 'montserrat',
                  lineHeight: '100%',
                  fontStyle: 'regular',
                  fontWeight: 'bold'
                }} className='nav-link'>
                  Proposals
                </button>
              </NavLink>
            </li>
            <li style={style.li}>
              <NavLink to='/airdrop'>
                <button style={{
                  fontSize: '20px',
                  backgroundColor: 'transparent',
                  color: location.pathname.includes('/airdrop') ? '#5dfc8a' : '#ffffff',
                  padding: 0,
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: 0,
                  fontFamily: 'montserrat',
                  lineHeight: '100%',
                  fontStyle: 'regular',
                  fontWeight: 'bold'
                }} className='nav-link'>
                  Airdrop
                </button>
              </NavLink>
            </li>
            <li style={style.li}>
              <ConnectButton wrapSetShow={wrapSetShow} />
            </li>
          </ul>
        </div>
        <div style={{
          marginTop: '120px'
        }}>
          <p style={{
            color: '#ffffff',
            fontSize: '24px',
            textAlign: 'left'
          }}>Contact</p>
          <ul style={{ ...style.tabButton, listStyleType: 'none', }}>
            <li style={{
              fontSize: '2rem',
              color: '#ffffff',
              marginRight: '1em',
            }}>
              <a href='https://github.com/notional-labs' target='_blank'>
                <GithubFilled style={{ color: '#ffffff', fontSize: '30px', marginRight: '20px' }} />
                <span style={style.contactText}>
                  Github
                </span>
              </a>
            </li>
            <li style={{
              fontSize: '2.5rem',
              color: '#ffffff',
              marginRight: '1em',
            }}>
              <a href='https://discord.gg/UTNjQbGA' target='_blank'>
                <FaDiscord style={{ color: '#ffffff', fontSize: '30px', marginRight: '20px' }} />
                <span style={style.contactText}>
                  Discord
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ margin: '0 auto', width: '100%', overflow: 'hidden', position: 'relative', marginLeft: '300px' }}>
        <div style={{position: 'relative', zIndex: 1}}>
          <Routes>
            <Route exact path="/" element={<FrontPage />} />
            <Route exact path="/staking" element={<ValidatorsList />} />
            <Route exact path="/accounts" element={<AccountList accounts={accounts} wrapSetAccounts={wrapSetAccounts} />} />
            <Route exact path="/accounts/:id" element={<AccountDetail accounts={accounts} />} />
            <Route exact path="/proposals" element={<ProposalList accounts={accounts} />} />
            <Route exact path="/proposals/:id" element={<ProposalDetail accounts={accounts} />} />
            <Route exact path="/airdrop" element={<Airdrop accounts={accounts}/>} />
          </Routes>
        </div>
      </div>
      <>
        <Modal className="border-radius-20" show={show} onHide={handleClose} centered={true}>
          <Modal.Header style={{
            backgroundColor: '#4D4D4D',
            color: '#5dfc8a',
            fontFamily: 'montserrat',
            fontSize: '24px',
            border: 0,
            padding: '20px',
            paddingTop: '10px',
            paddingBottom: '10px'
          }}
          >
            <Modal.Title>Connect Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#4D4D4D', padding: '20px', paddingTop: 0 }}>
            <div style={style.divButton}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: 0,
                borderBottom: 'solid 1px #ffffff'
              }}
                onClick={async () => {
                  await connect('keplr')
                  setShow(false)
                }}>
                <div style={style.buttonContent}>
                  <div>
                    <Image width={50}
                      src={keplrLogo}
                      preview={false} />
                  </div>
                  <div style={{ marginLeft: '25px', fontSize: '1.5rem', }}>
                    <p style={{ margin: 0, textAlign: 'left' }}>Keplr</p>
                    <p style={{ fontSize: '0.75rem', }}>
                      Keplr browser extension
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default App;
