import React from "react";
import {Accordion, Form, Segment} from "semantic-ui-react";
import {MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import CallMissedOutgoingIcon from "@material-ui/icons/CallMissedOutgoing";
import IconButton from "@material-ui/core/IconButton";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {ReactComponent as MoreVertIcon} from "../../icons/more_vert.svg";

export class Tokens extends React.Component {


    render() {
        return (
            <Segment inverted style={{backgroundColor: "#191B1E"}}>
                <Accordion fluid inverted>
                    {
                        this.props.tokens.map(token => (

                            <div>
                                <Accordion.Title
                                    style={{
                                        backgroundColor: "#24272A",
                                        borderRadius: "5px",
                                        width: "100%",
                                        display: "flex",
                                        marginTop: 20
                                    }}
                                    active={this.props.activeIndexAccordion === token.id}
                                    index={token.id}
                                    onClick={this.props.handleClick}
                                >

                                    <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                        <span className="accordion-header">
                                            <span style={{width: 500}}>{token.addr}</span>
                                            <span style={{width: 150}}>{token.name}</span>
                                            {token.balance ? token.balance.toFixed(6) : token.balance}
                                        </span>
                                        <MoreVertIcon className="accordion-icon"/>
                                    </div>
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <span className="accordion-header-text">
                                            Token
                                        </span>
                                    <div className="space-after-header"></div>
                                    <Form.Group inline>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                                value={token.name}
                                                onChange={this.props.token_name_change}
                                                name={'name'}
                                                label={'Token name'}
                                                error={token.errs.name}
                                                fullWidth
                                                style={{width: 250}}
                                            />
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                marginLeft: 30
                                            }}>
                                            <span>
                                                BNB for 1 token
                                            </span>
                                                <p style={{fontSize: 18}} className="accordion-header-text">
                                                    {token.price_for_token ? token.price_for_token.toFixed(6) : token.price_for_token}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", marginTop: 20}}>
                                            <button
                                                    onClick={() => this.props.update(token)}
                                                    className="outlined-button">
                                                Save name
                                            </button>
                                            <button
                                                style={{marginLeft: 20}}
                                                onClick={() => this.props.delete(token.id)}
                                                className="outlined-button">
                                                Delete token
                                            </button>
                                        </div>

                                    </Form.Group>
                                    {/*</Form>*/}
                                    <Table style={{backgroundColor: "transparent", marginTop: 20}} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Donor</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {token.donor_assets.map(donor_token => (
                                                <TableRow style={{backgroundColor: "#24272B", marginTop: 24, border: "none", borderRadius: "5px"}}>
                                                    <TableCell>
                                                        <Select
                                                            fullWidth
                                                            name={"donor"}
                                                            margin="dense"
                                                            id={donor_token.id}
                                                            onChange={this.props.input_donor_token}
                                                            error={this.props.new_token.errs.donor}
                                                            value={donor_token.donor}
                                                            style={{paddingLeft: 15}}
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
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{display: "flex", flexDirection: "row", margin: 0}}>
                                                            <span>{donor_token.qnty}</span>
                                                            <IconButton size={'small'} color="secondary"
                                                                        aria-label="delete"
                                                                        onClick={() => this.props.handleSetMax(token.id, donor_token.id, "donor_assets")}>
                                                                <CallMissedOutgoingIcon fontSize="small"/>
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>


                                                    <TableCell>
                                                        <div style={{
                                                            display: "flex",
                                                        }}>
                                                            <IconButton style={{color: '#23a575'}} size={'small'}
                                                                        aria-label="delete" variant="outlined"
                                                                        onClick={() => this.props.updateAsset(donor_token)}>
                                                                <SaveOutlinedIcon fontSize="small"/>
                                                            </IconButton>

                                                            <IconButton style={{color: '#b23434'}} size={'small'}
                                                                        aria-label="delete"
                                                                        onClick={() => this.props.deleteAsset(donor_token.id)}>
                                                                <DeleteIcon fontSize="small"/>
                                                            </IconButton>


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
                                                        style={{paddingLeft: 15}}
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
                                                    <div style={{display: "flex", flexDirection: "row", margin: 0}}>
                                                        <span>{this.props.new_token.qnty}</span>
                                                        <IconButton size={'small'} color="secondary" aria-label="delete"
                                                                    onClick={() => this.props.handleSetMax(token.id, this.props.new_token.id, "donor_assets")}>
                                                            <CallMissedOutgoingIcon fontSize="small"/>
                                                        </IconButton>
                                                    </div>
                                                </TableCell>


                                                <TableCell>
                                                    <IconButton aria-label="delete"
                                                                onClick={() => this.props.updateAsset(this.props.new_token)}
                                                                style={{color: '#23a575'}} size="small">
                                                        <AddIcon fontSize="small"/>
                                                    </IconButton>

                                                </TableCell>

                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                    <div style={{display: "flex"}}>
                                        <button style={{marginRight: 10}}
                                                onClick={() => this.props.refreshTokenBalance(token)}
                                                className="outlined-button">
                                            Refresh token balance
                                        </button>
                                        <button style={{marginRight: 10}}
                                                onClick={() => this.props.refreshTokenPrice(token)}
                                                className="outlined-button">
                                            Refresh token price
                                        </button>
                                        <button style={{marginRight: 10}}
                                                onClick={() => this.props.handleApprove(token)}
                                                className="outlined-button">
                                            Approve
                                        </button>
                                        <span style={{
                                            color: this.props.approveResponse.error ? "red" : "white",
                                            fontSize: 14
                                        }}>
                                        {token.id === this.props.approveResponse.id && this.props.approveResponse.text}
                                    </span>
                                    </div>

                                </Accordion.Content>
                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}
