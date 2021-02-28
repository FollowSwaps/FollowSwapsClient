import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import '../../App.css'

import {
    Button,
    Form,
    Menu, Segment, Accordion, Icon,
    Message,
} from 'semantic-ui-react'
import axios from "axios";
import Modal from '../elements/Modal';

var md5 = require('md5');
const url = ''
// const url = 'http://31.132.126.208:8000'


class Donors extends React.Component {


    render() {
        return (
            <Segment inverted>
                <Accordion fluid inverted>
                    {
                        this.props.donors.map(donor => (
                                <div>
                                    <Accordion.Title
                                        active={this.props.activeIndexAccordion === donor.id}
                                        index={donor.id}
                                        onClick={this.props.handleClick}
                                    >
                                        <Icon name='dropdown'/>
                                        {donor.name}
                                    </Accordion.Title>
                                    <Accordion.Content active={this.props.activeIndexAccordion === donor.id}>
                                        <Form inverted style={{marginBottom: '30px'}} loading={this.props.loading}
                                              error={donor.errs.non_field_errors}>
                                            <Message
                                                error
                                                header='Validation error'
                                                content={donor.errs.non_field_errors}
                                            />
                                            <Form.Group grouped>
                                                <Form.Input
                                                    value={donor.name} onChange={this.props.input_change} name={'name'}
                                                    error={donor.errs.name}
                                                />
                                                <Form.Input
                                                    value={donor.addr} onChange={this.props.input_change} name={'addr'}
                                                    error={donor.errs.addr}
                                                />


                                                <Form.Group grouped>
                                                    <Form.Checkbox label='Fixed trade' name={'fixed_trade'}

                                                                   checked={donor.fixed_trade}
                                                                   onChange={this.props.input_change}

                                                    />
                                                    <p style={{fontSize: '14px'}}>If checked bot will trade on fixed
                                                        value</p>

                                                    <Form.Input fluid type={'number'} label='Fixed trade value (weth)'
                                                                name={'fixed_value_trade'}
                                                                placeholder='Fixed trade value (WETH)'
                                                                value={donor.fixed_value_trade}
                                                                onChange={this.props.input_change}
                                                                error={donor.errs.fixed_value_trade}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Fixed trade value (WETH) how much you
                                                        willing
                                                        to
                                                        risk
                                                        for
                                                        every
                                                        donors
                                                        trade</p>

                                                    <Form.Input fluid type={'number'} label='Percent trade value (%)'
                                                                name={'percent_value_trade'}
                                                                placeholder=''
                                                                value={donor.percent_value_trade}
                                                                onChange={this.props.input_change}
                                                                error={donor.errs.percent_value_trade}

                                                    />
                                                    <p style={{fontSize: '14px'}}>Percent trade value (%) how much you
                                                        willing
                                                        to
                                                        risk
                                                        for
                                                        every
                                                        donors
                                                        trade in %</p>
                                                    <Form.Checkbox label='Trade on confirmed tx' name={'trade_on_confirmed'}

                                                                   checked={donor.trade_on_confirmed}
                                                                   onChange={this.props.input_change}
                                                                   error={donor.errs.trade_on_confirmed}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Trade on confirmed TX. This is normal
                                                        following
                                                        and
                                                        you
                                                        should
                                                        tick,
                                                        unless you need <span style={{
                                                            color: 'rgb(153,89,51)',
                                                        }}><b>front run</b></span> option</p>
                                                    <Form.Checkbox label='Use donor slippage' name={'donor_slippage'}

                                                                   checked={donor.donor_slippage}
                                                                   onChange={this.props.input_change}
                                                                   error={donor.errs.donor_slippage}
                                                    />
                                                    <p style={{fontSize: '14px'}}>donor slippage <span style={{
                                                        color: 'rgb(153,89,51)',
                                                    }}><b>front run</b></span> option</p>
                                                    <Form.Input fluid type={'number'} label='Slippage tolerance (%)'
                                                                name={'slippage'}
                                                                placeholder='0'
                                                                value={donor.slippage}
                                                                onChange={this.props.input_change}
                                                                disabled={donor.donor_slippage}
                                                                error={donor.errs.slippage}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Slippage tolerance (%) Your transaction
                                                        will
                                                        revert if
                                                        the
                                                        price
                                                        changes unfavourably by more then this percentage</p>
                                                    <Form.Input fluid type={'number'} label='Gas multiplier'
                                                                name={'gas_multiplier'}

                                                                value={donor.gas_multiplier}
                                                                onChange={this.props.input_change}
                                                                error={donor.errs.gas_multiplier}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Gas multiplier: put 1.1 for 10% higher
                                                        then
                                                        donors gas 1.2 for 20%
                                                        higher
                                                        etc</p>
                                                </Form.Group>
                                                <div style={{
                                                    borderTop: 'solid 2px',
                                                    marginTop: '40px',
                                                    borderBottom: 'solid 2px',
                                                    borderColor: 'rgb(153,89,51)'
                                                }}>
                                                    <h3 style={{marginTop: '20px'}}>Filters</h3>
                                                    <Form.Group unstackable widths={'2'}>
                                                        <Form.Input fluid type={'number'}
                                                                    label='Minimum value to follow (eth)'
                                                                    name={'follow_min'}
                                                                    value={donor.follow_min}
                                                                    onChange={this.props.input_change}
                                                                    error={donor.errs.follow_min}

                                                        />
                                                        <Form.Input fluid type={'number'}
                                                                    label='Maximum value to follow (eth)'
                                                                    name={'follow_max'}

                                                                    value={donor.follow_max}
                                                                    onChange={this.props.input_change}
                                                                    error={donor.errs.follow_max}

                                                        />
                                                    </Form.Group>
                                                    <p style={{fontSize: '14px', marginBottom: '30px'}}>Donor transaction
                                                        Minimum -
                                                        Maximum
                                                        value.
                                                        If its not in range we
                                                        are
                                                        not
                                                        following</p>

                                                </div>
                                            </Form.Group>
                                            <Form.Group inline>
                                                <Form.Button
                                                    onClick={() => this.props.updateDonor(donor)}>Update</Form.Button>
                                                <Form.Button
                                                    onClick={() => this.props.deleteDonor(donor.addr)}>Delete</Form.Button>
                                            </Form.Group>


                                        </Form>
                                    </Accordion.Content>
                                </div>
                            )
                        )
                    }
                </Accordion></Segment>
        )
    }
}

class SkipTokens extends React.Component {


    render() {
        return (

            <Segment inverted>
                <Accordion fluid inverted>
                    {
                        this.props.tokens.map(token => (

                            <div>
                                <Accordion.Title
                                    active={this.props.activeIndexAccordion === token.id}
                                    index={token.id}
                                    onClick={this.props.handleClick}
                                >
                                    <Icon name='dropdown'/>
                                    {token.name}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <Form inverted style={{marginBottom: '30px'}} loading={this.props.loading}
                                          error={token.errs.non_field_errors}>
                                        <Form.Group grouped>
                                            <Form.Input
                                                label={'token name'}
                                                value={token.name} onChange={this.props.input_skip_token} name={'name'}
                                                error={token.errs.name}
                                            />
                                            <Form.Input
                                                label={'token address'}
                                                value={token.addr} onChange={this.props.input_skip_token} name={'addr'}
                                                error={token.errs.addr}
                                            />
                                        </Form.Group>
                                        <Form.Group inline>
                                            <Form.Button
                                                onClick={() => this.props.updateSkip(token)}>Update</Form.Button>
                                            <Form.Button
                                                onClick={() => this.props.deleteSkip(token.addr)}>Delete</Form.Button>
                                        </Form.Group>
                                    </Form>
                                </Accordion.Content>

                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}

class Tokens extends React.Component {


    render() {
        return (

            <Segment inverted>
                <Accordion fluid inverted>
                    {
                        this.props.tokens.map(token => (

                            <div>
                                <Accordion.Title
                                    active={this.props.activeIndexAccordion === token.id}
                                    index={token.id}
                                    onClick={this.props.handleClick}
                                >
                                    <Icon name='dropdown'/>
                                    {token.addr} {this.props.donors.find(x=>x.id===token.donor)['name']}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <Form inverted style={{marginBottom: '30px'}} loading={this.props.loading}
                                          error={token.errs.non_field_errors}>
                                        <Form.Group grouped>
                                            <Form.Input
                                                label={'token address'}
                                                value={token.addr} onChange={this.props.input_skip_token} name={'addr'}
                                                error={token.errs.addr}
                                            />
                                            <Form.Input type={'number'}
                                                label={'token quantity'}
                                                value={token.qnty} onChange={this.props.input_skip_token} name={'qnty'}
                                                error={token.errs.qnty}
                                            />
                                            <Form.Select
            fluid
            label='Donor'
            options={this.props.donors.map(x=> ({ "key": x.id, "text": x.name, 'value': x.id}),)}
            value={token.donor}
            name={'donor'}
            onChange={this.props.input_skip_token}
          />

                                        </Form.Group>
                                        <Form.Group inline>
                                            <Form.Button
                                                onClick={() => this.props.updateAsset(token)}>Update</Form.Button>
                                            <Form.Button
                                                onClick={() => this.props.deleteAsset(token.id)}>Delete</Form.Button>
                                        </Form.Group>
                                    </Form>
                                </Accordion.Content>

                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}


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
    donor: '',
    qnty: 1,
    errs: {}
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
        donors: [],
        assets: [],
        loading: false,
        wallet_connected: false,
        new_donor: {...default_new_donor},
        new_skip_token: {...default_new_skip_token},
        new_token: {...default_new_token},
        errs: {},
        modal: true,
        activeItem: 'Wallet',
        activeIndexAccordion: -1
    }
;


class GetWallet extends React.Component {


    constructor(props) {
        super(props);
        this.state = initialState;
        this.state.addr = '0x';
        this.state.key = '';
        this.getWallet = this.getWallet.bind(this)
        this.deleteDonor = this.deleteDonor.bind(this)
        this.deleteSkip = this.deleteSkip.bind(this)
        this.deleteToken = this.deleteToken.bind(this)
        this.activateWallet = this.activateWallet.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.input_change = this.input_change.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.updateDonor = this.updateDonor.bind(this)
        this.updateToken = this.updateToken.bind(this)
        this.updateSkip = this.updateSkip.bind(this)
        this.input_skip_token = this.input_skip_token.bind(this)
        this.input_token = this.input_token.bind(this)

        this.handleInputChange = this.handleInputChange.bind(this);
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
    input_token(event) {
        const target = event.target;

        var value = null
        var name = null;


        value = target.value
        name = target.name
        if (value===undefined && name===undefined) {

         if (this.state.activeIndexAccordion !== -2) {
            let skip_tokens = this.state.assets
            skip_tokens.find(x => x.id === this.state.activeIndexAccordion)['donor'] = this.state.donors.find(x=>x.name===target.textContent).id
            this.setState({assets: skip_tokens})
        } else {
            let new_skip_token = this.state.new_token
            new_skip_token['donor'] =  this.state.donors.find(x=>x.name===target.textContent).id
            this.setState({new_token: new_skip_token})
        }

        }
        else
        if (this.state.activeIndexAccordion !== -2) {
            let skip_tokens = this.state.assets
            skip_tokens.find(x => x.id === this.state.activeIndexAccordion)[name] = value
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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

    activateWallet() {
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
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

 updateToken(token) {
        this.setState({loading: true})
     token.qnty = (token.qnty * 10 ** 18).toFixed()
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
                    asset.qnty = (+asset.qnty / 10 ** 18)
                })

                res.data.max_gas = (res.data.max_gas / 10 ** 9).toFixed()
                this.setState(res.data)
            })
            .catch(err => {
    token.qnty = (+token.qnty / 10 ** 18)
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
                    res.data.assets.forEach(function (asset){
                    asset.qnty=(+asset.qnty / 10 ** 18)
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

    closeModal = (e) => {
        e.preventDefault();
        this.setState({modal: false});
    }

    renderForm = () => {
        if (this.state.activeItem === 'Wallet')
            return (<
                Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}
                     error={this.state.errs.non_field_errors} warning={this.state.initial_state}>
                <Message
                    error
                    header='Validation error'
                    content={this.state.errs.non_field_errors}
                /><Message
                warning
                header='First set up'
                content={'This is your first bot set up, please update main fields in wallet tab, make sure telegram id is filled'}
            />
                <Form.Group grouped>
                    <Form.Input fluid label='Wallet' name={'addr'} placeholder='Your wallet address'
                                value={this.state.addr} onChange={this.handleInputChange}
                                error={this.state.errs.addr}/>
                    <Form.Input fluid type={'password'} label='Key' name={'key'}
                                placeholder='Wallet Key. Only bot has access to it'
                                value={this.state.key} onChange={this.handleInputChange}
                                error={this.state.errs.key}/>


                </Form.Group>
                <Form.Group inline>
                    <Form.Button type='submit' onClick={() => this.updateWallet()} variant="contained"
                                 style={{
                                     backgroundColor: 'rgb(153,89,51)',
                                 }} disabled={!this.state.wallet_connected}>Update wallet</Form.Button>
                    <Form.Button disabled={!this.state.wallet_connected || this.state.initial_state === true}
                                 onClick={this.activateWallet}>{this.state.active ? 'Stop bot' : 'Run bot'}</Form.Button>
                    <Form.Button onClick={this.getWallet}
                                 disabled={this.state.wallet_connected}>{this.state.wallet_connected ? 'Wallet connected' : 'Connect wallet'}</Form.Button>

                </Form.Group>


                <Form.Group grouped>


                    <Form.Input fluid type={'number'} label='Telegram' name={'telegram_channel_id'}
                                placeholder='Your telegram channel id for notifications, must be negative 13 digit number'
                                value={this.state.telegram_channel_id} onChange={this.handleInputChange}
                                error={this.state.errs.telegram_channel_id}/>
                    <p style={{fontSize: '14px', marginBottom: '1px'}}>1. Create new private channel on telegram (
                        any
                        name) 2. Add your bot as admin 3. Get your telegram id
                    </p>
                    <p style={{fontSize: '14px'}}>4. Easiest way to get telegram ID is to forward a message to the
                        @userinfobot bot from your new channel
                    </p>
                    <Form.Group inline>
                        <Form.Radio
                            label='Mainnet'
                            name='mainnet'

                            checked={this.state.mainnet === true}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            label='Rinkeby'
                            name='mainnet'

                            checked={this.state.mainnet === false}
                            onChange={this.handleChange}
                        /></Form.Group>

                    <Form.Input fluid label='Max gas (gwei)' name={'max_gas'} type={'number'}
                                placeholder=''
                                value={this.state.max_gas} onChange={this.handleInputChange}
                                error={this.state.errs.max_gas}/>
                    <p style={{fontSize: '14px'}}>Put your Max gas (GWEI) ,bot will not follow if gas is higher.
                        you
                        can always adjust higher</p>
                </Form.Group>


                <Form.Group unstackable widths={3}>
                    <Form.Input fluid type={'number'} label='Waps balance' name={'waps_balance'}
                                value={this.state.waps_balance / 10 ** 18} onChange={this.handleInputChange}
                                readOnly={true}/>
                    <Form.Input fluid type={'number'} label='Weth balance' name={'weth_balance'}

                                value={this.state.weth_balance / 10 ** 18} onChange={this.handleInputChange}
                                readOnly={true}/>
                    <Form.Input fluid type={'number'} label='Eth balance' name={'eth_balance'}

                                value={this.state.eth_balance / 10 ** 18} onChange={this.handleInputChange}
                                readOnly={true}/>
                </Form.Group>


            </Form>)
        else if (this.state.activeItem === 'Donors')
            return <div>
                <h3>Donor wallets</h3>


                <Donors donors={this.state.donors} delete_donor={this.deleteDonor} key={this.state.key}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr} input_change={this.input_change} handleClick={this.handleClick}
                        updateDonor={this.updateDonor} deleteDonor={this.deleteDonor} loading={this.state.loading}/>

                {
                    this.state.donors.length < 3 ?
                        <Segment inverted>
                            <Accordion fluid inverted>


                                <div>
                                    <Accordion.Title
                                        active={this.state.activeIndexAccordion === -2}
                                        index={-2}
                                        onClick={this.handleClick}
                                    >
                                        <Icon name='plus circle'/>
                                        {this.state.new_donor.name}
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.activeIndexAccordion === -2}>
                                        <Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}
                                              error={this.state.new_donor.errs.non_field_errors}>
                                            <Form.Group grouped>
                                                <Message
                                                    error
                                                    header='Validation error'
                                                    content={this.state.new_donor.errs.non_field_errors}
                                                />
                                                <Form.Input
                                                    value={this.state.new_donor.name} onChange={this.input_change}
                                                    name={'name'}
                                                />
                                                <Form.Input
                                                    value={this.state.new_donor.addr} onChange={this.input_change}
                                                    name={'addr'}
                                                    error={this.state.new_donor.errs.addr}
                                                />


                                                <Form.Group grouped>

                                                    <Form.Checkbox label='Fixed trade' name={'fixed_trade'}

                                                                   checked={this.state.new_donor.fixed_trade}
                                                                   onChange={this.input_change}
                                                                   error={this.state.new_donor.errs.fixed_trade}

                                                    />
                                                    <p style={{fontSize: '14px'}}>If checked bot will trade on fixed
                                                        value</p>

                                                    <Form.Input fluid type={'number'} label='Fixed trade value (weth)'
                                                                name={'fixed_value_trade'}
                                                                placeholder='Fixed trade value (WETH)'
                                                                value={this.state.new_donor.fixed_value_trade}
                                                                onChange={this.input_change}
                                                                error={this.state.new_donor.errs.fixed_value_trade}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Fixed trade value (WETH) how much you
                                                        willing
                                                        to
                                                        risk
                                                        for
                                                        every
                                                        donors
                                                        trade</p>

                                                    <Form.Input fluid type={'number'} label='Percent trade value (%)'
                                                                name={'percent_value_trade'}
                                                                placeholder=''
                                                                value={this.state.new_donor.percent_value_trade}
                                                                onChange={this.input_change}
                                                                error={this.state.new_donor.errs.percent_value_trade}

                                                    />
                                                    <p style={{fontSize: '14px'}}>Percent trade value (%) how much you
                                                        willing
                                                        to
                                                        risk
                                                        for
                                                        every
                                                        donors
                                                        trade in %</p>
                                                    <Form.Checkbox label='Trade on confirmed tx'
                                                                   name={'trade_on_confirmed'}

                                                                   checked={this.state.new_donor.trade_on_confirmed}
                                                                   onChange={this.input_change}
                                                                   error={this.state.new_donor.errs.trade_on_confirmed}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Trade on confirmed TX. This is normal
                                                        following
                                                        and
                                                        you
                                                        should
                                                        tick,
                                                        unless you need <span style={{
                                                            color: 'rgb(153,89,51)',
                                                        }}><b>front run</b></span> option</p>
                                                    <Form.Checkbox label='Use donor slippage' name={'donor_slippage'}

                                                                   checked={this.state.new_donor.donor_slippage}
                                                                   onChange={this.input_change}
                                                                   error={this.state.new_donor.errs.donor_slippage}
                                                    />
                                                    <p style={{fontSize: '14px'}}>donor slippage <span style={{
                                                        color: 'rgb(153,89,51)',
                                                    }}><b>front run</b></span> option</p>
                                                    <Form.Input fluid type={'number'} label='Slippage tolerance (%)'
                                                                name={'slippage'}
                                                                placeholder='0'
                                                                value={this.state.new_donor.slippage}
                                                                onChange={this.input_change}
                                                                disabled={this.state.new_donor.donor_slippage}
                                                                error={this.state.new_donor.errs.slippage}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Slippage tolerance (%) Your
                                                        transaction will
                                                        revert if
                                                        the
                                                        price
                                                        changes unfavourably by more then this percentage</p>
                                                    <Form.Input fluid type={'number'} label='Gas multiplier'
                                                                name={'gas_multiplier'}

                                                                value={this.state.new_donor.gas_multiplier}
                                                                onChange={this.input_change}
                                                                error={this.state.new_donor.errs.gas_multiplier}
                                                    />
                                                    <p style={{fontSize: '14px'}}>Gas multiplier: put 1.1 for 10% higher
                                                        then
                                                        donors gas 1.2 for 20%
                                                        higher
                                                        etc</p>
                                                </Form.Group>
                                                <div style={{
                                                    borderTop: 'solid 2px',
                                                    marginTop: '40px',
                                                    borderBottom: 'solid 2px',
                                                    borderColor: 'rgb(153,89,51)'
                                                }}>
                                                    <h3 style={{marginTop: '20px'}}>Filters</h3>
                                                    <Form.Group unstackable widths={'2'}>
                                                        <Form.Input fluid label='Minimum value to follow (eth)'
                                                                    name={'follow_min'}
                                                                    value={this.state.new_donor.follow_min}
                                                                    onChange={this.input_change}
                                                                    error={this.state.new_donor.errs.follow_min}

                                                        />
                                                        <Form.Input fluid type={'number'}
                                                                    label='Maximum value to follow (eth)'
                                                                    name={'follow_max'}

                                                                    value={this.state.new_donor.follow_max}
                                                                    onChange={this.input_change}
                                                                    error={this.state.new_donor.errs.follow_max}

                                                        />
                                                    </Form.Group>
                                                    <p style={{fontSize: '14px', marginBottom: '30px'}}>Donor
                                                        transaction
                                                        Minimum -
                                                        Maximum
                                                        value.
                                                        If its not in range we
                                                        are
                                                        not
                                                        following</p>

                                                </div>


                                                <Form.Button
                                                    onClick={() => this.updateDonor(this.state.new_donor)}>Create
                                                    donor</Form.Button>

                                            </Form.Group>
                                        </Form>
                                    </Accordion.Content>
                                </div>


                            </Accordion></Segment>
                        : null}

            </div>
        else if (this.state.activeItem === 'Blacklist')
            return <div>
                <h5>
                    Blacklist - token you don't want to trade, for example all USD tokens or any other tokens
                </h5>
                    <ul>
                        <li>You can  make your own non trade list, add and remove any token</li>
                        <li>No need to stop or update wallet to add to blacklist</li>


                    </ul>



                <SkipTokens tokens={this.state.skip_tokens} key={this.state.key}
                                    activeIndexAccordion={this.state.activeIndexAccordion}
                                    addr={this.state.addr} input_skip_token={this.input_skip_token}
                                    handleClick={this.handleClick}
                                    updateSkip={this.updateSkip} deleteSkip={this.deleteSkip}
                                    loading={this.state.loading}/>
                <Segment inverted>
                    <Accordion fluid inverted>


                        <div>
                            <Accordion.Title
                                active={this.activeIndexAccordion === this.state.new_skip_token.id}
                                index={this.state.new_skip_token.id}
                                onClick={this.handleClick}
                            >
                                <Icon name='dropdown'/>
                                {this.state.new_skip_token.name}
                            </Accordion.Title>
                            <Accordion.Content
                                active={this.state.activeIndexAccordion === this.state.new_skip_token.id}>
                                <Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}
                                      error={this.state.new_skip_token.errs.non_field_errors}>
                                    <Form.Group grouped>
                                        <Form.Input
                                            label={'token name'}
                                            value={this.state.new_skip_token.name} onChange={this.input_skip_token}
                                            name={'name'}
                                            error={this.state.new_skip_token.errs.name}
                                        />
                                        <Form.Input
                                            label={'token address'}
                                            value={this.state.new_skip_token.addr} onChange={this.input_skip_token}
                                            name={'addr'}
                                            error={this.state.new_skip_token.errs.addr}
                                        />
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Form.Button
                                            onClick={() => this.updateSkip(this.state.new_skip_token)}>Create skip
                                            token</Form.Button>

                                    </Form.Group>
                                </Form>
                            </Accordion.Content>

                        </div>

                    </Accordion>
                </Segment>

            </div>
        else if (this.state.activeItem === 'BotMemory')
            return <div>
                   <h5>
                    Use this Form to remove a token from bot`s  memory if you :
                </h5>
                    <ul>
                        <li>Don't  want to follow donor sell ( want to keep it and sell manually)</li>
                        <li>Sold a token before donor</li>
                        <li>You can also add token to bots memory and change a donor</li>


                    </ul>

                <Tokens tokens={this.state.assets} key={this.state.key} donors={this.state.donors}
                                activeIndexAccordion={this.state.activeIndexAccordion}
                                addr={this.state.addr} input_skip_token={this.input_token}
                                handleClick={this.handleClick}
                                updateAsset={this.updateToken} deleteAsset={this.deleteToken} loading={this.state.loading}/>
                <Segment inverted>
                    <Accordion fluid inverted>


                        <div>
                            <Accordion.Title
                                active={this.activeIndexAccordion === this.state.new_token.id}
                                index={this.state.new_token.id}
                                onClick={this.handleClick}
                            >
                                <Icon name='dropdown'/>
                                {this.state.new_token.addr}
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndexAccordion === this.state.new_token.id}>
                                <Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}
                                      error={this.state.new_token.errs.non_field_errors}>
                                    <Form.Group grouped>
                                        <Form.Input
                                            label={'token address'}
                                            value={this.state.new_token.addr} onChange={this.input_token}
                                            name={'addr'}
                                            error={this.state.new_token.errs.addr}
                                        />
                                        <Form.Input
                                            label={'token quantity'}
                                            type={'number'}
                                            value={this.state.new_token.qnty} onChange={this.input_token}
                                            name={'qnty'}
                                            error={this.state.new_token.errs.qnty}
                                        />
                                          <Form.Select
            fluid
            label='Donor'
            options={this.state.donors.map(x=> ({ "key": x.id, "text": x.name, 'value': x.id}),)}
            value={this.state.new_token.donor}
            name={'donor'}
            onChange={this.input_token}
          />
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Form.Button
                                            onClick={() => this.updateToken(this.state.new_token)}>Add
                                            token</Form.Button>

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
            <div align={'start'}>
                <Modal
                    id="video-modal"
                    show={this.state.modal}
                    handleClose={this.closeModal}
                    children={<div>
                        <h3>Read carefully</h3>

                        <p>This bot is currently in beta testing. In our opinion, it's safe to use, but we cannot take
                            into
                            account all the risks especially if you COPY TRADE someone you don't know. Use this service
                            with
                            a clean wallet and FUNDS you can afford to lose.</p>
                        <Button onClick={this.closeModal}>Agreed</Button>
                    </div>

                    }
                />
                <Segment inverted>
                    <Menu inverted pointing secondary>
                        <Menu.Item
                            name='Wallet'
                            active={this.state.activeItem === 'Wallet'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Donors'
                            active={this.state.activeItem === 'Donors'}
                            onClick={this.handleItemClick}
                            disabled={this.state.initial_state}
                        />
                        <Menu.Item
                            name='Blacklist'
                            active={this.state.activeItem === 'Blacklist'}
                            onClick={this.handleItemClick}
                            disabled={this.state.initial_state}
                        /><Menu.Item
                        name='BotMemory'
                        active={this.state.activeItem === 'BotMemory'}
                        onClick={this.handleItemClick}
                        disabled={this.state.initial_state}
                    /><Menu.Item
                        name='Limit orders'
                        active={this.state.activeItem === 'LimitOrders'}
                        onClick={this.handleItemClick}
                        disabled={this.state.initial_state}
                    />
                    </Menu>
                </Segment>
                {this.renderForm()}

            </div>

        )
            ;
    }
}

export default GetWallet;