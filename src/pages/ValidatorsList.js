import { useEffect, useState, useCallback } from 'react';
import { Image, } from 'antd';
import { getValidators, getLogo } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import "@fontsource/montserrat"
import PacmanLoader from "react-spinners/PacmanLoader";
import notFound from '../assets/img/no-profile.png'
import { Modal, } from 'react-bootstrap';
import DelegateModal from '../components/DelegateModal';
import { getKeplr, } from '../helpers/getKeplr';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import aos from 'aos';

const style = {
    table: {
        width: '100%',
        borderSpacing: '0 1em',
        borderCollapse: 'separate'
    },
    tblHeader: {
        backgroundColor: 'transparent',
    },
    tblContent: {
        borderRadius: '50px',
    },
    th: {
        padding: '10px 10px',
        textAlign: 'left',
        fontWeight: 900,
        fontSize: '24px',
        color: '#5dfc8a',
        textTransform: 'uppercase',
        fontFamily: 'montserrat',
    },
    td: {
        padding: '0.7em',
        paddingLeft: '1em',
        paddingRight: '1em',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: 700,
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'montserrat',
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'montserrat',
        paddingBottom: '0.5em'
    },
}

const ValidatorsList = () => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [defaultVal, setDefaultVal] = useState(0)
    const [state, setState] = useState('')
    const [dummy, setDummy] = useState([])

    useEffect(() => {
        (async () => {
            aos.init({
                duration: 1000
            })
            setLoading(true)
            let vals = await getValidators(true)
            const totalSupply = getTotal(vals)
            vals = vals.filter(x => x)
            if (vals.length > 0) {
                let logoList = []
                let urls = []
                vals.map((val) => {
                    val.votingPowerPercentage = parseFloat(val.delegator_shares * 100 / totalSupply).toFixed(2)
                    urls.push(val.description.identity)
                })

                // Load avt from key
                let promise = Promise.resolve()
                urls.forEach((url, index) => {
                    promise = promise.then(() => new Promise(resolve => {
                        getLogo(url).then(img => {
                            img ? vals[index].logo = img : vals[index].logo = notFound
                            resolve()
                        }).catch(() => {
                            vals[index].logo = notFound
                            resolve()
                        })
                        setDummy([...logoList])
                    }))
                })
            }
            setValidators([...vals])
            setLoading(false)
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const handleClick = async (index) => {
        if (!localStorage.getItem('accounts')) {
            const { accounts } = await getKeplr('dig-1')
            localStorage.setItem('accounts', JSON.stringify([{ account: accounts[0], type: 'keplr' }]))
        }
        setDefaultVal(index)
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleOver = (e) => {
        e.target.style.backgroundColor = 'rgb(242, 242, 242, 0.7)'
    }

    const handleLeave = (e) => {
        e.target.style.backgroundColor = 'transparent'
    }


    const handleSort = () => {
        if (state === 'desc') {
            setState('asc')
            setValidators([...validators.sort((x, y) => x.delegator_shares - y.delegator_shares)])
        }
        else if (state === 'asc') {
            setState('desc')
            setValidators([...validators.sort((x, y) => y.delegator_shares - x.delegator_shares)])
        }
        else {
            setState('desc')
            setValidators([...validators.sort((x, y) => y.delegator_shares - x.delegator_shares)])
        }
    }

    return (
        !loading ? (
            <div style={{ padding: 70, paddingTop: '7em' }}>
                <div style={{
                    textAlign: 'left',
                    fontSize: '36px',
                    color: '#ffffff',
                    fontFamily: 'montserrat',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
                    VALIDATOR
                </div>
                <div>
                    <table style={style.table}>
                        <thead style={style.tblHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '40%' }}>Validator</th>
                                <th style={{ ...style.th, width: '20%', textAlign: 'center' }}>
                                    <button style={{
                                        backgroundColor: 'transparent',
                                        border: 0,
                                        textTransform: 'uppercase',
                                        fontFamily: 'montserrat',
                                        fontWeight: 'bold',
                                        padding: 10,
                                        borderRadius: '24px'
                                    }} onMouseEnter={handleOver}
                                        onMouseLeave={handleLeave}
                                        onClick={handleSort}>
                                        Voting power
                                        {state === 'desc' ? <CaretDownOutlined /> : state === 'asc' && <CaretUpOutlined />}
                                    </button>
                                </th>
                                <th style={{ ...style.th, width: '20%', textAlign: 'center' }}>Commision</th>
                                <th style={{ ...style.th, width: '20%', borderRight: 0, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tblContent}>
                            {validators.map((val, index) => {
                                return (
                                    <tr key={index} style={{ backgroundColor: 'transparent', marginBottom: 20, }}>
                                        <td style={{ ...style.td, borderRadius: '10px 0 0 10px', border: 'solid 2px #26ff5c', borderRight: 'none' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div
                                                    data-aos="flip-up"
                                                    data-aos-once={true}
                                                    style={{
                                                        borderRadius: '50%',
                                                        
                                                    }}>
                                                    <Image
                                                        width={50}
                                                        src={val.logo || notFound}
                                                        style={{ borderRadius: '50%', marginTop: '3px' }}
                                                        preview={false}
                                                    />
                                                </div>
                                                <div style={{ marginLeft: '1rem' }} >
                                                    <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>{val.description.moniker}</div>
                                                    <div style={{ fontSize: '15px', fontWeight: 400, opacity: 0.6 }}>{val.description.website ? val.description.website : val.description.identity}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'center', border: 'solid 2px #26ff5c', borderRight: 'none', borderLeft: 'none' }}>
                                            <div>{`${parseInt(val.delegator_shares / 1000000)} AN1`}</div>
                                            <div style={{ fontSize: '15px', opacity: 0.6 }}>{`${val.votingPowerPercentage} %`} </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'center', border: 'solid 2px #26ff5c', borderRight: 'none', borderLeft: 'none' }}>{`${val.commission.commission_rates.rate * 100} %`}</td>
                                        <td style={{ ...style.td, textAlign: 'center', borderRadius: '0 10px 10px 0', border: 'solid 2px #26ff5c', borderLeft: 'none', color: '#ffffff' }}>
                                            <button style={{
                                                backgroundColor: 'rgb(99, 27, 242)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '1em',
                                                fontSize: '15px',
                                                fontWeight: 700,
                                                boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)'
                                            }} onClick={async () => await handleClick(index)}>
                                                Delegate
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <>
                    <Modal show={show} onHide={handleClose} backdrop="static" >
                        <Modal.Header style={{
                            backgroundColor: '#4D4D4D',
                            color: '#5dfc8a',
                            fontFamily: 'montserrat',
                            fontSize: '20px',
                            fontWeight: 400,
                            border: 0
                        }}>
                            <div>
                                Delegate Token
                            </div>
                        </Modal.Header>
                        <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                            <DelegateModal validators={validators} wrapSetter={wrapSetShow} defaultVal={defaultVal} />
                        </Modal.Body>
                    </Modal>
                </>
            </div >
        ) : (
            <div style={{ marginRight: '10rem', paddingTop: '10rem', height: '77vh' }}>
                <PacmanLoader color={'#7aff9e'} loading={loading} size={100} />
            </div>
        )
    )
}

export default ValidatorsList
