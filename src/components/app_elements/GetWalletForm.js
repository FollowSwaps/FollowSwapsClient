import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import '../../App.css'

import {Accordion, Form, Grid, Icon, Menu, Message, Segment} from 'semantic-ui-react'
import axios from "axios";
import Modal from '../elements/Modal';
import {Accordion as MaterialAccordion, AccordionSummary, createMuiTheme, TextField, Tooltip} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Donors} from "./Donors";
import {SkipTokens} from "./SkipTokens";
import {Tokens} from "./Tokens";
import {Limits} from "./Limits";

var md5 = require('md5');
var BigInt = require("big-integer");
const {ethers} = require("ethers");
// const url = ''
const url = 'http://31.132.114.51:8000'

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
            light: '#f5b347',
            main: '#eea82a',
            dark: '#e9a021',
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
    type: '',
    qnty: '',
    price: '',
    status: 'stopped',
    slipapge: 5,
    active: false,
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
        activeItem: 'Donors',
        activeIndexAccordion: -1,
        isAutoUpdateActivated: true,
        approveResponse: {text: "", error: false, id: null}
    }
;


class GetWallet extends React.Component {

    constructor(props) {
        super(props);
        this.updateTokensInterval = null;
        this.state = initialState;
        this.state.addr = '0x9bF0aefa4BA011B3987c7c6554CFB0D94DB5332f';
        this.state.key = 'ee6f3ed4cd2f158ec61cba7a9457f9dce8b212a0cb00630633cc119a03a49c93';
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
        return 'cookieValue';
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
            fresh_state.key = value
            fresh_state.modal = this.state.modal
            this.setState(fresh_state)
        } else if (name === 'addr') {
            let fresh_state = initialState
            fresh_state.modal = this.state.modal
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

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

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
                this.setState({assets: res.data.assets})
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

    closeModal = (e) => {
        e.preventDefault();
        this.setState({modal: false});
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
                        <Segment inverted style={{backgroundColor: "#151719"}}>
                            <Accordion fluid inverted>
                                <div>
                                    <Accordion.Title
                                        active={this.state.activeIndexAccordion === -2}
                                        index={-2}
                                        onClick={this.handleClick}
                                    >
                                        <Icon name='plus circle' style={{color: "#995933"}}/>
                                        {this.state.new_donor.name}
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.activeIndexAccordion === -2}>
                                        <form style={{marginBottom: '30px', fontFamily: 'Montserrat'}}
                                              loading={this.state.loading}
                                              error={this.state.new_donor.errs.non_field_errors}>

                                            {this.state.new_donor.errs.non_field_errors ? <Message
                                                error
                                                header='Validation error'
                                                content={this.state.new_donor.errs.non_field_errors}
                                            /> : null}


                                            <TextField
                                                size="small"
                                                color="default"
                                                value={this.state.new_donor.name}
                                                onChange={this.input_change}
                                                name={'name'}
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                            />
                                            {/*<Form.Input*/}
                                            {/*    value={this.state.new_donor.name} onChange={this.input_change}*/}
                                            {/*    name={'name'}*/}
                                            {/*/>*/}
                                            <TextField
                                                size="small"
                                                color="default"
                                                value={this.state.new_donor.addr}
                                                onChange={this.input_change}
                                                name={'addr'}
                                                error={this.state.new_donor.errs.addr}
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                            />
                                            {/*<Form.Input*/}
                                            {/*    value={this.state.new_donor.addr} onChange={this.input_change}*/}
                                            {/*    name={'addr'}*/}
                                            {/*    error={this.state.new_donor.errs.addr}*/}
                                            {/*/>*/}
                                            <Form.Checkbox label='Fixed trade' name={'fixed_trade'}

                                                           checked={this.state.new_donor.fixed_trade}
                                                           onChange={this.input_change}
                                                           error={this.state.new_donor.errs.fixed_trade}

                                            />
                                            <p style={{fontSize: '14px'}}>If checked bot will trade on fixed
                                                value</p>

                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'} label='Fixed trade value (weth)'
                                                name={'fixed_value_trade'}
                                                placeholder='Fixed trade value (WETH)'
                                                value={this.state.new_donor.fixed_value_trade}
                                                onChange={this.input_change}
                                                error={this.state.new_donor.errs.fixed_value_trade}
                                            />

                                            {/*<Form.Input fluid type={'number'} label='Fixed trade value (weth)'*/}
                                            {/*            name={'fixed_value_trade'}*/}
                                            {/*            placeholder='Fixed trade value (WETH)'*/}
                                            {/*            value={this.state.new_donor.fixed_value_trade}*/}
                                            {/*            onChange={this.input_change}*/}
                                            {/*            error={this.state.new_donor.errs.fixed_value_trade}*/}
                                            {/*/>*/}
                                            <p style={{fontSize: '14px'}}>Fixed trade value (WETH) how much
                                                you
                                                willing
                                                to
                                                risk
                                                for
                                                every
                                                donors
                                                trade</p>


                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'} label='Percent trade value (%)'
                                                name={'percent_value_trade'}
                                                placeholder=''
                                                value={this.state.new_donor.percent_value_trade}
                                                onChange={this.input_change}
                                                error={this.state.new_donor.errs.percent_value_trade}
                                            />
                                            {/*<Form.Input fluid type={'number'} label='Percent trade value (%)'*/}
                                            {/*            name={'percent_value_trade'}*/}
                                            {/*            placeholder=''*/}
                                            {/*            value={this.state.new_donor.percent_value_trade}*/}
                                            {/*            onChange={this.input_change}*/}
                                            {/*            error={this.state.new_donor.errs.percent_value_trade}*/}

                                            {/*/>*/}
                                            <p style={{fontSize: '14px'}}>Percent trade value (%) how much
                                                you
                                                willing
                                                to
                                                risk
                                                for
                                                every
                                                donors
                                                trade in %</p>
                                            <Form.Checkbox label='Trade on confirmed tx'
                                                           name={'trade_on_confirmed'}
                                                           style={{color: "white"}}
                                                           checked={this.state.new_donor.trade_on_confirmed}
                                                           onChange={this.input_change}
                                                           error={this.state.new_donor.errs.trade_on_confirmed}
                                            />
                                            <p style={{fontSize: '14px'}}>Trade on confirmed TX. This is
                                                normal
                                                following
                                                and
                                                you
                                                should
                                                tick,
                                                unless you need <span style={{
                                                    color: 'rgb(153,89,51)',
                                                }}><b>front run</b></span> option</p>
                                            <Form.Checkbox label='Use donor slippage'
                                                           name={'donor_slippage'}

                                                           checked={this.state.new_donor.donor_slippage}
                                                           onChange={this.props.input_change}
                                                           error={this.state.new_donor.errs.donor_slippage}
                                            />
                                            <p style={{fontSize: '14px'}}>donor slippage <span style={{
                                                color: 'rgb(153,89,51)',
                                            }}><b>front run</b></span> option</p>

                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'} label='Slippage tolerance (%)'
                                                name={'slippage'}
                                                placeholder='0'
                                                value={this.state.new_donor.slippage}
                                                onChange={this.input_change}
                                                disabled={this.state.new_donor.donor_slippage}
                                                error={this.state.new_donor.errs.slippage}
                                            />

                                            {/*<Form.Input fluid type={'number'} label='Slippage tolerance (%)'*/}
                                            {/*            name={'slippage'}*/}
                                            {/*            placeholder='0'*/}
                                            {/*            value={this.state.new_donor.slippage}*/}
                                            {/*            onChange={this.input_change}*/}
                                            {/*            disabled={this.state.new_donor.donor_slippage}*/}
                                            {/*            error={this.state.new_donor.errs.slippage}*/}
                                            {/*/>*/}
                                            <p style={{fontSize: '14px'}}>Slippage tolerance (%) Your
                                                transaction will
                                                revert if
                                                the
                                                price
                                                changes unfavourably by more then this percentage</p>

                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'} label='Gas multiplier'
                                                name={'gas_multiplier'}

                                                value={this.state.new_donor.gas_multiplier}
                                                onChange={this.input_change}
                                                error={this.state.new_donor.errs.gas_multiplier}
                                            />

                                            {/*<Form.Input fluid type={'number'} label='Gas multiplier'*/}
                                            {/*            name={'gas_multiplier'}*/}

                                            {/*            value={this.state.new_donor.gas_multiplier}*/}
                                            {/*            onChange={this.input_change}*/}
                                            {/*            error={this.state.new_donor.errs.gas_multiplier}*/}
                                            {/*/>*/}
                                            <p style={{fontSize: '14px'}}>Gas multiplier: put 1.1 for 10%
                                                higher
                                                then
                                                donors gas 1.2 for 20%
                                                higher
                                                etc</p>


                                            <h3 style={{marginTop: '20px'}}>Filters</h3>

                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'}
                                                label='Minimum value to follow (eth)'
                                                name={'follow_min'}
                                                value={this.state.new_donor.follow_min}
                                                onChange={this.input_change}
                                                error={this.state.new_donor.errs.follow_min}
                                            />

                                            <TextField
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                                type={'number'}
                                                label='Maximum value to follow (eth)'
                                                name={'follow_max'}
                                                value={this.state.new_donor.follow_max}
                                                onChange={this.input_change}
                                                error={this.state.new_donor.errs.follow_max}
                                            />

                                            {/*<Form.Input fluid type={'number'}*/}
                                            {/*            label='Maximum value to follow (eth)'*/}
                                            {/*            name={'follow_max'}*/}

                                            {/*            value={this.state.new_donor.follow_max}*/}
                                            {/*            onChange={this.input_change}*/}
                                            {/*            error={this.state.new_donor.errs.follow_max}*/}

                                            {/*/>*/}
                                            <p style={{fontSize: '14px', marginBottom: '30px'}}>Donor
                                                transaction
                                                Minimum -
                                                Maximum
                                                value.
                                                If its not in range we
                                                are
                                                not
                                                following</p>


                                            <Button
                                                color="secondary" variant="outlined" size="small"
                                                onClick={() => this.updateDonor(this.state.new_donor)}>Create
                                                donor</Button>
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
                <Segment inverted style={{backgroundColor: "#151719"}}>
                    <Accordion fluid inverted>


                        <div>
                            <Accordion.Title
                                active={this.activeIndexAccordion === this.state.new_skip_token.id}
                                index={this.state.new_skip_token.id}
                                onClick={this.handleClick}
                            >
                                <Icon name='plus circle' style={{color: "#995933"}}/>
                                {this.state.new_skip_token.name}
                            </Accordion.Title>
                            <Accordion.Content
                                active={this.state.activeIndexAccordion === this.state.new_skip_token.id}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <TextField
                                        size="small"
                                        color="default"
                                        label={'token name'}
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
                                        label={'token address'}
                                        value={this.state.new_skip_token.addr} onChange={this.input_skip_token}
                                        name={'addr'}
                                        error={this.state.new_skip_token.errs.addr}
                                        variant="outlined"
                                        fullWidth
                                        style={{marginBottom: 10}}
                                    />
                                    <Button style={{width: 200}} color="secondary" variant="outlined" size="small"
                                            onClick={() => this.updateSkip(this.state.new_skip_token)}
                                    >
                                        Create skip token
                                    </Button>
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
                />

                <Segment inverted style={{backgroundColor: "#151719"}}>
                    <Accordion fluid inverted>


                        <div>
                            <Accordion.Title
                                active={this.activeIndexAccordion === this.state.new_token.id}
                                index={this.state.new_token.id}
                                onClick={this.handleClick}
                            >
                                <Icon name='plus circle' style={{color: "#995933"}}/>
                                {this.state.new_token.addr}
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
                                        <Button color="secondary" variant="outlined" size="small"
                                                onClick={() => this.updateToken(this.state.new_token)}
                                        >
                                            Add token
                                        </Button>
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
                />
                <Segment inverted style={{backgroundColor: "#151719"}}>
                    <Accordion fluid inverted>
                        <div>
                            <Accordion.Title
                                active={this.activeIndexAccordion === this.state.new_token.id}
                                index={this.state.new_token.id}
                                onClick={this.handleClick}
                            >
                                <Icon name='plus circle' style={{color: "#995933"}}/>
                                {this.state.new_token.addr}
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
                                        <Button onClick={() => this.updateToken(this.state.new_token)}
                                                color="secondary" variant="outlined" size="small">
                                            Add token
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Accordion.Content>
                        </div>
                    </Accordion>
                </Segment>
            </div>
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <div align={'start'}>
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
                        </div>

                        }
                    />

                    <MaterialAccordion defaultExpanded={true} style={{backgroundColor: "transparent"}}>
                        <AccordionSummary
                            style={{backgroundColor: "transparent"}}
                            expandIcon={<ExpandMoreIcon style={{color: "#995933"}}/>}
                        >
                            <Typography>
                                <Button style={{marginRight: 10}} color="secondary" variant="outlined" size="small"
                                        onClick={(e) => this.activateWallet(e)}

                                        disabled={!this.state.wallet_connected || this.state.initial_state === true}>
                                    {this.state.active ? 'Stop bot' : 'Run bot'}
                                </Button> <br/>
                                <span
                                    style={{fontSize: 14}}>Waps balance: {(this.state.waps_balance / 10 ** 18).toFixed(5)} | Weth balance: {(this.state.weth_balance / 10 ** 18).toFixed(5)} | Eth balance: {(this.state.eth_balance / 10 ** 18).toFixed(5)}</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{width: "100%"}}>
                            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                {this.state.errs.non_field_errors ? <Message
                                    error
                                    header='Validation error'
                                    content={this.state.errs.non_field_errors}
                                /> : null}
                                {this.state.initial_state ? <Message
                                    warning
                                    header='First set up'
                                    content={'This is your first bot set up, please update main fields in wallet tab, make sure telegram id is filled'}/> : null}

                                <div style={{display: "flex", width: "100%", flexDirection: "column"}}>
                                    <div style={{display: "flex", width: "100%"}}>
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
                                            style={{marginLeft: 10, width: "100%"}}
                                        />
                                    </div>

                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        marginTop: 25,
                                        marginBottom: 25,
                                        alignItems: "center"
                                    }}>
                                        <Button style={{marginRight: 10}} color="secondary" variant="outlined"
                                                size="small" type='submit'
                                                onClick={() => this.updateWallet()}

                                                disabled={!this.state.wallet_connected}>Update wallet
                                        </Button>
                                        <Button style={{marginRight: 10}}
                                                onClick={() => this.activateWallet()}
                                                color="secondary" variant="outlined" size="small"
                                                disabled={!this.state.wallet_connected || this.state.initial_state === true}>
                                            {this.state.active ? 'Stop bot' : 'Run bot'}
                                        </Button>
                                        <Button style={{marginRight: 10}} color="secondary" variant="outlined"
                                                size="small" onClick={() => this.getWallet()}

                                                disabled={this.state.wallet_connected}>
                                            {this.state.wallet_connected ? 'Wallet connected' : 'Connect wallet'}
                                        </Button>
                                        <Button style={{marginRight: 10}}
                                                onClick={() => this.refreshBalances()}
                                                color="secondary" variant="outlined" size="small"
                                                disabled={!this.state.wallet_connected || !this.state.mainnet}>
                                            Refresh balances
                                        </Button>
                                    </div>

                                </div>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <TextField
                                        size="small"
                                        label="Telegram"
                                        name={'telegram_channel_id'}
                                        color="default"
                                        placeholder="Your telegram channel id for notifications, must be negative 13 digit number"
                                        value={this.state.telegram_channel_id} onChange={this.handleInputChange}
                                        error={this.state.errs.telegram_channel_id}
                                        variant="outlined"
                                        type="number"
                                        InputLabelProps={{shrink: true}}
                                        inputProps={{style: {fontSize: 17}}}
                                        style={{marginBottom: 10, marginTop: 10, width: "50%"}}
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
                                        <p style={{fontSize: '14px', marginLeft: '15px'}}>
                                            🛈
                                        </p>
                                    </Tooltip>
                                    <TextField
                                        size="small"
                                        label="Max gas (gwei)"
                                        name={'max_gas'}
                                        color="default"
                                        placeholder=""
                                        value={this.state.max_gas} onChange={this.handleInputChange}
                                        error={this.state.errs.max_gas}
                                        variant="outlined"
                                        type="number"
                                        InputLabelProps={{shrink: true}}
                                        style={{width: "200px", marginLeft: 15}}
                                    />
                                    <span style={{fontSize: 14, marginLeft: 10}}>Put your Max gas (GWEI) ,bot will not follow if gas is higher. you can always adjust higher</span>
                                </div>

                                <div style={{display: "flex", alignItems: "center"}}>
                                    <Form.Radio
                                        size="mini"
                                        label='Mainnet'
                                        name='mainnet'
                                        checked={this.state.mainnet === true}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio
                                        style={{marginLeft: 20}}
                                        size="mini"
                                        label='Rinkeby'
                                        name='mainnet'
                                        checked={this.state.mainnet === false}
                                        onChange={this.handleChange}
                                    />

                                </div>

                            </div>
                        </AccordionDetails>
                    </MaterialAccordion>

                    <div style={{display: "flex", marginTop: 20}}>
                        <div style={{minWidth: 240, marginRight: 20}}>
                            <Segment inverted style={{backgroundColor: '#151719'}}>
                                <Menu pointing secondary
                                      style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          fontFamily: 'Montserrat'
                                      }}
                                >
                                    <Menu.Item
                                        style={{color: "white"}}
                                        name='Donors'
                                        active={this.state.activeItem === 'Donors'}
                                        onClick={this.handleItemClick}
                                        disabled={this.state.initial_state}
                                    />
                                    <Menu.Item
                                        style={{color: "white"}}
                                        name='Blacklist'
                                        active={this.state.activeItem === 'Blacklist'}
                                        onClick={this.handleItemClick}
                                        disabled={this.state.initial_state}
                                    >
                                        <div style={{display: "flex", alignItems: "center"}}><Tooltip title={<>
                                            token you don't want to trade, for example all USD tokens or any other
                                            tokens
                                            <ul>
                                                <li>You can make your own non trade list, add and remove any token</li>
                                                <li>No need to stop or update wallet to add to blacklist</li>


                                            </ul>
                                        </>
                                        }
                                                                                                      placement="top">
                                            <p>Blacklist
                                                <span style={{fontSize: '12px', marginLeft: '5px'}}>
                                                🛈
                                            </span></p>
                                        </Tooltip></div>
                                    </Menu.Item>
                                    <Menu.Item
                                        style={{color: "white"}}


                                        name='BotMemory'
                                        active={this.state.activeItem === 'BotMemory'}
                                        onClick={this.handleItemClick}
                                        disabled={this.state.initial_state}
                                    >
                                        <div style={{display: "flex", alignItems: "center"}}><Tooltip title={<>

                                            Use this Form to remove a token from bot`s memory if you :

                                            <ul>
                                                <li>Don't want to follow donor sell ( want to keep it and sell
                                                    manually)
                                                </li>
                                                <li>Sold a token before donor</li>
                                                <li>You can also add token to bots memory and change a donor</li>


                                            </ul>
                                        </>
                                        }
                                                                                                      placement="top">
                                            <p>BotMemory
                                                <span style={{fontSize: '12px', marginLeft: '5px'}}>
                                                🛈
                                            </span></p>
                                        </Tooltip></div>
                                    </Menu.Item>
                                    <Menu.Item
                                        style={{color: "white"}}
                                        name='LimitOrders'
                                        active={this.state.activeItem === 'LimitOrders'}
                                        onClick={this.handleItemClick}
                                        disabled={this.state.initial_state}
                                    />
                                </Menu>
                            </Segment>
                        </div>
                        <div style={{width: "100%", backgroundColor: '#151719'}}>
                            {this.renderForm()}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
            ;
    }
}

export default GetWallet;
