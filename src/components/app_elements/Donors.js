import React from "react";
import {Accordion, Form, Grid, Icon, Message, Segment} from "semantic-ui-react";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

export class Donors extends React.Component {


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

                                                    <Button color="secondary" style={{marginLeft: 20}} size="small" onClick={() => this.props.updateDonor(donor)}
                                                            variant="outlined">
                                                        Update
                                                    </Button>
                                                    <Button color="secondary" style={{marginLeft: 10}} size="small" onClick={() => this.props.deleteDonor(donor.addr)}
                                                            variant="contained">
                                                        Delete
                                                    </Button>



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
