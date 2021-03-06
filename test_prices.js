// import { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType } from '@uniswap/sdk'

const {
    ChainId,
    Fetcher,
    WETH,
    Route,
    Trade,
    TokenAmount,
    TradeType,
    Percent,
    Pair,
    Token
} = require('@uniswap/sdk');
const ethers = require('ethers');

async function a() {
    const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18)

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option

    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])

    const route = new Route([pair], WETH[DAI.chainId])
    const trade = new Trade(route, new TokenAmount(WETH[DAI.chainId], '100000000000000000'), TradeType.EXACT_INPUT)

    console.log(trade.executionPrice.toSignificant(6))
    console.log(trade.nextMidPrice.toSignificant(6))
}

a()