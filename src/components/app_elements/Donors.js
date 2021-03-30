import React from "react";
import {Accordion, Form, Message, Segment} from "semantic-ui-react";
import {TextField, Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {ReactComponent as MoreVertIcon} from "../../icons/more_vert.svg"
import {ReactComponent as InfoIcon} from "../../icons/info.svg";

export class Donors extends React.Component {


    render() {
        return (
            <Segment inverted style={{backgroundColor: "#191B1E"}}>
                <Accordion fluid inverted>
                    {
                        this.props.donors.map(donor => (
                                <div style={{width: "100%"}}>
                                    <Accordion.Title
                                        style={{
                                            backgroundColor: "#24272A",
                                            borderRadius: "5px",
                                            width: "100%",
                                            display: "flex",
                                            marginTop: 20
                                        }}
                                        active={this.props.activeIndexAccordion === donor.id}
                                        index={donor.id}
                                        onClick={this.props.handleClick}
                                    >
                                        <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                            <span className="accordion-header">{donor.name}</span>
                                            <MoreVertIcon className="accordion-icon"/>
                                        </div>

                                    </Accordion.Title>
                                    <Accordion.Content active={this.props.activeIndexAccordion === donor.id}>
                                        <span className="accordion-header-text">
                                            Main info
                                        </span>
                                        <div className="space-after-header"></div>
                                        <form style={{marginBottom: '30px', fontFamily: 'Roboto, sans-serif'}}>
                                            {donor.errs.non_field_errors ? <Message
                                                error
                                                header='Validation error'
                                                content={donor.errs.non_field_errors}
                                            /> : null}

                                            <TextField
                                                label="Name"
                                                size="small"
                                                name={'name'}
                                                color="default"
                                                value={donor.name} onChange={this.props.input_change}
                                                error={donor.errs.name}
                                                variant="outlined"
                                                fullWidth
                                                style={{marginBottom: 10}}
                                            />
                                            <TextField
                                                label="Address"
                                                size="small"
                                                name={'name'}
                                                color="default"
                                                value={donor.addr} onChange={this.props.input_change}
                                                variant="outlined"
                                                fullWidth
                                                error={donor.errs.addr}
                                                style={{marginBottom: 10, marginTop: 15}}

                                            />
                                            <Form.Checkbox label='Fixed trade' name={'fixed_trade'}
                                                           className="checkbox-custom"
                                                           checked={donor.fixed_trade}
                                                           onChange={this.props.input_change}

                                            />
                                            <div style={{display: "flex", marginTop: 25}}>
                                                <TextField
                                                    size="small"
                                                    type='number'
                                                    color="default"
                                                    label='Fixed trade value (WBNB)'
                                                    name={'fixed_value_trade'}
                                                    placeholder='Fixed trade value (WBNB)'
                                                    value={donor.fixed_value_trade}
                                                    onChange={this.props.input_change}
                                                    error={donor.errs.fixed_value_trade}
                                                    variant="outlined"
                                                    style={{marginBottom: 10, width: "50%"}}
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
                                                    type='number'
                                                    color="default"
                                                    label='Percent trade value (%)'
                                                    name={'percent_value_trade'}
                                                    placeholder=''
                                                    value={donor.percent_value_trade}
                                                    onChange={this.props.input_change}
                                                    error={donor.errs.percent_value_trade}
                                                    variant="outlined"
                                                    style={{marginBottom: 10, width: "50%"}}
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

                                                               checked={donor.donor_slippage}
                                                               onChange={this.props.input_change}
                                                               error={donor.errs.donor_slippage}
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

                                            <div style={{display: "flex", marginTop: 25, alignItems: "center"}}>
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
                                                    style={{marginBottom: 10, width: "50%"}}
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
                                                    type='number'
                                                    color="default"
                                                    label='Gas multiplier'
                                                    name={'gas_multiplier'}
                                                    value={donor.gas_multiplier}
                                                    onChange={this.props.input_change}
                                                    error={donor.errs.gas_multiplier}
                                                    variant="outlined"
                                                    style={{marginBottom: 10, width: "50%"}}
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
                                            <div style={{display: "flex"}}>
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
                                                    style={{marginBottom: 10, width: "50%"}}
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
                                                    type='number'
                                                    color="default"
                                                    label='Maximum value to follow (eth)'
                                                    name={'follow_max'}
                                                    value={donor.follow_max}
                                                    onChange={this.props.input_change}
                                                    error={donor.errs.follow_max}
                                                    variant="outlined"
                                                    style={{marginBottom: 10, width: "50%"}}
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

                                            <div style={{display: "flex"}}>
                                                <button className="outlined-button" type='button'
                                                        style={{marginRight: 20}} onClick={() => this.props.updateDonor(donor)}
                                                >
                                                    Update
                                                </button>
                                                <button className="outlined-button" type='button'
                                                        onClick={() => this.props.deleteDonor(donor.addr)}>
                                                    Delete
                                                </button>
                                            </div>



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
