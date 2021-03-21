import React from "react";
import {Accordion, Form, Icon, Segment} from "semantic-ui-react";
import {MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import CallMissedOutgoingIcon from "@material-ui/icons/CallMissedOutgoing";
import IconButton from "@material-ui/core/IconButton";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

export class Tokens extends React.Component {


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

                                    <Icon name='dropdown' style={{color: "#995933"}}/>
                                    {token.addr} <span style={{color: '#995933'}}>|</span> {token.name} <span style={{color: '#995933'}}>|</span> {token.balance ? token.balance.toFixed(6):token.balance }


                                    {/*{this.props.donors.find(x => x.id === token.donor)['name']}*/}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    {/*<Form inverted>*/}
                                    <Form.Group inline>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            color="default"
                                            value={token.name}
                                            onChange={this.props.token_name_change}
                                            name={'name'}
                                            label={'token name'}
                                            error={token.errs.name}
                                            fullWidth
                                            style={{width: 250,marginBottom: 10}}
                                        />
                                        <TextField
                                            size="small"
                                            color="default"
                                            disabled={true}
                                            variant="standard"
                                            fullWidth
                                            style={{width: 250,marginBottom: 10,marginLeft: 10}}
                                            value={token.price_for_token.toFixed(6)}

                                            name={'name'}
                                            label={'ETH for 1 token'}
                                            error={token.errs.name}

                                        /></div>
                                        {/*<Form.Input*/}
                                        {/*    size={"mini"}*/}
                                        {/*    value={token.name}*/}
                                        {/*    onChange={this.props.token_name_change}*/}
                                        {/*    name={'name'}*/}
                                        {/*    label={'token name'}*/}
                                        {/*    error={token.errs.name}*/}
                                        {/*/>*/}

                                        <div style={{display: "flex"}}>
                                            <Button style={{marginRight: 10}}
                                                    onClick={() => this.props.update(token)}
                                                    color="secondary" variant="outlined" size="small">
                                                Save name
                                            </Button>
                                            <Button color="secondary"  size="small" onClick={() => this.props.delete(token.id)}
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
                                                        <div style={{display: "flex", flexDirection: "row", margin:0}}>
                                                        <TextField
                                                            isinput={true}
                                                            size="small"
                                                            color="default"
                                                            type="number"

                                                            variant="standard"
                                                            fullWidth
                                                            id={donor_token.id}
                                                            inputProps={{id: donor_token.id}}
                                                            value={donor_token.qnty}
                                                            onChange={this.props.input_donor_token}
                                                            name={'qnty'}
                                                            error={donor_token.errs.qnty}
                                                        />
                                                        <IconButton size={'small'} color="secondary" aria-label="delete" onClick={() => this.props.handleSetMax(token.id, donor_token.id, "donor_assets")}>
                                                                <CallMissedOutgoingIcon fontSize="small"/>
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>


                                                    <TableCell>
                                                        <div style={{
                                                            display: "flex",
                                                        }}>
                                                            <IconButton style={{color:'#23a575'}} size={'small'} aria-label="delete" variant="outlined" onClick={() => this.props.updateAsset(donor_token)}>
                                                                <SaveOutlinedIcon fontSize="small"/>
                                                            </IconButton>

                                                            <IconButton style={{color:'#b23434'}} size={'small'} aria-label="delete" onClick={() => this.props.deleteAsset(donor_token.id)}>
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
                                                    <div style={{display: "flex", flexDirection: "row", margin:0}}>
                                                    <TextField
                                                        isinput={true}
                                                        size="small"
                                                        color="default"
                                                        type="number"

                                                        variant="standard"
                                                        fullWidth
                                                        id={this.props.new_token.id}
                                                        value={this.props.new_token.qnty}
                                                        onChange={this.props.input_donor_token}
                                                        name={'qnty'}
                                                        error={this.props.new_token.errs.qnty}
                                                    />
                                                    <IconButton size={'small'} color="secondary" aria-label="delete" onClick={() => this.props.handleSetMax(token.id, this.props.new_token.id, "donor_assets")}>
                                                                <CallMissedOutgoingIcon fontSize="small"/>
                                                            </IconButton>
                                                    </div>
                                                </TableCell>


                                                <TableCell>
                                                    <IconButton  aria-label="delete" onClick={() => this.props.updateAsset(this.props.new_token)} style={{color:'#23a575'}}  size="small">
                                                                    <AddIcon fontSize="small"/>
                                                                  </IconButton>

                                                </TableCell>

                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                    {/*  refresh token balance, refresh token price и approve  */}
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.refreshTokenBalance(token)}
                                            color="secondary" variant="outlined" size="small">
                                        Refresh token balance
                                    </Button>
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.refreshTokenPrice(token)}
                                            color="secondary" variant="outlined" size="small">
                                        Refresh token price
                                    </Button>
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.handleApprove(token)}
                                            color="secondary" variant="outlined" size="small">
                                        Approve
                                    </Button>
                                    <span style={{color: this.props.approveResponse.error ? "red" : "white", fontSize: 14}}>
                                        {token.id === this.props.approveResponse.id && this.props.approveResponse.text}
                                    </span>
                                </Accordion.Content>
                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}
