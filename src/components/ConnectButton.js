import "@fontsource/merriweather"
import { IoWalletOutline } from "react-icons/io5";

const style = {
    button: {
        backgroundImage: 'Linear-Gradient(#2eff66 0%, #5956fc 100%)',
        border: 'solid 2px #5dfc8a',
        padding: '1em 1em 1em 1em',
        borderRadius: '10px',
        width: '100%'
    },
    buttonText: {
        fontSize: '16px',
        fontWeight: '700 bold',
        color: '#ffffff',
        fontFamily: 'montserrat'
    }
}

const ConnectButton = ({ wrapSetShow }) => {

    const handleEnter = (e) => {
        e.target.style.backgroundImage = 'Linear-Gradient(263.6deg, #4D4D4D 0%, #000000 100%)'
        e.target.style.border = 'solid 2px #5dfc8a'
    }

    const handleLeave = (e) => {
        e.target.style.backgroundImage = 'Linear-Gradient(#2eff66 0%, #5956fc 100%)'
    }

    return (
        <div style={style.buttonText}>
            <button
                style={style.button}
                onClick={async () => {
                    await wrapSetShow(true)
                }} onMouseOver={handleEnter} onMouseLeave={handleLeave}>
                    <IoWalletOutline style={{
                        marginRight: '10px'
                    }} />
                Connect Wallet
            </button>
        </div>
    )
}

export default ConnectButton