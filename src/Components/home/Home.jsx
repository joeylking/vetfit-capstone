import { fetchAllCoins } from "../../State/coins/allCoins"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { addCoinToWallet } from "../../State/wallet/savedCoins"
import { FcSearch } from "react-icons/fc"
import "./home.css"

export const parseMoneyValue = (num) => {
    num = Math.round(num)
    let stringNum = num.toString();
    let letter;

    if (stringNum.length >= 13) {
        stringNum = (num /= 1000000000000).toFixed(1)
        letter = 'T'
    }
    else if (stringNum.length >= 10) {
        stringNum = (num /= 1000000000).toFixed(1)
        letter = 'B'
    }
    else if (stringNum.length >= 7) {
        stringNum = (num /= 1000000).toFixed(1)
        letter = 'M'
    }
    else {
        stringNum = (num /= 1000).toFixed(1)
        letter = 'K'
    }

    let lastIndex = stringNum.length - 1
    return `${stringNum.substring(0, lastIndex)}${stringNum[lastIndex]}${letter}`
}

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [query, setQuery] = useState("")
    const allCoins = useSelector(state => state.allCoins.value)
    const loggedIn = useSelector(state => state.loggedIn.value)

    const filteredCoins = allCoins.filter(item => {
        return item.id.toLowerCase().includes(query.toLowerCase()) || item.symbol.toLowerCase().includes(query.toLowerCase())
    })

    useEffect(() => {
        dispatch(fetchAllCoins())
    }, [])

    const getImg = (symbol) => `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;

    const handleAddToWallet = (e) => {
        if (!loggedIn) return navigate("/login")

        let coin = {
            userId: 1,
            currencyName: e.target.dataset.name
        }
        dispatch(addCoinToWallet(coin))
    }

    if (allCoins.length < 1)
        return <h1>Loading...</h1>


    return (
        <div className="allCoinsContainer">
            <div className="filterCoinsContainer">
                <FcSearch style={{ fontSize: "1.5rem" }} />
                <input
                    className="filterCoinsInput"
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search for a coin by name or symbol..." />
            </div>


            <div className="coinGridHeaderContainer">
                <div className="gridHeader">Currency</div>
                <div className="gridHeader">Price</div>
                <div className="gridHeader">Change</div>
                <div className="gridHeader">Market cap</div>
                <div className="gridHeader">Volume(24hr)</div>
                <div className="gridHeader">Supply</div>
                <div className="gridHeader">Watching</div>
            </div>

            {filteredCoins.map(elem =>
                <div className="individualCoinContainer" key={elem.id}>
                    <div className="imgSymbolCointainer">
                        <img src={getImg(elem.symbol)} height="32" />
                        <div>
                            <div>{elem.name}</div>
                            <div className="symbol">{elem.symbol}</div>
                        </div>
                    </div>

                    <div>${elem.priceUsd.toFixed(2)}</div>

                    <div style={{ "color": elem.changePercent24Hr < 0 ? "red" : "green" }}>{elem.changePercent24Hr.toFixed(2)}%</div>
                    <div>${parseMoneyValue(elem.marketCapUsd)}</div>
                    <div>${parseMoneyValue(elem.volumeUsd24Hr)}</div>
                    <div>${parseMoneyValue(elem.supply)}</div>

                    <button data-name={elem.id} onClick={handleAddToWallet}>Add to Wallet</button>
                </div>

            )}
        </div>
    )
}

export default Home
