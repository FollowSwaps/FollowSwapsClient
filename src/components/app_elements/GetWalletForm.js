import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import '../../App.css'

import {Accordion, Form, Message, Segment} from 'semantic-ui-react'
import axios from "axios";
import Modal from '../elements/Modal';
import {createMuiTheme, TextField, Tooltip} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import {Donors} from "./Donors";
import {SkipTokens} from "./SkipTokens";
import {Tokens} from "./Tokens";
import {Limits} from "./Limits";
import {ReactComponent as RenewIcon} from "../../icons/autorenew.svg"
import {ReactComponent as WalletIcon} from "../../icons/account_balance_wallet.svg"
import {ReactComponent as MoreVertIcon} from "../../icons/more_vert.svg";
import {ReactComponent as InfoIcon} from "../../icons/info.svg";
import {ReactComponent as VectorIcon} from "../../icons/Vector.svg";

var md5 = require('md5');
var BigInt = require("big-integer");
const {ethers} = require("ethers");
// const url = 'http://127.0.0.1:8000'
const url = ''
// const url = 'http://176.113.6.52:8000'


const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        common: {black: '#fff', white: '#fff'},
        background: {
            paper: 'rgba(255, 255, 255, 1)',
            default: 'rgba(255, 255, 255, 1)'
        },
        primary: {
            light: '#ae6a42',
            main: '#ae6a42',
            dark: '#ae6a42',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#995933',
            main: '#995933',
            dark: '#995933',
            contrastText: '#000000'
        },
        error: {
            light: 'rgba(222, 123, 123, 1)',
            main: 'rgba(251, 51, 40, 1)',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
        text: {
            primary: '#fff',
            secondary: '#fff',
            disabled: '#fff',
            hint: '#fff'
        }
    }
});


const default_new_donor = {
    addr: "",
    fixed_trade: true,
    fixed_value_trade: 0.1,
    follow_max: 999,
    follow_min: 0.1,
    gas_multiplier: 1.1,
    id: -2,
    name: "new donor",
    percent_value_trade: 10,
    slippage: 5,
    donor_slippage: true,
    trade_on_confirmed: false,
    errs: {}
}
const default_new_skip_token = {
    addr: "",
    id: -2,
    name: "new skip token",
    errs: {}
}
const default_new_token = {
    addr: "0x",
    id: -2,
    errs: {}
}
const default_new_donor_token = {
    id: -2,
    errs: {},
    donor: -1,
    qnty: 0,

}
const default_new_limit = {

    id: -2,
    type: 'buy',
    qnty: 0,
    price: 0,
    retry_count: 0,
    status: 'stopped',
    slippage: 5,
    active: true,
    errs: {},
    gas_plus: 3
}
const initialState = {
        active: false,
        telegram_channel_id: null,
        mainnet: true,
        max_gas: null,
        initial_state: false,
        waps_balance: null,
        weth_balance: null,
        eth_balance: null,
        // donors: [],
        donors: [],
        assets: [],
        // assets: [],
        loading: false,
        wallet_connected: false,
        new_donor: {...default_new_donor},
        new_donor_token: {...default_new_donor_token},
        new_skip_token: {...default_new_skip_token},
        new_token: {...default_new_token},
        new_limit: {...default_new_limit},
        errs: {},
        modal: false,
        activeItem: 'Home',
        activeIndexAccordion: -1,
        isAutoUpdateActivated: true,
        approveResponse: {text: "", error: false, id: null},
        myWalletOpen: false
    }
;


class GetWallet extends React.Component {

    constructor(props) {
        super(props);
        this.updateTokensInterval = null;
        this.state = initialState;
        this.state.addr = '';
        this.state.key = '';
        this.getWallet = this.getWallet.bind(this)
        this.refreshBalances = this.refreshBalances.bind(this)
        this.updateWallet = this.updateWallet.bind(this)
        this.deleteDonor = this.deleteDonor.bind(this)
        this.deleteSkip = this.deleteSkip.bind(this)
        this.deleteToken = this.deleteToken.bind(this)
        this.deleteTokenFull = this.deleteTokenFull.bind(this)
        this.deleteLimit = this.deleteLimit.bind(this)
        this.activateWallet = this.activateWallet.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.input_change = this.input_change.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.updateDonor = this.updateDonor.bind(this)
        this.updateDonorToken = this.updateDonorToken.bind(this)
        this.updateToken = this.updateToken.bind(this)
        this.updateLimit = this.updateLimit.bind(this)
        this.updateSkip = this.updateSkip.bind(this)
        this.input_skip_token = this.input_skip_token.bind(this)
        this.input_donor_token = this.input_donor_token.bind(this)
        this.input_token = this.input_token.bind(this)
        this.token_name_change = this.token_name_change.bind(this);
        this.update_asset_name = this.update_asset_name.bind(this);
        this.input_change_limit = this.input_change_limit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateTokensInState = this.updateTokensInState.bind(this);
        this.changeTokensUpdateStatus = this.changeTokensUpdateStatus.bind(this);
        this.refreshTokenPrice = this.refreshTokenPrice.bind(this);
        this.refreshTokenBalance = this.refreshTokenBalance.bind(this);
        this.handleApprove = this.handleApprove.bind(this);
        this.handleSetMax = this.handleSetMax.bind(this);
        this.handleOpenMyWallet = this.handleOpenMyWallet.bind(this)
    }

    componentDidMount() {
        this.updateTokensInterval = setInterval(() => {
            if (this.state.isAutoUpdateActivated && this.state.wallet_connected) {
                this.updateTokensInState();
            }
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this.updateTokensInterval)
    }

    token_name_change(event) {
        this.changeTokensUpdateStatus(false)
        const target = event.target;

        var value = null
        var name = null;


        value = target.value

        name = target.name

        this.state.assets.find(x => x.id === this.state.activeIndexAccordion)['name'] = value
        this.setState({assets: this.state.assets})
    }

    handleClick(e, titleProps) {

        const {index} = titleProps
        const {activeIndexAccordion} = this.state
        const newIndex = activeIndexAccordion === index ? -1 : index

        this.setState({activeIndexAccordion: newIndex})
    }

    input_skip_token(event) {
        const target = event.target;

        var value = null
        var name = null;


        value = target.value
        name = target.name

        if (this.state.activeIndexAccordion !== -2) {
            let skip_tokens = this.state.skip_tokens
            skip_tokens.find(x => x.id === this.state.activeIndexAccordion)[name] = value
            this.setState({skip_tokens: skip_tokens})
        } else {
            let new_skip_token = this.state.new_skip_token
            new_skip_token[name] = value
            this.setState({new_skip_token: new_skip_token})
        }
    }

    input_change_limit(event) {
        this.changeTokensUpdateStatus(false)
        const currentTarget = event.currentTarget;
        const target = event.target
        let value = null
        let name = null;
        const isInput = currentTarget.localName === "input"
        value = event.target.value
        name = currentTarget.getAttribute('name')
        const parentId = currentTarget.getAttribute('parentid')
        let id = null;
        if (parentId === null) {
            id = Number(currentTarget.id)
        } else {
            id = Number(currentTarget.getAttribute('parentid'))
        }

        if (name === 'active') {
            value = target.checked
        }
        console.log({value, name, id})
        if (value === undefined && name === undefined && !isInput) {
            value = target.textContent.toLowerCase()
            // if (target.parentNode.parentNode.getAttribute("name") === 'type') {
            //     id = +target.parentNode.parentNode.id
            //     console.log(target.parentNode.parentNode.name)
            // } else {
            //     id = +target.parentNode.parentNode.parentNode.id
            // }
            if (id !== -2) {
                let skip_tokens = this.state.assets
                let tokens = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).limit_assets
                tokens.find(x => x.id === id)['type'] = value
                this.setState({assets: skip_tokens})
            } else {
                console.log(value)
                let new_skip_token = this.state.new_limit
                new_skip_token['type'] = value
                this.setState({new_limit: new_skip_token})
            }
        }
        if (id !== -2) {
            let skip_tokens = this.state.assets
            let tokens = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).limit_assets
            console.log(tokens)
            console.log(value)

            tokens.find(x => x.id === id)[name] = value
            this.setState({assets: skip_tokens})
        } else {
            let new_donor = this.state.new_limit
            new_donor[name] = value
            this.setState({new_limit: new_donor})
        }

    }

    input_donor_token(event) {
        this.changeTokensUpdateStatus(false)
        const currentTarget = event.currentTarget;
        const target = event.target
        let value = null
        let name = null;
        const isInput = currentTarget.localName === "input"
        value = event.target.value
        name = currentTarget.getAttribute('name')
        const parentId = currentTarget.getAttribute('parentid')
        let id = null;
        if (parentId === null) {
            id = Number(currentTarget.id)
        } else {
            id = Number(currentTarget.getAttribute('parentid'))
        }
        console.log(value, name, id)
        if (value !== undefined && name !== undefined && !isInput) {
            if (id !== -2) {
                let skip_tokens = this.state.assets
                let token = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).donor_assets
                token.find(x => x.id === id)['donor'] = this.state.donors.find(x => x.name === currentTarget.textContent).id
                console.log({skip_tokens, id})
                this.setState({assets: skip_tokens})
            } else {
                let new_skip_token = this.state.new_donor_token
                new_skip_token['donor'] = this.state.donors.find(x => x.name === currentTarget.textContent).id
                console.log({new_skip_token, id})
                this.setState({new_token: new_skip_token})
            }

        } else if (id !== -2) {
            let skip_tokens = this.state.assets
            let token = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).donor_assets
            console.log(target.id)
            console.log(id)
            token.find(x => x.id === +currentTarget.id)[name] = value
            this.setState({assets: skip_tokens})
        } else {
            let new_skip_token = this.state.new_donor_token
            new_skip_token[name] = value
            this.setState({new_donor_token: new_skip_token})
        }
    }

    input_token(event) {

        const target = event.target;

        var value = null
        var name = null;


        value = target.value
        name = target.name

        if (value === undefined && name === undefined) {
            let id = target.id
            if (target.parentNode.parentNode.getAttribute("name") === 'donor') {
                id = +target.parentNode.parentNode.id
                console.log(target.parentNode.parentNode.name)
            } else
                id = +target.parentNode.parentNode.parentNode.id
            if (this.state.activeIndexAccordion !== -2) {
                console.log(target)
                let skip_tokens = this.state.assets
                let token = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).donor_assets
                token.find(x => x.id === id)['donor'] = this.state.donors.find(x => x.name === target.textContent).id
                this.setState({assets: skip_tokens})
            } else {
                let new_skip_token = this.state.new_token
                new_skip_token['donor'] = this.state.donors.find(x => x.name === target.textContent).id
                this.setState({new_token: new_skip_token})
            }

        } else if (this.state.activeIndexAccordion !== -2) {
            let skip_tokens = this.state.assets
            let token = skip_tokens.find(x => x.id === this.state.activeIndexAccordion).donor_assets
            console.log(target.id)
            console.log(token)

            token.find(x => x.id === +target.id)[name] = value
            this.setState({assets: skip_tokens})
        } else {
            let new_skip_token = this.state.new_token
            new_skip_token[name] = value
            this.setState({new_token: new_skip_token})
        }
    }

    input_change(event) {
        const target = event.target;

        var value = null
        var name = null;

        if (target.tagName === 'LABEL') {
            value = !target.parentNode.childNodes[0].checked
            name = target.parentNode.childNodes[0].name

        } else {

            value = target.value
            name = target.name
        }
        if (this.state.activeIndexAccordion !== -2) {
            let new_donors = this.state.donors
            new_donors.find(x => x.id === this.state.activeIndexAccordion)[name] = value
            this.setState({donors: new_donors})
        } else {
            let new_donor = this.state.new_donor
            new_donor[name] = value
            this.setState({new_donor: new_donor})
        }

    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        // return 'cookieValue';
        return cookieValue;
    }

    deleteDonor(addr) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/delete_donor`, {
            'donor_addr': addr,
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })

                })
                res.data.wallet_connected = true

                this.setState(res.data)
            })
            .catch(err => {
                let new_donors = this.state.donors
                new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                this.setState({donors: new_donors, loading: false})
            })
    }

    deleteSkip(addr) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/delete_skip`, {
            'token_addr': addr,
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals
                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data)
            })
            .catch(err => {
                let new_donors = this.state.skip_tokens
                new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                this.setState({donors: new_donors, loading: false})
            })
    }

    deleteLimit(id) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/delete_limit`, {
            'id': id,
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {

                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals
                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data);
                this.setState({
                    isAutoUpdateActivated: true
                })
            })
            .catch(err => {
                let new_donors = this.state.assets
                new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                this.setState({assets: new_donors, loading: false})
            })
    }

    deleteToken(id) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/delete_asset`, {
            'token_id': id,
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data)
            })
            .catch(err => {
                let new_donors = this.state.assets
                new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                this.setState({assets: new_donors, loading: false})
            })
    }

    deleteTokenFull(id) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/delete_asset_full`, {
            'token_id': id,
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {

                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data);
                this.setState({
                    isAutoUpdateActivated: true
                })
            })
            .catch(err => {
                let new_donors = this.state.assets
                new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                this.setState({assets: new_donors, loading: false});
                this.setState({
                    isAutoUpdateActivated: true
                })
            })
    }

    handleInputChange(event) {
        const target = event.target;
        var value = null
        var name = null;

        if (target.tagName === 'LABEL') {
            value = !target.parentNode.childNodes[0].checked
            name = target.parentNode.childNodes[0].name

        } else {

            value = target.value
            name = target.name
        }
        if (name === 'weth_balance') {
            value *= 10 ** 18
        } else if (name === 'waps_balance') {
            value *= 10 ** 18
        } else if (name === 'eth_balance') {
            value *= 10 ** 18
        } else if (name === 'key') {
            let fresh_state = initialState
            fresh_state.addr = this.state.addr
            fresh_state.myWalletOpen = this.state.myWalletOpen
            fresh_state.key = value
            fresh_state.modal = this.state.modal
            this.setState(fresh_state)
        } else if (name === 'addr') {
            let fresh_state = initialState
            fresh_state.modal = this.state.modal
            fresh_state.myWalletOpen = this.state.myWalletOpen
            fresh_state.addr = value
            fresh_state.key = this.state.key
            this.setState(fresh_state)
        }

        this.setState({

            [name]: value
        });
    }

    handleChange(event) {


        this.setState({

            mainnet: !this.state.mainnet
        });
    }

    getWallet() {

        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }
        axios.post(url + `/get_wallet`, {
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data)
            },)
            .catch(err => {

                this.setState({'loading': false, 'wallet_connected': false, 'errs': err.response.data})
                // res.data.loading=false
                // this.setState(res.data)
            })
        // this.setState(self.res)
    }

    refreshBalances() {

        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')

        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }
        axios.post(url + `/refresh_balances`, {
            'addr': this.state.addr,
            'key_hash': md5(this.state.key)
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                res.data.donors.forEach(function (new_donor) {


                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100
                });
                res.data.assets.forEach(function (asset) {
                    asset.donor_assets.forEach(function (donor_asset) {
                        asset.balance = asset.balance / 10 ** asset.decimals
                        asset.price_for_token = asset.price_for_token / 10 ** asset.decimals
                        asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })
                res.data.wallet_connected = true

                this.setState(res.data)
            },)
            .catch(err => {

                this.setState({'loading': false, 'wallet_connected': false, 'errs': err.response.data})
                // res.data.loading=false
                // this.setState(res.data)
            })
        // this.setState(self.res)
    }

    activateWallet(e) {
        if (e)
            e.stopPropagation();
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        axios.post(url + `/activate`, {
            'addr': this.state.addr,
            'key_hash': md5(this.state.key),
            'active': this.state.active
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.loading = false
                res.data.errs = {}
                res.data.wallet_connected = true
                this.setState(res.data)
            })
            .catch(err => {
                try {
                    this.setState({'loading': false, 'errs': err.response.data})
                } catch (e) {
                    this.setState({
                        'loading': false,
                        'errs': {'non_field_errors': ['there was errors with server connection, we are trying to manage it, but we recommend to restart your local server']}
                    })
                }

                // res.data.loading=false
                // this.setState(res.data)
            })
        // this.setState(self.res)
    }

    updateDonor(donor) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }
        donor.follow_max = (donor.follow_max * 10 ** 18).toFixed()
        donor.follow_min = (donor.follow_min * 10 ** 18).toFixed()
        donor.fixed_value_trade = (donor.fixed_value_trade * 10 ** 18).toFixed()
        donor.percent_value_trade /= 100
        donor.slippage /= 100
        let key_hash = md5(this.state.key)
        axios.post(url + `/update_donor`, {
            'donor': donor,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                if (donor.id === -2)
                    res.data.activeIndexAccordion = -1
                res.data.loading = false
                res.data.new_donor = {...default_new_donor}
                res.data.donors.forEach(function (new_donor) {


                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100

                });
                res.data.assets.forEach(function (asset) {

                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                this.setState(res.data)
            })
            .catch(err => {

                donor.follow_max = (+donor.follow_max / 10 ** 18)
                donor.follow_min = (+donor.follow_min / 10 ** 18)
                donor.fixed_value_trade = (+donor.fixed_value_trade / 10 ** 18)
                donor.percent_value_trade *= 100
                donor.slippage *= 100
                if (donor.id !== -2) {
                    let new_donors = this.state.donors
                    new_donors.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                    this.setState({donors: new_donors, loading: false})
                } else {
                    let new_donors = this.state.new_donor
                    new_donors['errs'] = err.response.data
                    this.setState({new_donor: new_donors, loading: false})
                }


                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    updateSkip(token) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/update_skip`, {
            'token': token,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                if (token.id === -2)
                    res.data.activeIndexAccordion = -1
                res.data.loading = false
                res.data.new_donor = {...default_new_donor}
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100

                });
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9)
                this.setState(res.data)
            })
            .catch(err => {

                if (token.id !== -2) {
                    let skip_tokens = this.state.skip_tokens
                    skip_tokens.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                    this.setState({skip_tokens: skip_tokens, loading: false})
                } else {
                    let new_skip_token = this.state.new_skip_token
                    new_skip_token['errs'] = err.response.data
                    this.setState({new_skip_token: new_skip_token, loading: false})
                }


                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    update_asset_name(token) {
        // this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/update_asset_name`, {
            'token': token,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                this.setState({
                    isAutoUpdateActivated: true
                })

            })
            .catch(err => {
                this.setState({
                    isAutoUpdateActivated: true
                })

                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    updateToken(token) {
        this.setState({loading: true})
        if (token.id !== -2)
            token.qnty = BigInt(token.qnty * 10 ** +token.decimals).toString()
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/update_asset`, {
            'token': token,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                if (token.id === -2) {
                    res.data.activeIndexAccordion = -1
                    res.data.new_token = default_new_token
                }
                res.data.loading = false
                res.data.new_donor = {...default_new_donor}
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100

                });
                res.data.assets.forEach(function (asset) {

                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9).toFixed()

                console.log(res.data.new_token)
                this.setState(res.data)
            })
            .catch(err => {
                token.qnty = (+token.qnty / 10 ** +token.decimals)
                if (token.id !== -2) {
                    let skip_tokens = this.state.assets
                    skip_tokens.find(x => x.id === this.state.activeIndexAccordion)['errs'] = err.response.data
                    this.setState({assets: skip_tokens, loading: false})
                } else {
                    let new_skip_token = this.state.new_token
                    new_skip_token['errs'] = err.response.data
                    this.setState({new_token: new_skip_token, loading: false})
                }


                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    updateDonorToken(token) {
        this.setState({loading: true})
        token.asset_id = this.state.assets.find(x => x.id === this.state.activeIndexAccordion).id
        token.decimals = this.state.assets.find(x => x.id === this.state.activeIndexAccordion).decimals
        token.qnty = BigInt(token.qnty * 10 ** +token.decimals).toString()

        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/update_donor_asset`, {
            'token': token,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                if (token.id === -2) {
                    // res.data.activeIndexAccordion = -1
                    res.data.new_donor_token = default_new_donor_token
                }
                res.data.loading = false
                res.data.new_donor = {...default_new_donor}
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100

                });
                res.data.assets.forEach(function (asset) {
                    asset.donor_assets.forEach(function (donor_asset) {
                        asset.balance = asset.balance / 10 ** asset.decimals
                        asset.price_for_token = asset.price_for_token / 10 ** asset.decimals

                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9).toFixed()

                console.log(res.data.new_token)
                this.setState(res.data)
                this.setState({
                    isAutoUpdateActivated: true
                })
            })
            .catch(err => {
                token.qnty = (+token.qnty / 10 ** +token.decimals)
                if (token.id !== -2) {
                    let skip_tokens = this.state.assets
                    skip_tokens.find(x => x.id === this.state.activeIndexAccordion).donor_assets.find(x => x.id === token.id)['errs'] = err.response.data
                    this.setState({assets: skip_tokens, loading: false})
                } else {
                    let new_skip_token = this.state.new_donor_token
                    new_skip_token['errs'] = err.response.data
                    this.setState({new_donor_token: new_skip_token, loading: false})
                }


                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    updateLimit(token) {
        this.setState({loading: true})
        token.asset_id = this.state.assets.find(x => x.id === this.state.activeIndexAccordion).id
        token.decimals = this.state.assets.find(x => x.id === this.state.activeIndexAccordion).decimals
        if (token.type === 'buy')
            token.qnty = BigInt(token.qnty * 10 ** 18).toString()
        else
            token.qnty = BigInt(token.qnty * 10 ** +token.decimals).toString()

        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/update_limit`, {
            'token': token,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {


                res.data.new_limit = default_new_limit

                res.data.loading = false
                res.data.new_donor = {...default_new_donor}
                res.data.donors.forEach(function (new_donor) {
                    new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                    new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                    new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                    new_donor.percent_value_trade *= 100
                    new_donor.slippage *= 100

                });
                res.data.assets.forEach(function (asset) {

                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** asset.decimals
                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9).toFixed()

                console.log(res.data.new_token)
                this.setState(res.data)
                this.setState({
                    isAutoUpdateActivated: true
                })
            })
            .catch(err => {
                token.qnty = (+token.qnty / 10 ** token.decimals)
                if (token.id !== -2) {
                    let skip_tokens = this.state.assets
                    skip_tokens.find(x => x.id === this.state.activeIndexAccordion).limit_assets.find(x => x.id === token.id)['errs'] = err.response.data
                    this.setState({assets: skip_tokens, loading: false})
                } else {
                    let new_skip_token = this.state.new_limit
                    new_skip_token['errs'] = err.response.data
                    this.setState({new_limit: new_skip_token, loading: false})
                }


                // res.data.loading=false
                // this.setState(err.data)
            })
        // this.setState(self.res)
    }

    handleItemClick = (name) => this.setState({activeItem: name})

    updateWallet() {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }
        let key_hash = md5(this.state.key)
        let send_state = {
            ...this.state
        };
        delete send_state.key
        send_state.key_hash = key_hash
        send_state.max_gas *= 10 ** 9
        axios.post(url + `/update_wallet`, send_state, {headers: {'X-CSRFToken': csrftoken}})

            .then(res => {

                    res.data.loading = false
                    res.data.errs = {}
                    res.data.max_gas = (res.data.max_gas / 10 ** 9)
                    res.data.donors.forEach(function (new_donor) {
                        new_donor.follow_max = (+new_donor.follow_max / 10 ** 18)
                        new_donor.follow_min = (+new_donor.follow_min / 10 ** 18)
                        new_donor.fixed_value_trade = (+new_donor.fixed_value_trade / 10 ** 18)
                        new_donor.percent_value_trade *= 100
                        new_donor.slippage *= 100
                    });

                    res.data.assets.forEach(function (asset) {

                        asset.balance = asset.balance / 10 ** asset.decimals
                        asset.price_for_token = asset.price_for_token / 10 ** asset.decimals
                        asset.donor_assets.forEach(function (donor_asset) {
                            donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                        })
                        asset.limit_assets.forEach(function (limit_asset) {
                            if (limit_asset.type === 'buy')
                                limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                            else
                                limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                        })
                    })
                    res.data.wallet_connected = true
                    this.setState(res.data)

                }
            ).catch(err => {
            this.setState({'loading': false, 'errs': err.response.data})
            // res.data.loading=false
            // this.setState(res.data)
        })
    }

    /**
     * Метод для обновления токенов в таблицах по интервалу
     */
    updateTokensInState() {
        console.log('tokens update');
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/refresh_tokens`, {
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                res.data.assets.forEach(function (asset) {
                    asset.balance = asset.balance / 10 ** asset.decimals
                    asset.price_for_token = asset.price_for_token / 10 ** 18

                    asset.donor_assets.forEach(function (donor_asset) {
                        donor_asset.qnty = (+donor_asset.qnty / 10 ** asset.decimals)
                    })
                    asset.limit_assets.forEach(function (limit_asset) {
                        if (limit_asset.type === 'buy')
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** 18)
                        else
                            limit_asset.qnty = (+limit_asset.qnty / 10 ** asset.decimals)
                    })

                })
                this.setState({
                    assets: res.data.assets,
                    eth_balance: res.data.balances.eth_balance,
                    weth_balance: res.data.balances.weth_balance,
                    waps_balance: res.data.balances.waps_balance,
                    active: res.data.active,
                    errs: {}
                })
            }
            )
        .catch(err => {
                this.setState({
                    errs: {non_field_errors:'Server error, restart app please'}
                })
            })
    }

    /**
     * Включить или выключить автоматическое обновление токенов по таймауту
     * @param value - boolean
     */
    changeTokensUpdateStatus(value) {
        this.setState({
            isAutoUpdateActivated: value
        })
    }

    refreshTokenBalance(token) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/refresh_token_balance`, {
            'token_id': token.id,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                const newBalance = res.data.balance;
                const tempArr = [...this.state.assets]
                const findToken = tempArr.find(item => item.id === token.id);
                if (findToken) {
                    findToken.balance = newBalance / 10 ** token.decimals
                    console.log(token)
                    console.log(newBalance)
                }
                this.setState({
                    assets: tempArr,
                    loading: false
                })
            })
    }

    refreshTokenPrice(token) {
        this.setState({loading: true})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/refresh_token_price`, {
            'token_id': token.id,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                const newPrice = res.data.price_for_token;
                const tempArr = [...this.state.assets]
                const findToken = tempArr.find(item => item.id === token.id);
                if (findToken) {
                    findToken.price_for_token = newPrice / 10 ** 18
                }
                this.setState({
                    assets: tempArr,
                    loading: false
                })
            })
    }

    handleApprove(token) {
        this.setState({loading: true, approveResponse: {text: "", error: false}})
        let csrftoken = this.getCookie('csrftoken')
        if (csrftoken === null || csrftoken === '') {
            this.setState({errs: {non_field_errors: 'Session is expired, refresh page please. Enter wallet address and key again then press Connect wallet.'}})
            this.setState({loading: false})
            return
        }

        let key_hash = md5(this.state.key)
        axios.post(url + `/approve_token`, {
            'token_id': token.id,
            'addr': this.state.addr,
            'key_hash': key_hash,
        }, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                this.setState({
                    approveResponse: {text: res.data.approve, error: false, id: token.id},
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    approveResponse: {text: "Already approved", error: true, id: token.id},
                    loading: false
                })
            })
    }

    handleSetMax(tokenId, itemId, arrayName) {
        const assetsTemp = [...this.state.assets];
        const asset = assetsTemp.find(item => item.id === tokenId)
        if (itemId !== -2) {

            if (asset) {
                const assetsArr = [...asset[arrayName]];
                const itemIndex = assetsArr.findIndex(item => item.id === itemId);
                if (itemIndex !== -1) {
                    if (assetsArr[itemIndex].type !== 'buy')
                        assetsArr[itemIndex].qnty = asset.balance;
                    else
                        assetsArr[itemIndex].qnty = this.state.weth_balance / 10 ** 18;
                }
                asset[arrayName] = assetsArr;
            }
            this.setState(({assets: assetsTemp, isAutoUpdateActivated: false}))
        } else {

            if (asset) {
                // const assetsArr = [...asset[arrayName]];
                // const itemIndex = assetsArr.findIndex(item => item.id === itemId);
                // if (itemIndex !== -1) {
                let tmp_ass = null
                if (arrayName === 'limit_assets')
                    tmp_ass = {...this.state.new_limit}


                else
                    tmp_ass = {...this.state.new_donor_token}
                if (tmp_ass.type !== 'buy')
                    tmp_ass.qnty = asset.balance;
                else
                    tmp_ass.qnty = this.state.weth_balance / 10 ** 18;

                // }
                // asset[arrayName] = assetsArr;
                console.log(tmp_ass)
                if (arrayName === 'limit_assets')
                    this.setState(({new_limit: tmp_ass, isAutoUpdateActivated: false}))
                else
                    this.setState(({new_donor_token: tmp_ass, isAutoUpdateActivated: false}))
            }
        }
    }

    closeModal = (e) => {
        e.preventDefault();
        this.setState({modal: false});
    }

    handleOpenMyWallet = () => {
        this.setState({myWalletOpen: !this.state.myWalletOpen})
    }

    renderForm = () => {
        if (this.state.activeItem === 'Donors')
            return <div style={{backgroundColor: "#151719"}}>


                <Donors donors={this.state.donors} delete_donor={this.deleteDonor} key={this.state.key}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr} input_change={this.input_change} handleClick={this.handleClick}
                        updateDonor={this.updateDonor} deleteDonor={this.deleteDonor} loading={this.state.loading}/>

                {
                    this.state.donors.length < 3 ?
                        <Segment inverted style={{backgroundColor: "#191B1E"}}>
                            <Accordion fluid inverted>
                                <div>
                                    <Accordion.Title
                                        style={{
                                            backgroundColor: "#24272A",
                                            borderRadius: "5px",
                                            width: "100%",
                                            display: "flex",
                                            marginTop: 20
                                        }}
                                        active={this.state.activeIndexAccordion === -2}
                                        index={-2}
                                        onClick={this.handleClick}
                                    >
                                        <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                            <span className="accordion-header">{this.state.new_donor.name}</span>
                                            <MoreVertIcon className="accordion-icon"/>
                                        </div>
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.activeIndexAccordion === -2}>
                                        <span className="accordion-header-text">
                                            Main info
                                        </span>
                                        <div className="space-after-header"></div>
                                        <form style={{marginBottom: '30px', fontFamily: 'Montserrat'}}
                                              loading={this.state.loading}
                                              error={this.state.new_donor.errs.non_field_errors}>

                                            {this.state.new_donor.errs.non_field_errors ? <Message
                                                error
                                                header='Validation error'
                                                content={this.state.new_donor.errs.non_field_errors}
                                            /> : null}


                                            <TextField
                                                label="Name"
                                                size="small"
                                                color="default"
                                                value={this.state.new_donor.name}
                                                onChange={this.input_change}
                                                name={'name'}
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10, marginTop: 15}}
                                            />
                                            <TextField
                                                label="Address"
                                                size="small"
                                                color="default"
                                                value={this.state.new_donor.addr}
                                                onChange={this.input_change}
                                                name={'addr'}
                                                error={this.state.new_donor.errs.addr}
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10, marginTop: 15}}
                                            />
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <Form.Checkbox label='Fixed trade' name={'fixed_trade'}

                                                               checked={this.state.new_donor.fixed_trade}
                                                               onChange={this.input_change}
                                                               error={this.state.new_donor.errs.fixed_trade}

                                                />
                                                <Tooltip title={<>
                                                    If checked bot will trade on fixed
                                                    value
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>
                                            </div>

                                            <div style={{display: "flex", marginTop: 25}}>
                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'} label='Fixed trade value (WBNB)'
                                                    name={'fixed_value_trade'}
                                                    placeholder='Fixed trade value (WBNB)'
                                                    value={this.state.new_donor.fixed_value_trade}
                                                    onChange={this.input_change}
                                                    error={this.state.new_donor.errs.fixed_value_trade}
                                                />
                                                <Tooltip title={<>
                                                    Fixed trade value (WBNB) how much
                                                    you
                                                    willing
                                                    to
                                                    risk
                                                    for
                                                    every
                                                    donors
                                                    trade
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5, marginBottom: 5}}/>
                                                </Tooltip>
                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'} label='Percent trade value (%)'
                                                    name={'percent_value_trade'}
                                                    placeholder=''
                                                    value={this.state.new_donor.percent_value_trade}
                                                    onChange={this.input_change}
                                                    error={this.state.new_donor.errs.percent_value_trade}
                                                />
                                                <Tooltip title={<>
                                                    Percent trade value (%) how much
                                                    you
                                                    willing
                                                    to
                                                    risk
                                                    for
                                                    every
                                                    donors
                                                    trade in %
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5, marginBottom: 5}}/>
                                                </Tooltip>
                                            </div>

                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <Form.Checkbox label='Use donor slippage'
                                                               name={'donor_slippage'}

                                                               checked={this.state.new_donor.donor_slippage}
                                                               onChange={this.input_change}
                                                               error={this.state.new_donor.errs.donor_slippage}
                                                />
                                                <Tooltip title={<>
                                                    donor slippage <span style={{
                                                    color: 'rgb(153,89,51)',
                                                }}><b>front run</b></span> option
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>
                                            </div>

                                            <div style={{display: "flex", marginTop: 25}}>
                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'} label='Slippage tolerance (%)'
                                                    name={'slippage'}
                                                    placeholder='0'
                                                    value={this.state.new_donor.slippage}
                                                    onChange={this.input_change}
                                                    disabled={this.state.new_donor.donor_slippage}
                                                    error={this.state.new_donor.errs.slippage}
                                                />
                                                <Tooltip title={<>
                                                    Slippage tolerance (%) Your
                                                    transaction
                                                    will
                                                    revert if
                                                    the
                                                    price
                                                    changes unfavourably by more then this percentage
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>
                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'} label='Gas multiplier'
                                                    name={'gas_multiplier'}
                                                    value={this.state.new_donor.gas_multiplier}
                                                    onChange={this.input_change}
                                                    error={this.state.new_donor.errs.gas_multiplier}
                                                />
                                                <Tooltip title={<>
                                                    Gas multiplier: put 1.1 for 10%
                                                    higher
                                                    then
                                                    donors gas 1.2 for 20%
                                                    higher
                                                    etc
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>
                                            </div>


                                            <span className="accordion-header-text" style={{marginTop: 20}}>
                                                Filters
                                            </span>
                                            <div className="space-after-header"></div>

                                            <div style={{display: "flex", marginTop: 25}}>
                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'}
                                                    label='Minimum value to follow (BNB)'
                                                    name={'follow_min'}
                                                    value={this.state.new_donor.follow_min}
                                                    onChange={this.input_change}
                                                    error={this.state.new_donor.errs.follow_min}
                                                />
                                                <Tooltip title={<>
                                                    Donor
                                                    transaction
                                                    Minimum -
                                                    Maximum
                                                    value.
                                                    If its not in range we
                                                    are
                                                    not
                                                    following
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>

                                                <TextField
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{marginBottom: 10, width: "50%"}}
                                                    type={'number'}
                                                    label='Maximum value to follow (BNB)'
                                                    name={'follow_max'}
                                                    value={this.state.new_donor.follow_max}
                                                    onChange={this.input_change}
                                                    error={this.state.new_donor.errs.follow_max}
                                                />
                                                <Tooltip title={<>
                                                    Donor
                                                    transaction
                                                    Minimum -
                                                    Maximum
                                                    value.
                                                    If its not in range we
                                                    are
                                                    not
                                                    following
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                                </Tooltip>
                                            </div>

                                            <button className="outlined-button" style={{marginTop: 20}} type='button'
                                                    onClick={() => this.updateDonor(this.state.new_donor)}>Create
                                                donor
                                            </button>
                                        </form>
                                    </Accordion.Content>
                                </div>


                            </Accordion></Segment>
                        : null}

            </div>
        else if (this.state.activeItem === 'Blacklist')
            return <div>


                <SkipTokens tokens={this.state.skip_tokens} key={this.state.key}
                            activeIndexAccordion={this.state.activeIndexAccordion}
                            addr={this.state.addr} input_skip_token={this.input_skip_token}
                            handleClick={this.handleClick}
                            updateSkip={this.updateSkip} deleteSkip={this.deleteSkip}
                            loading={this.state.loading}/>
                <Segment inverted style={{backgroundColor: "#191B1E"}}>
                    <Accordion fluid inverted>
                        <div>
                            <Accordion.Title
                                style={{
                                    backgroundColor: "#24272A",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "flex",
                                    marginTop: 20
                                }}
                                active={this.activeIndexAccordion === this.state.new_skip_token.id}
                                index={this.state.new_skip_token.id}
                                onClick={this.handleClick}
                            >
                                <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                    <span className="accordion-header">{this.state.new_skip_token.name}</span>
                                    <MoreVertIcon className="accordion-icon"/>
                                </div>
                            </Accordion.Title>
                            <Accordion.Content
                                active={this.state.activeIndexAccordion === this.state.new_skip_token.id}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <TextField
                                        size="small"
                                        color="default"
                                        label={'Token name'}
                                        value={this.state.new_skip_token.name} onChange={this.input_skip_token}
                                        name={'name'}
                                        error={this.state.new_skip_token.errs.name}
                                        variant="outlined"
                                        fullWidth
                                        style={{marginBottom: 10}}
                                    />
                                    <TextField
                                        size="small"
                                        color="default"
                                        label={'Token address'}
                                        value={this.state.new_skip_token.addr} onChange={this.input_skip_token}
                                        name={'addr'}
                                        error={this.state.new_skip_token.errs.addr}
                                        variant="outlined"
                                        fullWidth
                                        style={{marginBottom: 10}}
                                    />
                                    <button className="outlined-button"
                                            onClick={() => this.updateSkip(this.state.new_skip_token)}
                                    >
                                        Create skip token
                                    </button>
                                </div>
                            </Accordion.Content>
                        </div>
                    </Accordion>
                </Segment>
            </div>
        else if (this.state.activeItem === 'BotMemory')
            return <div style={{backgroundColor: "#151719"}}>
                <Tokens tokens={this.state.assets}
                        key={this.state.key}
                        donors={this.state.donors}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr}
                        input_donor_token={this.input_donor_token}
                        handleClick={this.handleClick}
                        token_name_change={this.token_name_change}
                        update={this.update_asset_name}
                        delete={this.deleteTokenFull}
                        new_token={this.state.new_donor_token}
                        updateAsset={this.updateDonorToken}
                        deleteAsset={this.deleteToken}
                        loading={this.state.loading}
                        handleApprove={this.handleApprove}
                        refreshTokenPrice={this.refreshTokenPrice}
                        refreshTokenBalance={this.refreshTokenBalance}
                        approveResponse={this.state.approveResponse}
                        handleSetMax={this.handleSetMax}
                />

                <Segment inverted style={{backgroundColor: "#191B1E"}}>
                    <Accordion fluid inverted>
                        <div>
                            <Accordion.Title
                                style={{
                                    backgroundColor: "#24272A",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "flex",
                                    marginTop: 20
                                }}
                                active={this.activeIndexAccordion === this.state.new_token.id}
                                index={this.state.new_token.id}
                                onClick={this.handleClick}
                            >
                                <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                    <span className="accordion-header">{this.state.new_token.addr}</span>
                                    <MoreVertIcon className="accordion-icon"/>
                                </div>
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndexAccordion === this.state.new_token.id}>
                                <TextField
                                    isinput={true}
                                    size="small"
                                    color="default"
                                    label={'Token address'}
                                    variant="outlined"
                                    fullWidth
                                    value={this.state.new_token.addr} onChange={this.input_token}
                                    name={'addr'}
                                    error={this.state.new_token.errs.addr}
                                />
                                <Form inverted style={{marginTop: '15px'}} loading={this.state.loading}
                                      error={this.state.new_token.errs.non_field_errors}>
                                    <Form.Group inline>
                                        <button className="outlined-button"
                                                onClick={() => this.updateToken(this.state.new_token)}
                                        >
                                            Add token
                                        </button>
                                    </Form.Group>
                                </Form>
                            </Accordion.Content>

                        </div>

                    </Accordion>
                </Segment>

            </div>
        else if (this.state.activeItem === 'LimitOrders')
            return <div>

                <Limits tokens={this.state.assets}
                        key={this.state.key}
                        donors={this.state.donors}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr}
                        input_skip_token={this.input_change_limit}
                        handleClick={this.handleClick}
                        token_name_change={this.token_name_change}
                        update={this.update_asset_name}
                        delete={this.deleteTokenFull}
                        updateAsset={this.updateLimit}
                        deleteAsset={this.deleteLimit}
                        loading={this.state.loading}
                        new_limit={this.state.new_limit}
                        handleApprove={this.handleApprove}
                        refreshTokenPrice={this.refreshTokenPrice}
                        refreshTokenBalance={this.refreshTokenBalance}
                        approveResponse={this.state.approveResponse}
                        handleSetMax={this.handleSetMax}
                />
                <Segment inverted style={{backgroundColor: "#191B1E"}}>
                    <Accordion fluid inverted>
                        <div>
                            <Accordion.Title
                                style={{
                                    backgroundColor: "#24272A",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "flex",
                                    marginTop: 20
                                }}
                                active={this.activeIndexAccordion === this.state.new_token.id}
                                index={this.state.new_token.id}
                                onClick={this.handleClick}
                            >
                                <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                    <span className="accordion-header">{this.state.new_token.addr}</span>
                                    <MoreVertIcon className="accordion-icon"/>
                                </div>
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndexAccordion === this.state.new_token.id}>

                                <TextField
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                    fullWidth
                                    style={{marginBottom: 15}}
                                    label={'Token address'}
                                    value={this.state.new_token.addr} onChange={this.input_token}
                                    name={'addr'}
                                    error={this.state.new_token.errs.addr}
                                />
                                <Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}
                                      error={this.state.new_token.errs.non_field_errors}>
                                    <Form.Group inline>
                                        <button onClick={() => this.updateToken(this.state.new_token)}
                                                className="outlined-button">
                                            Add token
                                        </button>
                                    </Form.Group>
                                </Form>
                            </Accordion.Content>
                        </div>
                    </Accordion>
                </Segment>
            </div>
        else if (this.state.activeItem === "Home")
            return (<div>
                <h5>Some tips:</h5>
                <ul>
                    <li>Always keep CMD windows open or folded.</li>
                    <li>If your laptop/pc was on standby/off/lost internet connection - check if bot working</li>
                </ul>

                <h5>Tab "Donor"</h5>
                <ul>
                    <li>Add a new donor to copy-trade or front-run.</li>
                    <li>You need to have 20 bWAPS.</li>
                    <li>We suggest using donor slippage.</li>
                </ul>
                <h5>Tab "Blacklist"</h5>
                <ul>
                    <li>Add to blacklist tokens you don't want to copy-trade or front-run.</li>
                    <li>For example all USD tokens or any tokens you don't want to buy.</li>
                    <li>You need to know a token contract address.</li>
                </ul>
                <h5>Tab "BotMemory"</h5>
                <ul>
                    <li>All your tokens should be there.</li>
                    <li>If you bought a token and don't want your donor to sell it ( you wish to sell it manually later)
                    remove it from bots memory</li>
                </ul>
                <h5>Tab "LimitOrders"</h5>
                <ul>
                    <li>You can place any amount of limit orders.</li>
                    <li>BNB for 1 token - is a price for only 1 token in BNB ( if you have more tokens, the price might be
                    different)</li>
                    <li>You need to approve a token before selling it.</li>
                    <li>Don't forget to press Run bot </li>
                    <li>If the current price field is blank - the bot is not working</li>
                    <li>If you want to market buy or sell, place a limit order but put a much smaller price to sell and a
                    much higher price to buy. Order will be executed by the current market price on uniswap</li>
                </ul>

                <h6>Any issues, contact us <a href="https://t.me/brentox"><span style={{
                                                    color: 'rgb(153,89,51)',
                                                }}><b>@brentox</b></span></a></h6>

            </div>)
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <div align={'start'}>

                    <div className="main-container">
                        <div className="left-menu">
                            <a href="https://followswaps.com"><img alt={1}
                                                                   src={require("../../icons/image 1.svg")}/></a>

                            <div className="menu-container">
                                <div className={`menu-element ${this.state.activeItem === "Home" ? "menu-element-active" : ""}`}
                                     onClick={() => this.handleItemClick("Home")}
                                >
                                    <span>Home</span>
                                </div>
                                <div className={`menu-element ${this.state.activeItem === "Donors" ? "menu-element-active" : ""}`}
                                     onClick={() => this.handleItemClick("Donors")}
                                >
                                    <span>Donors</span>
                                </div>
                                <div className={`menu-element ${this.state.activeItem === "Blacklist" ? "menu-element-active" : ""}`}
                                     onClick={() => this.handleItemClick("Blacklist")}
                                >
                                    <span>Blacklist</span>
                                </div>
                                <div className={`menu-element ${this.state.activeItem === "BotMemory" ? "menu-element-active" : ""}`}
                                     onClick={() => this.handleItemClick("BotMemory")}
                                >
                                    <span>BotMemory</span>
                                </div>
                                <div className={`menu-element ${this.state.activeItem === "LimitOrders" ? "menu-element-active" : ""}`}
                                     onClick={() => this.handleItemClick("LimitOrders")}
                                >
                                    <span>LimitOrders</span>
                                </div>
                            </div>
                        </div>
                        <div className="body-wrapper">
                            <div className="body-header">
                                <span className="header-text">
                                    bWAPS balance: {(this.state.waps_balance / 10 ** 18).toFixed(5)}
                                    &nbsp; &nbsp;
                                    WBNB balance: {(this.state.weth_balance / 10 ** 18).toFixed(5)}
                                    &nbsp; &nbsp;
                                    BNB balance: {(this.state.eth_balance / 10 ** 18).toFixed(5)}
                                </span>
                                <RenewIcon className="header-icon" onClick={() => this.refreshBalances()}/>

                                <button className="start-bot-button"
                                        style={{color: this.state.active ? '#b23434' :"#23a575",
                                        borderColor: this.state.active ? '#b23434' :"#23a575" }}
                                        onClick={(e) => this.activateWallet(e)}

                                        disabled={!this.state.wallet_connected || this.state.initial_state === true}>
                                    {this.state.active ? 'Stop bot' : 'Run bot'}
                                </button>

                                <WalletIcon className="wallet-icon"/>
                                <span className="header-text" style={{cursor: "pointer"}} onClick={() => this.handleOpenMyWallet()}>
                                    &nbsp;My wallet
                                </span>
                                <VectorIcon style={{marginLeft: 10, transform: this.state.myWalletOpen ? "rotate(180deg)" : ""}}/>
                            </div>
                            {this.state.myWalletOpen ?
                                <>
                                    {this.state.errs.non_field_errors ? <Message
                                        error
                                        header='Validation error'
                                        content={this.state.errs.non_field_errors}
                                    /> : null}
                                    {this.state.initial_state ? <Message
                                        warning
                                        header='First set up'
                                        content={'This is your first bot set up, please update main fields in wallet tab, make sure telegram id is filled'}/> : null}

                                    <TextField
                                        size="small"
                                        label="Wallet"
                                        name={'addr'}
                                        color="default"
                                        placeholder="Your wallet address"
                                        value={this.state.addr} onChange={this.handleInputChange}
                                        error={this.state.errs.addr}
                                        variant="outlined"
                                        disabled={false}
                                        inputProps={{style: {fontSize: 17}}}
                                        style={{width: "100%"}}
                                    />

                                    <TextField
                                        size="small"
                                        label="Key"
                                        name={'key'}
                                        color="default"
                                        placeholder="Wallet Key. Only bot has access to it"
                                        value={this.state.key} onChange={this.handleInputChange}
                                        error={this.state.errs.key}
                                        variant="outlined"
                                        type="password"
                                        disabled={false}
                                        inputProps={{style: {fontSize: 17}}}
                                        style={{marginTop: 50, width: "100%"}}
                                    />

                                    <div style={{display: "flex", marginTop: 50}}>
                                        <button style={{marginRight: 10}} className="contained-button" onClick={() => this.getWallet()}
                                                disabled={this.state.wallet_connected}>
                                            {this.state.wallet_connected ? 'Wallet connected' : 'Connect wallet'}
                                        </button>
                                        <button style={{marginRight: 10}}
                                                onClick={() => this.handleApprove({id: -1})}
                                                disabled={!this.state.wallet_connected}
                                                className="outlined-button">
                                            Approve WBNB
                                        </button>
                                    </div>

                                    <span style={{color: this.state.approveResponse.error ? "red" : "white", fontSize: 14}}>
                                        {-1 === this.state.approveResponse.id && this.state.approveResponse.text}
                                    </span>
                                    <div style={{display: "flex", marginTop: 50}}>
                                        <TextField
                                            size="small"
                                            label={"Telegram"}
                                            name={'telegram_channel_id'}
                                            color="default"
                                            placeholder="Your telegram channel id"
                                            value={this.state.telegram_channel_id} onChange={this.handleInputChange}
                                            error={this.state.errs.telegram_channel_id}
                                            variant="outlined"
                                            type="number"
                                            InputLabelProps={{shrink: true}}
                                            inputProps={{style: {fontSize: 17}}}
                                            style={{width: "50%"}}
                                        />
                                        <Tooltip title={<>
                                            1. Create new private channel on telegram (any name) <br/>
                                            2. Add your bot as admin <br/>
                                            3. Get your telegram id <br/>
                                            4. Easiest way to get telegram ID is to forward a message to the @userinfobot
                                            bot from your
                                            new
                                            channel
                                        </>
                                        }
                                                 placement="top">
                                            <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                        </Tooltip>
                                        <TextField
                                            size="small"
                                            label="Max gas (gwei)"
                                            name={'max_gas'}
                                            color="default"
                                            placeholder="Max gas (gwei)"
                                            value={this.state.max_gas} onChange={this.handleInputChange}
                                            error={this.state.errs.max_gas}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{style: {fontSize: 17}}}
                                            InputLabelProps={{shrink: true}}
                                            style={{width: "50%"}}
                                        />
                                        <Tooltip title={<>
                                            Put your Max gas (GWEI) ,bot will not follow if gas is higher. you can always adjust
                                            higher
                                        </>
                                        }
                                                 placement="top">
                                            <InfoIcon style={{marginRight: 20, marginLeft: 5}}/>
                                        </Tooltip>
                                    </div>

                                    <button style={{marginTop: 50}} className="outlined-button" type='submit'
                                            onClick={() => this.updateWallet()}

                                            disabled={!this.state.wallet_connected}>Update wallet
                                    </button>
                                </>
                                : null
                            }
                            <div className="main-wrapper">
                                {this.renderForm()}
                            </div>
                        </div>
                    </div>

                    <Modal
                        id="video-modal"
                        show={this.state.modal}
                        handleClose={this.closeModal}
                        children={<div>
                            <h3>Read carefully</h3>

                            <p>This bot is currently in beta testing. In our opinion, it's safe to use, but we cannot
                                take
                                into
                                account all the risks especially if you COPY TRADE someone you don't know. Use this
                                service
                                with
                                a clean wallet and FUNDS you can afford to lose.</p>
                            <Button color="secondary" variant="outlined" size="small"
                                    onClick={this.closeModal}>Agreed</Button>
                        </div>}
                    />
                </div>
            </ThemeProvider>
        )
            ;
    }
}

export default GetWallet;
