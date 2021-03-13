import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import '../../App.css'

import {Accordion, Form, Grid, Icon, Menu, Message, Segment} from 'semantic-ui-react'
import axios from "axios";
import Modal from '../elements/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import {createMuiTheme, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';

var md5 = require('md5');
var BigInt = require("big-integer");
const {ethers} = require("ethers");
// const url = ''
const url = 'http://127.0.0.1:8000'

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        common: {black: '#fff', white: '#fff'},
        background: {
            paper: 'rgba(255, 255, 255, 1)',
            default: 'rgba(255, 255, 255, 1)'
        },
        primary: {
            light: '#16b157',
            main: '#16b157',
            dark: '#16b157',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#819ca9',
            main: '#546e7a',
            dark: '#29434e',
            contrastText: '#fff'
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


class Donors extends React.Component {


    render() {
        return (
            <Segment inverted style={{backgroundColor: "#151719"}}>
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
                                        <form style={{marginBottom: '30px', fontFamily: 'Montserrat'}}>
                                            {donor.errs.non_field_errors ? <Message
                                                error
                                                header='Validation error'
                                                content={donor.errs.non_field_errors}
                                            /> : null}
                                            <Grid divided='vertically'>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <div style={{
                                                            border: "1px solid #16b157",
                                                            padding: 10,
                                                            fontFamily: 'Montserrat'
                                                        }}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 1
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus nobis omnis, perspiciatis placeat
                                                            praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <TextField
                                                            size="small"
                                                            name={'name'}
                                                            color="default"
                                                            value={donor.name} onChange={this.props.input_change}
                                                            error={donor.errs.name}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}
                                                        />
                                                        {/*<Form.Input*/}
                                                        {/*    value={donor.name} onChange={this.props.input_change}*/}
                                                        {/*    name={'name'}*/}
                                                        {/*    error={donor.errs.name}*/}
                                                        {/*/>*/}
                                                        <TextField
                                                            size="small"
                                                            name={'name'}
                                                            color="default"
                                                            value={donor.addr} onChange={this.props.input_change}
                                                            variant="outlined"
                                                            fullWidth
                                                            error={donor.errs.addr}
                                                            style={{marginBottom: 10}}

                                                        />
                                                        {/*<Form.Input*/}
                                                        {/*    value={donor.addr} onChange={this.props.input_change}*/}
                                                        {/*    name={'addr'}*/}
                                                        {/*    error={donor.errs.addr}*/}
                                                        {/*/>*/}


                                                        <Form.Checkbox label='Fixed trade' name={'fixed_trade'}

                                                                       checked={donor.fixed_trade}
                                                                       onChange={this.props.input_change}

                                                        />

                                                        <p style={{fontSize: '14px'}}>If checked bot will trade on fixed
                                                            value</p>
                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Fixed trade value (weth)'
                                                            name={'fixed_value_trade'}
                                                            placeholder='Fixed trade value (WETH)'
                                                            value={donor.fixed_value_trade}
                                                            onChange={this.props.input_change}
                                                            error={donor.errs.fixed_value_trade}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}

                                                        />
                                                        {/*<Form.Input fluid type={'number'}*/}
                                                        {/*            label='Fixed trade value (weth)'*/}
                                                        {/*            name={'fixed_value_trade'}*/}
                                                        {/*            placeholder='Fixed trade value (WETH)'*/}
                                                        {/*            value={donor.fixed_value_trade}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            error={donor.errs.fixed_value_trade}/>*/}

                                                        <p style={{fontSize: '14px'}}>Fixed trade value (WETH) how much
                                                            you
                                                            willing
                                                            to
                                                            risk
                                                            for
                                                            every
                                                            donors
                                                            trade</p>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Percent trade value (%)'
                                                            name={'percent_value_trade'}
                                                            placeholder=''
                                                            value={donor.percent_value_trade}
                                                            onChange={this.props.input_change}
                                                            error={donor.errs.percent_value_trade}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}

                                                        />
                                                        {/*<Form.Input fluid type={'number'}*/}
                                                        {/*            label='Percent trade value (%)'*/}
                                                        {/*            name={'percent_value_trade'}*/}
                                                        {/*            placeholder=''*/}
                                                        {/*            value={donor.percent_value_trade}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            error={donor.errs.percent_value_trade}*/}

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

                                                                       checked={donor.trade_on_confirmed}
                                                                       onChange={this.props.input_change}
                                                                       error={donor.errs.trade_on_confirmed}
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

                                                                       checked={donor.donor_slippage}
                                                                       onChange={this.props.input_change}
                                                                       error={donor.errs.donor_slippage}
                                                        />
                                                        <p style={{fontSize: '14px'}}>donor slippage <span style={{
                                                            color: 'rgb(153,89,51)',
                                                        }}><b>front run</b></span> option</p>

                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Slippage tolerance (%)'
                                                            name={'slippage'}
                                                            placeholder='0'
                                                            value={donor.slippage}
                                                            onChange={this.props.input_change}
                                                            disabled={donor.donor_slippage}
                                                            error={donor.errs.slippage}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}

                                                        />

                                                        {/*<Form.Input fluid type={'number'} label='Slippage tolerance (%)'*/}
                                                        {/*            name={'slippage'}*/}
                                                        {/*            placeholder='0'*/}
                                                        {/*            value={donor.slippage}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            disabled={donor.donor_slippage}*/}
                                                        {/*            error={donor.errs.slippage}*/}
                                                        {/*/>*/}
                                                        <p style={{fontSize: '14px'}}>Slippage tolerance (%) Your
                                                            transaction
                                                            will
                                                            revert if
                                                            the
                                                            price
                                                            changes unfavourably by more then this percentage</p>

                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Gas multiplier'
                                                            name={'gas_multiplier'}
                                                            value={donor.gas_multiplier}
                                                            onChange={this.props.input_change}
                                                            error={donor.errs.gas_multiplier}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}

                                                        />

                                                        {/*<Form.Input fluid type={'number'} label='Gas multiplier'*/}
                                                        {/*            name={'gas_multiplier'}*/}

                                                        {/*            value={donor.gas_multiplier}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            error={donor.errs.gas_multiplier}*/}
                                                        {/*/>*/}
                                                        <p style={{fontSize: '14px'}}>Gas multiplier: put 1.1 for 10%
                                                            higher
                                                            then
                                                            donors gas 1.2 for 20%
                                                            higher
                                                            etc</p>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <div style={{border: "1px solid #16b157", padding: 10}}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 2
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus nobis omnis, perspiciatis placeat
                                                            praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>

                                            <Grid divided='vertically'>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <div style={{border: "1px solid #16b157", padding: 10}}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 3
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus nobis omnis, perspiciatis placeat
                                                            praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <h3 style={{marginTop: '20px'}}>Filters</h3>
                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Minimum value to follow (eth)'
                                                            name={'follow_min'}
                                                            value={donor.follow_min}
                                                            onChange={this.props.input_change}
                                                            error={donor.errs.follow_min}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}

                                                        />

                                                        {/*<Form.Input type={'number'}*/}
                                                        {/*            style={{width: "100%"}}*/}
                                                        {/*            label='Minimum value to follow (eth)'*/}
                                                        {/*            name={'follow_min'}*/}
                                                        {/*            value={donor.follow_min}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            error={donor.errs.follow_min}*/}
                                                        {/*/>*/}

                                                        <TextField
                                                            size="small"
                                                            type='number'
                                                            color="default"
                                                            label='Maximum value to follow (eth)'
                                                            name={'follow_max'}
                                                            value={donor.follow_max}
                                                            onChange={this.props.input_change}
                                                            error={donor.errs.follow_max}
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{marginBottom: 10}}
                                                        />

                                                        {/*<Form.Input type={'number'}*/}
                                                        {/*            label='Maximum value to follow (eth)'*/}
                                                        {/*            name={'follow_max'}*/}

                                                        {/*            value={donor.follow_max}*/}
                                                        {/*            onChange={this.props.input_change}*/}
                                                        {/*            error={donor.errs.follow_max}*/}

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
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>


                                            {/*<Form.Button size="mini"*/}
                                            {/*             onClick={() => this.props.updateDonor(donor)}>Update</Form.Button>*/}
                                            {/*<Form.Button size="mini"*/}
                                            {/*             onClick={() => this.props.deleteDonor(donor.addr)}>Delete</Form.Button>*/}
                                        </form>

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
            <Segment inverted style={{backgroundColor: "#151719"}}>
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
                                    {token.addr} | {token.name}
                                    {/*{this.props.donors.find(x => x.id === token.donor)['name']}*/}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    {/*<Form inverted>*/}
                                    <Form.Group inline>
                                        <TextField
                                            size="small"
                                            color="default"
                                            value={token.name}
                                            onChange={this.props.token_name_change}
                                            name={'name'}
                                            label={'token name'}
                                            error={token.errs.name}
                                            variant="outlined"
                                            fullWidth
                                            style={{marginBottom: 10}}
                                        />
                                        {/*<Form.Input*/}
                                        {/*    size={"mini"}*/}
                                        {/*    value={token.name}*/}
                                        {/*    onChange={this.props.token_name_change}*/}
                                        {/*    name={'name'}*/}
                                        {/*    label={'token name'}*/}
                                        {/*    error={token.errs.name}*/}
                                        {/*/>*/}

                                        <div style={{display: "flex"}}>
                                            <Button style={{marginRight: 10}} size="small"
                                                    onClick={() => this.props.update(token)}
                                                    variant="contained">
                                                Save name
                                            </Button>
                                            <Button size="small" onClick={() => this.props.delete(token.id)}
                                                    variant="contained">
                                                Delete token
                                            </Button>
                                        </div>

                                    </Form.Group>
                                    {/*</Form>*/}
                                    <Table style={{backgroundColor: "transparent"}} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Donor</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {token.donor_assets.map(donor_token => (
                                                <TableRow>


                                                    <TableCell>

                                                        <Select
                                                            fullWidth
                                                            name={"donor"}
                                                            margin="dense"
                                                            id={donor_token.id}
                                                            onChange={this.props.input_donor_token}
                                                            error={this.props.new_token.errs.donor}
                                                            value={donor_token.donor}
                                                        >
                                                            {this.props.donors.map(item => {
                                                                return (
                                                                    <MenuItem parentId={donor_token.id}
                                                                              style={{color: "black"}} name={item.name}
                                                                              value={item.id} id={item.id}
                                                                              key={item.id}>{item.name}</MenuItem>
                                                                )
                                                            })}
                                                        </Select>

                                                        {/*<Form.Select*/}
                                                        {/*    fluid*/}
                                                        {/*    id={donor_token.id}*/}
                                                        {/*    options={this.props.donors.map(x => ({*/}
                                                        {/*        "key": x.id,*/}
                                                        {/*        "text": x.name,*/}
                                                        {/*        'value': x.id*/}
                                                        {/*    }),)}*/}
                                                        {/*    value={donor_token.donor}*/}
                                                        {/*    name={'donor'}*/}
                                                        {/*    onChange={this.props.input_donor_token}*/}
                                                        {/*    error={donor_token.errs.donor}*/}
                                                        {/*/>*/}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            isinput={true}
                                                            size="small"
                                                            color="default"
                                                            type="number"
                                                            label={'token name'}
                                                            variant="outlined"
                                                            fullWidth
                                                            id={donor_token.id}
                                                            inputProps={{id: donor_token.id}}
                                                            value={donor_token.qnty}
                                                            onChange={this.props.input_donor_token}
                                                            name={'qnty'}
                                                            error={donor_token.errs.qnty}
                                                        />
                                                    </TableCell>


                                                    <TableCell>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "column"
                                                        }}>
                                                            <Button onClick={() => this.props.updateAsset(donor_token)}
                                                                    variant="contained">
                                                                Update
                                                            </Button>
                                                            <Button style={{marginTop: 10}}
                                                                    onClick={() => this.props.deleteAsset(donor_token.id)}
                                                                    variant="contained">
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>

                                                </TableRow>


                                            ))}
                                            <TableRow>


                                                <TableCell>

                                                    <Select
                                                        fullWidth
                                                        name={"donor"}
                                                        margin="dense"
                                                        id={this.props.new_token.id}
                                                        onChange={this.props.input_donor_token}
                                                        label="Age"
                                                        error={this.props.new_token.errs.donor}
                                                    >
                                                        {this.props.donors.map(item => {
                                                            return (
                                                                <MenuItem parentId={this.props.new_token.id}
                                                                          style={{color: "black"}} name={item.name}
                                                                          value={item.id} id={item.id}
                                                                          key={item.id}>{item.name}</MenuItem>
                                                            )
                                                        })}
                                                    </Select>

                                                    {/*<Form.Select*/}
                                                    {/*    fluid*/}
                                                    {/*    id={this.props.new_token.id}*/}
                                                    {/*    options={this.props.donors.map(x => ({*/}
                                                    {/*        "key": x.id,*/}
                                                    {/*        "text": x.name,*/}
                                                    {/*        'value': x.id*/}
                                                    {/*    }),)}*/}
                                                    {/*    value={this.props.new_token.donor}*/}
                                                    {/*    name={'donor'}*/}
                                                    {/*    onChange={this.props.input_donor_token}*/}
                                                    {/*    error={this.props.new_token.errs.donor}*/}
                                                    {/*/>*/}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        isinput={true}
                                                        size="small"
                                                        color="default"
                                                        type="number"
                                                        label={'token name'}
                                                        variant="outlined"
                                                        fullWidth
                                                        id={this.props.new_token.id}
                                                        value={this.props.new_token.qnty}
                                                        onChange={this.props.input_donor_token}
                                                        name={'qnty'}
                                                        error={this.props.new_token.errs.qnty}
                                                    />
                                                </TableCell>


                                                <TableCell>
                                                    <Button onClick={() => this.props.updateAsset(this.props.new_token)}
                                                            variant="contained">
                                                        Create
                                                    </Button>
                                                </TableCell>

                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                    {/*                          <Form inverted style={{marginBottom: '30px'}} loading={this.props.loading}*/}
                                    {/*                                error={token.errs.non_field_errors}>*/}
                                    {/*                              <Form.Group grouped>*/}
                                    {/*                                  <Form.Input*/}
                                    {/*                                      label={'token address'}*/}
                                    {/*                                      value={token.addr} onChange={this.props.input_skip_token} name={'addr'}*/}
                                    {/*                                      error={token.errs.addr}*/}
                                    {/*                                  />*/}
                                    {/*                                  <Form.Input type={'number'}*/}
                                    {/*                                      label={'token quantity'}*/}
                                    {/*                                      value={token.qnty} onChange={this.props.input_skip_token} name={'qnty'}*/}
                                    {/*                                      error={token.errs.qnty}*/}
                                    {/*                                  />*/}
                                    {/*                                  <Form.Select*/}
                                    {/*  fluid*/}
                                    {/*  label='Donor'*/}
                                    {/*  options={this.props.donors.map(x=> ({ "key": x.id, "text": x.name, 'value': x.id}),)}*/}
                                    {/*  value={token.donor}*/}
                                    {/*  name={'donor'}*/}
                                    {/*  onChange={this.props.input_skip_token}*/}
                                    {/*/>*/}

                                    {/*                              </Form.Group>*/}
                                    {/*                              <Form.Group inline>*/}
                                    {/*                                  <Form.Button*/}
                                    {/*                                      onClick={() => this.props.updateAsset(token)}>Update</Form.Button>*/}
                                    {/*                                  <Form.Button*/}
                                    {/*                                      onClick={() => this.props.deleteAsset(token.id)}>Delete</Form.Button>*/}
                                    {/*                              </Form.Group>*/}
                                    {/*                          </Form>*/}
                                </Accordion.Content>

                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}


class Limits extends React.Component {


    render() {
        return (

            <Segment inverted style={{backgroundColor: "#151719"}}>
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
                                    {token.addr} | {token.name}


                                    {/*{this.props.donors.find(x => x.id === token.donor)['name']}*/}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <div style={{display: "flex", marginBottom: 15}}>
                                        <TextField
                                            size="small"
                                            color="default"
                                            variant="outlined"
                                            fullWidth
                                            style={{width: 500}}
                                            value={token.name}
                                            onChange={this.props.token_name_change}
                                            name={'name'}
                                            label={'token name'}
                                            error={token.errs.name}
                                        />
                                        <Button size="small" style={{marginLeft: 10}}
                                                onClick={() => this.props.update(token)}
                                                variant="contained">
                                            Save name
                                        </Button>
                                        <Button size="small" style={{marginLeft: 10}}
                                                onClick={() => this.props.delete(token.id)}
                                                variant="contained">
                                            Delete token
                                        </Button>
                                    </div>

                                    <Table style={{backgroundColor: "transparent"}} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Slippage</TableCell>
                                                <TableCell>Current price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Fast gas + gwei</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Active</TableCell>
                                                <TableCell>Save</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {token.limit_assets.map(limit_token => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>

                                                            <Select
                                                                fullWidth
                                                                name={"type"}
                                                                margin="dense"
                                                                id={limit_token.id}
                                                                error={limit_token.errs.type}
                                                                onChange={this.props.input_skip_token}
                                                                value={limit_token.type}
                                                            >
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'type'}
                                                                          value={'take profit'} id={'take profit'}
                                                                          key={'take profit'}>take profit
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'type'}
                                                                          value={'buy'} id={'buy'}
                                                                          key={'buy'}>buy
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'type'}
                                                                          value={'sell'} id={'sell'}
                                                                          key={'sell'}>sell
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'type'}
                                                                          value={'stop loss'} id={'stop loss'}
                                                                          key={'stop loss'}>stop loss
                                                                </MenuItem>
                                                            </Select>

                                                            {/*<Form.Select*/}
                                                            {/*    fluid*/}
                                                            {/*    id={limit_token.id}*/}
                                                            {/*    options={[{key: 'buy', text: 'buy', value: 'buy'},*/}
                                                            {/*        {key: 'sell', text: 'sell', value: 'sell'},*/}
                                                            {/*        {*/}
                                                            {/*            key: 'take profit',*/}
                                                            {/*            text: 'take profit',*/}
                                                            {/*            value: 'take profit'*/}
                                                            {/*        },*/}
                                                            {/*        {*/}
                                                            {/*            key: 'stop loss',*/}
                                                            {/*            text: 'stop loss',*/}
                                                            {/*            value: 'stop loss'*/}
                                                            {/*        }]}*/}
                                                            {/*    value={limit_token.type}*/}
                                                            {/*    name={'type'}*/}
                                                            {/*    error={limit_token.errs.type}*/}
                                                            {/*    onChange={this.props.input_skip_token}*/}
                                                            {/*/>*/}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="outlined"
                                                                fullWidth
                                                                id={limit_token.id}
                                                                value={limit_token.price}
                                                                onChange={this.props.input_skip_token}
                                                                name={'price'}
                                                                error={limit_token.errs.price}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="outlined"
                                                                fullWidth
                                                                id={limit_token.id}
                                                                value={limit_token.slippage}
                                                                onChange={this.props.input_skip_token}
                                                                name={'slippage'}
                                                                error={limit_token.errs.slippage}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="outlined"
                                                                fullWidth
                                                                disabled={true}
                                                                id={limit_token.id}
                                                                value={limit_token.curr_price}
                                                                onChange={this.props.input_skip_token}
                                                                name={'curr_price'}
                                                                error={limit_token.errs.curr_price}
                                                            />
                                                        </TableCell>


                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="outlined"
                                                                fullWidth
                                                                id={limit_token.id}
                                                                value={limit_token.qnty}
                                                                onChange={this.props.input_skip_token}
                                                                name={'qnty'}
                                                                error={limit_token.errs.qnty}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="outlined"
                                                                fullWidth
                                                                id={limit_token.id}
                                                                value={limit_token.gas_plus}
                                                                onChange={this.props.input_skip_token}
                                                                name={'gas_plus'}
                                                                error={limit_token.errs.gas_plus}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                fullWidth
                                                                value={limit_token.status}
                                                                name={'status'}
                                                                onChange={this.props.input_skip_token}
                                                                margin="dense"
                                                                disabled={true}
                                                                id={limit_token.id}
                                                                error={limit_token.errs.type}
                                                            >
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'running'}
                                                                          value={'running'} id={'running'}
                                                                          key={'running'}>running
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'stopped'}
                                                                          value={'stopped'} id={'stopped'}
                                                                          key={'stopped'}>stopped
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'failed'}
                                                                          value={'failed'} id={'failed'}
                                                                          key={'failed'}>failed
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'executed'}
                                                                          value={'executed'} id={'executed'}
                                                                          key={'executed'}>executed
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black"}} name={'pending'}
                                                                          value={'pending'} id={'pending'}
                                                                          key={'pending'}>pending
                                                                </MenuItem>
                                                            </Select>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Checkbox name={'active'}
                                                                      slider
                                                                      id={limit_token.id}
                                                                      checked={limit_token.active}
                                                                      onChange={this.props.input_skip_token}

                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                                <Button
                                                                    onClick={() => this.props.updateAsset(limit_token)}
                                                                    variant="contained">
                                                                    Save
                                                                </Button>
                                                                <Button style={{marginTop: 10}}
                                                                        onClick={() => this.props.deleteAsset(limit_token.id)}
                                                                        variant="contained">
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow>
                                                <TableCell>
                                                    <Select
                                                        fullWidth
                                                        margin="dense"
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.type}
                                                        name={'type'}
                                                        onChange={this.props.input_skip_token}
                                                        error={this.props.new_limit.errs.type}
                                                    >
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'type'}
                                                                  value={'take profit'} id={'take profit'}
                                                                  key={'take profit'}>take profit
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'type'}
                                                                  value={'buy'} id={'buy'}
                                                                  key={'buy'}>buy
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'type'}
                                                                  value={'sell'} id={'sell'}
                                                                  key={'sell'}>sell
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'type'}
                                                                  value={'stop loss'} id={'stop loss'}
                                                                  key={'stop loss'}>stop loss
                                                        </MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        fullWidth
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.price}
                                                        onChange={this.props.input_skip_token}
                                                        name={'price'}
                                                        error={this.props.new_limit.errs.price}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        fullWidth
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.slippage}
                                                        onChange={this.props.input_skip_token}
                                                        name={'slippage'}
                                                        error={this.props.new_limit.errs.slippage}
                                                    />

                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        fullWidth
                                                        id={this.props.new_limit.id}
                                                        disabled={true}
                                                        value={this.props.new_limit.curr_price}
                                                        onChange={this.props.input_skip_token}
                                                        name={'curr_price'}
                                                        error={this.props.new_limit.errs.curr_price}
                                                    />
                                                </TableCell>


                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        fullWidth
                                                        type={'number'}
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.qnty}
                                                        onChange={this.props.input_skip_token}
                                                        name={'qnty'}
                                                        error={this.props.new_limit.errs.qnty}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        fullWidth
                                                        type={'number'}
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.gas_plus}
                                                        onChange={this.props.input_skip_token}
                                                        name={'gas_plus'}
                                                        error={this.props.new_limit.errs.gas_plus}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Select
                                                        fullWidth
                                                        margin="dense"
                                                        disabled={true}
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.status}
                                                        name={'status'}
                                                        onChange={this.props.input_skip_token}
                                                    >
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'running'}
                                                                  value={'running'} id={'running'}
                                                                  key={'running'}>running
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'stopped'}
                                                                  value={'stopped'} id={'stopped'}
                                                                  key={'stopped'}>stopped
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'failed'}
                                                                  value={'failed'} id={'failed'}
                                                                  key={'failed'}>failed
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'executed'}
                                                                  value={'executed'} id={'executed'}
                                                                  key={'executed'}>executed
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black"}} name={'pending'}
                                                                  value={'pending'} id={'pending'}
                                                                  key={'pending'}>pending
                                                        </MenuItem>
                                                    </Select>
                                                </TableCell>

                                                <TableCell>
                                                    <Checkbox name={'active'}
                                                              slider
                                                              id={this.props.new_limit.id}
                                                              checked={this.props.new_limit.active}
                                                              onChange={this.props.input_skip_token}

                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => this.props.updateAsset(this.props.new_limit)}
                                                        variant="contained">
                                                        Create
                                                    </Button>

                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
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
        donors: [{
            "id": 1,
            "fixed_value_trade": 0.1,
            "percent_value_trade": 100,
            "gas_multiplier": 1.1,
            "slippage": 5,
            "follow_max": 999,
            "follow_min": 0.00001,
            "retry_count": 0,
            "errs": {},
            "name": "new donor",
            "addr": "0xa89Acf1c5E133D3917319B97B5c5F77Bd99CF4c3",
            "fixed_trade": false,
            "trade_on_confirmed": false,
            "donor_slippage": true,
            "wallet": 1
        }, {
            "id": 2,
            "fixed_value_trade": 0.1,
            "percent_value_trade": 10,
            "gas_multiplier": 1.1,
            "slippage": 5,
            "follow_max": 999,
            "follow_min": 0.1,
            "retry_count": 0,
            "errs": {},
            "name": "123",
            "addr": "0x705608218789D35d9Afd761cAE3dC0D5Ec82bE67",
            "fixed_trade": true,
            "trade_on_confirmed": false,
            "donor_slippage": true,
            "wallet": 1
        }],
        assets: [{
            "id": 27,
            "donor_assets": [],
            "limit_assets": [{
                "qnty": 0.1,
                "price": 1,
                "errs": {},
                "id": 29,
                "asset": 27,
                "addr": "0x1C21d179BBcd6b3ff60a9CF5585C5828E091de9E",
                "active": false,
                "tx_hash": "0x53d9775d4380324878edd336ea400936f6d8982eaa53de4f70a28b4afd6bad02",
                "type": "buy",
                "status": "executed",
                "gas_plus": 3,
                "curr_price": 0.005515045135406219,
                "decimals": 18,
                "name": "dothis",
                "slippage": 5
            }, {
                "qnty": 0.11,
                "price": 0.005,
                "errs": {},
                "id": 30,
                "asset": 27,
                "addr": "0x1C21d179BBcd6b3ff60a9CF5585C5828E091de9E",
                "active": false,
                "tx_hash": "0x895245d16a8e80ff8c0610de8241495db98e38ca938ec1337ee32eb0566bd63f",
                "type": "buy",
                "status": "executed",
                "gas_plus": 34,
                "curr_price": 0.004991255432077238,
                "decimals": 18,
                "name": "dothis",
                "slippage": 5
            }, {
                "qnty": 1,
                "price": 1,
                "errs": {},
                "id": 32,
                "asset": 27,
                "addr": "0x1C21d179BBcd6b3ff60a9CF5585C5828E091de9E",
                "active": false,
                "tx_hash": null,
                "type": "sell",
                "status": "running",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": 18,
                "name": "dothis",
                "slippage": 5
            }, {
                "qnty": 1,
                "price": 1,
                "errs": {},
                "id": 33,
                "asset": 27,
                "addr": "0x1C21d179BBcd6b3ff60a9CF5585C5828E091de9E",
                "active": false,
                "tx_hash": null,
                "type": "sell",
                "status": "stopped",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": 18,
                "name": "dothis",
                "slippage": 6
            }],
            "name": "dothis",
            "errs": {},
            "addr": "0x1C21d179BBcd6b3ff60a9CF5585C5828E091de9E",
            "balance": "",
            "decimals": 18,
            "price_for_token": null,
            "wallet": 1
        }, {
            "id": 31,
            "donor_assets": [],
            "limit_assets": [{
                "qnty": 6,
                "price": 123,
                "errs": {},
                "id": 38,
                "asset": 31,
                "addr": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                "active": false,
                "tx_hash": null,
                "type": "take profit",
                "status": "stopped",
                "gas_plus": 2,
                "curr_price": null,
                "decimals": 18,
                "name": "Uniswap",
                "slippage": 5
            }],
            "name": "Uniswap",
            "errs": {},
            "addr": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            "balance": "",
            "decimals": 18,
            "price_for_token": null,
            "wallet": 1
        }, {
            "id": 33,
            "donor_assets": [{
                "qnty": 123,
                "donor": 1,
                "errs": {},
                "id": 28,
                "asset": 33,
                "addr": "0x9E3D09A7Db7d4F9AC714a59ce7eac1Af4A52B776",
                "decimals": null,
                "name": ""
            }],
            "limit_assets": [{
                "qnty": 1,
                "price": 1,
                "errs": {},
                "id": 37,
                "asset": 33,
                "addr": "0x9E3D09A7Db7d4F9AC714a59ce7eac1Af4A52B776",
                "active": false,
                "tx_hash": null,
                "type": "sell",
                "status": "stopped",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": null,
                "name": "",
                "slippage": 1
            }],
            "name": "",
            "errs": {},
            "addr": "0x9E3D09A7Db7d4F9AC714a59ce7eac1Af4A52B776",
            "balance": "",
            "decimals": null,
            "price_for_token": null,
            "wallet": 1
        }, {
            "id": 34,
            "donor_assets": [{
                "qnty": 10,
                "donor": 1,
                "errs": {},
                "id": 26,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "decimals": 9,
                "name": "ghj"
            }, {
                "qnty": 0.06,
                "donor": 2,
                "errs": {},
                "id": 27,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "decimals": 9,
                "name": "ghj"
            }],
            "limit_assets": [{
                "qnty": 123,
                "price": 1,
                "errs": {},
                "id": 34,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "active": false,
                "tx_hash": null,
                "type": "buy",
                "status": "stopped",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": 9,
                "name": "ghj",
                "slippage": 6
            }, {
                "qnty": 1,
                "price": 1,
                "errs": {},
                "id": 35,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "active": false,
                "tx_hash": null,
                "type": "sell",
                "status": "stopped",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": 9,
                "name": "ghj",
                "slippage": 5
            }, {
                "qnty": 1234,
                "price": 1321,
                "errs": {},
                "id": 36,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "active": false,
                "tx_hash": null,
                "type": "take profit",
                "status": "stopped",
                "gas_plus": 35,
                "curr_price": null,
                "decimals": 9,
                "name": "ghj",
                "slippage": 54
            }, {
                "qnty": 5,
                "price": 123,
                "errs": {},
                "id": 39,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "active": false,
                "tx_hash": null,
                "type": "stop loss",
                "status": "stopped",
                "gas_plus": 1,
                "curr_price": null,
                "decimals": 9,
                "name": "ghj",
                "slippage": 4
            }, {
                "qnty": 0,
                "price": 1,
                "errs": {},
                "id": 41,
                "asset": 34,
                "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
                "active": false,
                "tx_hash": null,
                "type": "stop loss",
                "status": "stopped",
                "gas_plus": 3,
                "curr_price": null,
                "decimals": 9,
                "name": "ghj",
                "slippage": 3
            }],
            "name": "ghj",
            "errs": {},
            "addr": "0xE9dccd5c218582C6A85c3C4E8a9Ff5005375A919",
            "balance": "",
            "decimals": 9,
            "price_for_token": null,
            "wallet": 1
        }, {
            "id": 35,
            "donor_assets": [],
            "limit_assets": [{
                "qnty": 5,
                "price": 321,
                "errs": {},
                "id": 40,
                "asset": 35,
                "addr": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                "active": false,
                "tx_hash": null,
                "type": "take profit",
                "status": "stopped",
                "gas_plus": 5,
                "curr_price": null,
                "decimals": 18,
                "name": "Dai Stablecoin",
                "slippage": 5
            }],
            "name": "Dai Stablecoin",
            "errs": {},
            "addr": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
            "balance": "",
            "decimals": 18,
            "price_for_token": null,
            "wallet": 1
        }],
        // assets: [],
        loading: false,
        wallet_connected: true,
        new_donor: {...default_new_donor},
        new_donor_token: {...default_new_donor_token},
        new_skip_token: {...default_new_skip_token},
        new_token: {...default_new_token},
        new_limit: {...default_new_limit},
        errs: {},
        modal: false,
        activeItem: 'Limit orders',
        activeIndexAccordion: -1
    }
;


class GetWallet extends React.Component {


    constructor(props) {
        super(props);
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
    }


    token_name_change(event) {
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
        // return cookieValue;
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


            })
            .catch(err => {


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

    closeModal = (e) => {
        e.preventDefault();
        this.setState({modal: false});
    }

    renderForm = () => {
        if (this.state.activeItem === 'Donors')
            return <div style={{backgroundColor: "#151719"}}>
                <h3>Donor wallets</h3>


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
                                        <Icon name='plus circle'/>
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
                                            <Grid divided='vertically'>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <div style={{border: "1px solid #16b157", padding: 10}}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 1
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus
                                                            nobis omnis, perspiciatis placeat praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column>
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
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
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
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <div style={{border: "1px solid #16b157", padding: 10}}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 2
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus
                                                            nobis omnis, perspiciatis placeat praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>

                                            <Grid divided='vertically'>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <div style={{border: "1px solid #16b157", padding: 10}}>
                                                            <h3 style={{fontFamily: 'Montserrat'}}>
                                                                Шаг 3
                                                            </h3>
                                                            <br style={{marginTop: 15}}/>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Accusamus aliquam aliquid animi asperiores dignissimos
                                                            doloremque ea facilis id ipsum molestias natus
                                                            necessitatibus
                                                            nobis omnis, perspiciatis placeat praesentium, quam quo rem.
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column>
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
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Button
                                                size="small" variant="contained"
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
                <h5>
                    Blacklist - token you don't want to trade, for example all USD tokens or any other tokens
                </h5>
                <ul>
                    <li>You can make your own non trade list, add and remove any token</li>
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
            return <div style={{backgroundColor: "#151719"}}>
                <h5>
                    Use this Form to remove a token from bot`s memory if you :
                </h5>
                <ul>
                    <li>Don't want to follow donor sell ( want to keep it and sell manually)</li>
                    <li>Sold a token before donor</li>
                    <li>You can also add token to bots memory and change a donor</li>


                </ul>

                <Tokens tokens={this.state.assets} key={this.state.key} donors={this.state.donors}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr} input_donor_token={this.input_donor_token}
                        handleClick={this.handleClick} token_name_change={this.token_name_change}
                        update={this.update_asset_name} delete={this.deleteTokenFull}
                        new_token={this.state.new_donor_token}
                        updateAsset={this.updateDonorToken} deleteAsset={this.deleteToken}
                        loading={this.state.loading}/>

                <Segment inverted style={{backgroundColor: "#151719"}}>
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
                                <TextField
                                    isinput={true}
                                    size="small"
                                    color="default"
                                    type="number"
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
                                        <Button size="small" onClick={() => this.updateToken(this.state.new_token)}
                                                variant="contained">
                                            Add token
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Accordion.Content>

                        </div>

                    </Accordion>
                </Segment>

            </div>
        else if (this.state.activeItem === 'Limit orders')
            return <div>

                <Limits tokens={this.state.assets} key={this.state.key} donors={this.state.donors}
                        activeIndexAccordion={this.state.activeIndexAccordion}
                        addr={this.state.addr} input_skip_token={this.input_change_limit}
                        handleClick={this.handleClick} token_name_change={this.token_name_change}
                        update={this.update_asset_name} delete={this.deleteTokenFull}
                        updateAsset={this.updateLimit} deleteAsset={this.deleteLimit} loading={this.state.loading}
                        new_limit={this.state.new_limit}/>
                <Segment inverted style={{backgroundColor: "#151719"}}>
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
                                                variant="contained">
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
                            <Button onClick={this.closeModal}>Agreed</Button>
                        </div>

                        }
                    />

                    {/*<Form inverted style={{marginBottom: '30px'}} loading={this.state.loading}*/}
                    {/*      error={this.state.errs.non_field_errors} warning={this.state.initial_state}>*/}
                    {this.state.errs.non_field_errors ? <Message
                        error
                        header='Validation error'
                        content={this.state.errs.non_field_errors}
                    /> : null}
                    {this.state.initial_state ? <Message
                        warning
                        header='First set up'
                        content={'This is your first bot set up, please update main fields in wallet tab, make sure telegram id is filled'}/> : null}

                    {/*<Form.Input fluid label='Wallet' name={'addr'} placeholder='Your wallet address'*/}
                    {/*            value={this.state.addr} onChange={this.handleInputChange}*/}
                    {/*            error={this.state.errs.addr}/>*/}
                    <TextField
                        size="small"
                        label="Wallet"
                        name={'addr'}
                        fullWidth
                        color="default"
                        placeholder="Your wallet address"
                        value={this.state.addr} onChange={this.handleInputChange}
                        error={this.state.errs.addr}
                        variant="outlined"
                        disabled={true}
                        style={{marginBottom: 20}}
                    />

                    <TextField
                        size="small"
                        label="Key"
                        name={'key'}
                        fullWidth
                        color="default"
                        placeholder="Wallet Key. Only bot has access to it"
                        value={this.state.key} onChange={this.handleInputChange}
                        error={this.state.errs.key}
                        variant="outlined"
                        type="password"
                        disabled={true}
                        style={{marginBottom: 20}}
                    />

                    {/*<Form.Input fluid type={'password'} label='Key' name={'key'}*/}
                    {/*            placeholder='Wallet Key. Only bot has access to it'*/}
                    {/*            value={this.state.key} onChange={this.handleInputChange}*/}
                    {/*            error={this.state.errs.key}/>*/}


                    <div style={{display: "flex"}}>
                        <Button style={{marginRight: 10}} size="small" type='submit' onClick={() => this.updateWallet()}
                                variant="contained"
                                disabled={!this.state.wallet_connected}>Update wallet
                        </Button>
                        {/*<Form.Button type='submit' size="mini" onClick={this.updateWallet} variant="contained"*/}
                        {/*             style={{*/}
                        {/*                 backgroundColor: 'rgb(153,89,51)',*/}
                        {/*             }} disabled={!this.state.wallet_connected}>Update wallet</Form.Button>*/}
                        <Button style={{marginRight: 10}} size="small" onClick={() => this.activateWallet()}
                                variant="contained"
                                disabled={!this.state.wallet_connected || this.state.initial_state === true}>
                            {this.state.active ? 'Stop bot' : 'Run bot'}
                        </Button>
                        {/*<Form.Button size="mini" disabled={!this.state.wallet_connected || this.state.initial_state === true}*/}
                        {/*             onClick={this.activateWallet}>{this.state.active ? 'Stop bot' : 'Run bot'}</Form.Button>*/}

                        <Button style={{marginRight: 10}} size="small" onClick={() => this.getWallet()}
                                variant="contained"
                                disabled={this.state.wallet_connected}>
                            {this.state.wallet_connected ? 'Wallet connected' : 'Connect wallet'}
                        </Button>

                        {/*<Form.Button size="mini" onClick={this.getWallet}*/}
                        {/*             disabled={this.state.wallet_connected}>{this.state.wallet_connected ? 'Wallet connected' : 'Connect wallet'}</Form.Button>*/}

                        <Button style={{marginRight: 10}} size="small" onClick={() => this.refreshBalances()}
                                variant="contained"
                                disabled={!this.state.wallet_connected || !this.state.mainnet}>
                            Refresh balances
                        </Button>

                        {/*<Form.Button size="mini" onClick={this.refreshBalances}*/}
                        {/*             disabled={!this.state.wallet_connected || !this.state.mainnet}> Refresh*/}
                        {/*    balances</Form.Button>*/}
                    </div>


                    {/*<Form.Group grouped>*/}

                    <TextField
                        size="small"
                        label="Telegram"
                        name={'telegram_channel_id'}
                        fullWidth
                        color="default"
                        placeholder="Your telegram channel id for notifications, must be negative 13 digit number"
                        value={this.state.telegram_channel_id} onChange={this.handleInputChange}
                        error={this.state.errs.telegram_channel_id}
                        variant="outlined"
                        type="number"
                        InputLabelProps={{shrink: true}}
                        style={{marginBottom: 20, marginTop: 20}}
                    />

                    {/*<Form.Input fluid type={'number'} label='Telegram' name={'telegram_channel_id'}*/}
                    {/*            placeholder='Your telegram channel id for notifications, must be negative 13 digit number'*/}
                    {/*            value={this.state.telegram_channel_id} onChange={this.handleInputChange}*/}
                    {/*            error={this.state.errs.telegram_channel_id}/>*/}
                    <p style={{fontSize: '14px', marginBottom: '1px'}}>
                        1. Create new private channel on telegram (any name) <br/>
                        2. Add your bot as admin <br/>
                        3. Get your telegram id <br/>
                        4. Easiest way to get telegram ID is to forward a message to the @userinfobot bot from your new
                        channel
                    </p>


                    <Form size="mini" inverted style={{marginBottom: '15px', marginTop: '15px'}}>
                        <Form.Group inline>
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

                        </Form.Group>
                    </Form>

                    <TextField
                        size="small"
                        label="Max gas (gwei)"
                        name={'max_gas'}
                        fullWidth
                        color="default"
                        placeholder=""
                        value={this.state.max_gas} onChange={this.handleInputChange}
                        error={this.state.errs.max_gas}
                        variant="outlined"
                        type="number"
                        InputLabelProps={{shrink: true}}
                        style={{marginBottom: 20}}
                    />

                    {/*<Form.Input fluid label='Max gas (gwei)' name={'max_gas'} type={'number'}*/}
                    {/*            placeholder=''*/}
                    {/*            value={this.state.max_gas} onChange={this.handleInputChange}*/}
                    {/*            error={this.state.errs.max_gas}/>*/}
                    <p style={{fontSize: '14px'}}>Put your Max gas (GWEI) ,bot will not follow if gas is higher.
                        you
                        can always adjust higher</p>
                    {/*</Form.Group>*/}

                    <div style={{width: '100%', marginBottom: 30}}>
                        <TextField
                            size="small"
                            type={'number'}
                            label='Waps balance' name={'waps_balance'}
                            color="default"
                            placeholder="Your wallet address"
                            value={this.state.waps_balance / 10 ** 18} onChange={this.handleInputChange}
                            disabled={true}
                            variant="outlined"
                            style={{width: '31%', marginRight: 15}}
                        />
                        <TextField
                            size="small"
                            type={'number'}
                            label='Weth balance' name={'weth_balance'}
                            color="default"
                            placeholder="Your wallet address"
                            value={this.state.weth_balance / 10 ** 18} onChange={this.handleInputChange}
                            disabled={true}
                            variant="outlined"
                            style={{width: '31%', marginRight: 15}}
                        />
                        <TextField
                            size="small"
                            type={'number'}
                            label='Eth balance' name={'eth_balance'}
                            color="default"
                            placeholder="Your wallet address"
                            value={this.state.eth_balance / 10 ** 18} onChange={this.handleInputChange}
                            disabled={true}
                            variant="outlined"
                            style={{width: '31%', marginRight: 15}}
                        />
                    </div>


                    {/*</Form>*/}

                    <div style={{display: "flex"}}>
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
                                    />
                                    <Menu.Item
                                        style={{color: "white"}}
                                        name='BotMemory'
                                        active={this.state.activeItem === 'BotMemory'}
                                        onClick={this.handleItemClick}
                                        disabled={this.state.initial_state}
                                    />
                                    <Menu.Item
                                        style={{color: "white"}}
                                        name='Limit orders'
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
