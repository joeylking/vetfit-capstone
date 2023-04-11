import { useSelector } from "react-redux"
import { useState } from "react"
import { getImg } from '../home/helperMethods'
import Pagination from "../templates/Pagination"

const CoinsContainer = () => {
    const profileCoinDetails = useSelector(state => state.profileCoinDetails.value)
    const [startIndexCoins, setStartIndexCoins] = useState(0)
    const [lastIndexCoins, setLastIndexCoins] = useState(4)

    const updateCoinsIndex = (num) => {
        setStartIndexCoins(prev => prev + num)
        setLastIndexCoins(prev => prev + num)
    }

    return (
        <div className='myProfileCoinsContainer'>
            <h1>Coins</h1>
            <div className='userProfileCoinsData'>

                {profileCoinDetails?.length === 0 ? <h3>No coins in Wallet</h3>
                    :
                    <div className="userProfileCoinsContainer headers">
                        <div className="gridHeader">Currency</div>
                        <div className="gridHeader profileCoinChange">Change</div>
                    </div>}

                {profileCoinDetails?.slice(startIndexCoins, lastIndexCoins).map(elem =>

                    <div className="userProfileCoinsContainer" key={elem.id}>

                        <div className="imgSymbolCointainer">
                            <img src={getImg(elem.symbol)} height="32" />
                            <div>
                                <div>{elem.name}</div>
                                <div className="symbol">{elem.symbol}</div>
                            </div>
                        </div>

                        <div className='profileCoinChange'
                            style={{ "color": elem.changePercent24Hr < 0 ? "#FF3131" : "#66FF00" }}>
                            {elem.changePercent24Hr.toFixed(2)}%
                        </div>

                    </div>
                )}
            </div>
            <Pagination
                startIndex={startIndexCoins}
                lastIndex={lastIndexCoins}
                length={profileCoinDetails.length}
                updateIndex={updateCoinsIndex}
                itemsPerPage={4}
            />
        </div>
    )
}

export default CoinsContainer