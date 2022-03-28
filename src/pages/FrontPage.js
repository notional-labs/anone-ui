import aos from "aos"
import { useEffect } from "react"

const style = {
    intro: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        height: 'auto',
        minHeight: '80vh'
    },
    asset: {
        position: 'absolute',
        zIndex: 1
    },
}

const FrontPage = () => {

    useEffect(() => {
        aos.init({
            duration: 3000
        })
    }, [])

    return (
        <div>
            <div style={style.intro}>
                <div style={{
                    textAlign: 'center',
                    margin: 'auto'
                }}>
                    {/* <div data-aos="zoom-in">
                        <Image
                            width={500}
                            src={digger}
                            preview={false}
                        />
                    </div> */}
                    <p
                        data-aos="zoom-in"
                        style={{
                            color: '#5dfc8a',
                            fontSize: '100px',
                            fontWeight: 700,
                            margin: 0,
                            height: '100px',
                            marginBottom: '50px'
                        }}>
                        ANONE
                    </p>
                    <p style={{
                        color: '#FFFFFF',
                        fontSize: '24px',
                        fontWeight: 10,
                        margin: 0
                    }}>
                        Welcome to the Anone chain website.
                    </p>
                    <p style={{
                        color: '#FFFFFF',
                        fontSize: '24px',
                        fontWeight: 10,
                        margin: 0
                    }}>
                        Let have a kick around the comunity and the validators.
                    </p>

                    <a href="https://anone-testnet.notional.ventures/" target={'_blank'}>
                        <button style={{
                            border: 0,
                            borderRadius: '10px',
                            backgroundColor: '#5dfc8a',
                            color: '#ffffff',
                            fontSize: '24px',
                            padding: 30,
                            paddingTop: 5,
                            paddingBottom: 5,
                            marginTop: '20px'
                        }}>
                            White paper
                        </button>
                    </a>
                </div>
            </div>

        </div >
    )
}

export default FrontPage