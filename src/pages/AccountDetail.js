import { Typography } from 'antd';
import DelegationList from '../components/DelegationList';
import {
    useParams,
    Link
} from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { BsGraphUp, BsGraphDown, BsWallet, BsLock } from "react-icons/bs";
import { getAsset, getTotalDelegate, getTotalUnbonding, getPrice, convertAsset } from '../helpers/getBalances';
import TxList from '../components/TxList';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

const { Title, Paragraph } = Typography;

const style = {
    container: {
        padding: 70,
        paddingTop: '7em',
        color: '#ffffff'
    },
    assetBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#26ff5c',
        backgroundColor: 'transparent',
    },
    assetChart: {
        borderRadius: '10px',
        backgroundColor: 'transparent',
        border: 'solid 2px #5dfc8a',
        padding: '1em'
    },
    asset: {
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#696969',
        fontFamily: 'montserrat',
        marginTop: '20px',
        backgroundColor: 'transparent',
    },
    assetButtonBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
    },
    delegation: {
        borderRadius: '30px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'montserrat',
        marginTop: '5rem',
    },
    button: {
        border: 0,
        borderRadius: '30px',
        width: '100%',
        marginBottom: 0,
        marginLeft: 0,
        fontFamily: 'montserrat',
        fontWeight: 600,
        backgroundColor: '#2e2c27',
        color: '#F6F3FB',
        padding: '2em',
        paddingTop: '1em',
        paddingBottom: '1em'
    },
    icon: {
        fontSize: '1.5rem',
    },
    li: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignContent: 'center',
        marginBottom: '0.5em',
    },
    iconDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignContent: 'stretch'
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'montserrat',
        marginBottom: '50px'
    },
}

const AccountDetail = ({ accounts }) => {
    const [show, setShow] = useState(false)
    const [showIbc, setShowIbc] = useState(false)
    const [selectAcc, setSelectAcc] = useState(0)
    const [asset, setAsset] = useState({
        balance: '',
        delegation: '',
        reward: '',
        unbonding: ''
    })
    const [reward, setReward] = useState([])
    const [delegation, setDelegation] = useState([])
    const [total, setTotal] = useState(0)
    let { id } = useParams();

    const wrapSetShowTransferModal = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const wrapSetShowIBCTransferModal = useCallback((val) => {
        setShowIbc(val)
    }, [setShowIbc])

    const handleClose = () => {
        setShow(false)
    }

    const handleClick = () => {
        setShow(true)
    }

    const handleClickIbc = () => {
        setShowIbc(true)
    }

    const handleCloseIbc = () => {
        setShowIbc(false)
    }


    useEffect(() => {
        (async () => {
            accounts.map((account, index) => {
                if (account.type === 'keplr') {
                    if (account.account.address === id) {
                        setSelectAcc(index)
                    }
                }
                if (account.type === 'metamask') {
                    if (account.account === id) {
                        setSelectAcc(index)
                    }
                }
            })
            const asset = await getAsset(id)

            const balance = asset[0].length > 0 && asset[0][0].length > 0 ? asset[0][0][0].amount : 0
            const delegation = asset[1].delegation_responses.length > 0 ? getTotalDelegate(asset[1].delegation_responses) : 0
            const reward = asset[2].total.length > 0 ? asset[2].total[0].amount : 0
            const unbonding = asset[3].unbonding_responses.length > 0 ? getTotalUnbonding(asset[3].unbonding_responses) : 0

            setAsset({
                balance,
                delegation,
                reward,
                unbonding
            })

            const res = await getPrice()
            const usd = 0

            const totalAsset = convertAsset(balance, delegation, reward, unbonding, usd)

            setTotal(totalAsset)
            setDelegation([...asset[1].delegation_responses])
            setReward([...asset[2].rewards])
        })()
    }, [id])

    return (
        <div style={style.container}>
            <div style={{
                textAlign: 'left',
                fontSize: '36px',
                color: '#ffffff',
                fontFamily: 'montserrat',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                Detail
            </div>
            <div style={style.breadcrumb}>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    <Link to='/accounts' style={{ color: '#ffffff', fontWeight: 500 }}>
                        Accounts
                    </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {' / '}
                </span>
                <span style={{ color: '#26ff5c' }}>
                    Details
                </span>
            </div>
            <div style={{ ...style.asset, backgroundColor: 'transparent' }}>
                <div style={style.assetBlock}>
                    <Title style={{ color: '#26ff5c', fontSize: '36px', fontWeight: 'bold', fontFamily: 'montserrat' }}>
                        Assets
                    </Title>
                </div>
                <div style={style.assetChart}>
                    <div
                        className='asset-block'
                    >
                        <div
                            className='chart'
                        >
                            <Doughnut data={{
                                labels: [
                                    'Balance',
                                    'Delegation',
                                    'Reward',
                                    'Unbonding'
                                ],
                                datasets: [{
                                    data: [
                                        parseInt(asset.balance) / 1000000 ,
                                        parseInt(asset.delegation) / 1000000 ,
                                        parseInt(asset.reward) / 1000000 ,
                                        parseInt(asset.unbonding) / 1000000
                                    ],
                                    backgroundColor: [
                                        'rgb(61, 255, 148)',
                                        'rgb(140, 129, 252)',
                                        'rgb(255, 174, 97)',
                                        'rgb(255, 174, 97)'
                                    ],
                                    hoverOffset: 4
                                }]
                            }} />
                        </div>
                        <ul style={{
                            textAlign: 'left',
                            margin: 0,
                            padding: '2em',
                            listStyleType: 'none',
                            textAlign: 'left',
                            fontSize: '1.25rem',
                            width: '100%',
                            borderRadius: '20px'
                        }}>
                            <li style={style.li}>
                                <div style={style.iconDiv}>
                                    <div style={{ backgroundColor: 'rgb(61, 255, 148)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                        <BsWallet style={{ ...style.icon, color: '#93A98D' }} />
                                    </div>
                                    <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                        <span style={{
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            lineheight: 'normal',
                                            marginTop: '0.5em',
                                            fontWeight: 'bold',
                                            color: '#ffffff'
                                        }}>
                                            Balance
                                        </span>
                                    </p>
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em',
                                        color: '#ffffff'
                                    }}>
                                        {parseInt(asset.balance) / 1000000 || 0} AN1
                                    </span>
                                </div>
                            </li>
                            <li style={style.li}>
                                <div style={style.iconDiv}>
                                    <div style={{ backgroundColor: 'rgb(140, 129, 252)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                        <BsLock style={{ ...style.icon, color: '#0B1321' }} />
                                    </div>
                                    <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                        <span style={{
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            lineheight: 'normal',
                                            marginTop: '0.5em',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                        }}>
                                            Delegation
                                        </span>
                                    </p>
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em',
                                        color: '#ffffff',
                                    }}>
                                        {parseInt(asset.delegation) / 1000000 || 0} AN1
                                    </span>
                                </div>
                            </li>
                            <li style={style.li}>
                                <div style={style.iconDiv}>
                                    <div style={{ backgroundColor: 'rgb(255, 174, 97)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                        <BsGraphUp style={{ ...style.icon, color: '#AE8D4F' }} />
                                    </div>
                                    <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                        <span style={{
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            lineheight: 'normal',
                                            marginTop: '0.5em',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                        }}>
                                            Reward
                                        </span>
                                    </p>
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em',
                                        color: '#ffffff'
                                    }}>
                                        {parseInt(asset.reward) / 1000000 || 0} AN1
                                    </span>
                                </div>
                            </li>
                            <li style={style.li}>
                                <div style={style.iconDiv}>
                                    <div style={{ backgroundColor: 'rgb(255, 115, 116)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                        <BsGraphDown style={{ ...style.icon, color: '#BD6B5A' }} />
                                    </div>
                                    <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                        <span style={{
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            lineheight: 'normal',
                                            marginTop: '0.5em',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                        }}>
                                            Unbonding
                                        </span>
                                    </p>
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em',
                                        color: '#ffffff'
                                    }}>
                                        {parseInt(asset.unbonding) / 1000000 || 0} AN1
                                    </span>
                                </div>
                            </li>
                            <li>
                                <hr style={{ color: '#ffffff', fontWeight: 'bold', }} />
                            </li>
                            <li style={{ ...style.li, justifyContent: 'end' }}>
                                <div style={{ fontWeight: 600, fontSize: '1.5rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        color: '#ffffff'
                                    }}>
                                        Total {total}$
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div style={{ ...style.delegation, marginTop: '4em', paddingTop: 0 }}>
                <DelegationList address={id} type={accounts[selectAcc] && accounts[selectAcc].type} delegations={delegation} rewards={reward} />
            </div>
            <div style={{ ...style.delegation, marginTop: '4em', paddingTop: 20 }}>
                <TxList address={id} />
            </div>
        </div>
    )
}

export default AccountDetail