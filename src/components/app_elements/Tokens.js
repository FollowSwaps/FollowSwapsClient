import React from "react";
import {Accordion, Form, Icon, Segment} from "semantic-ui-react";
import {MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";

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

                                    <Icon name='dropdown'/>
                                    {token.addr} | {token.name} | {token.balance}


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
                                        <span style={{fontSize: 14}}>eth per 1 token price: {token.price_for_token}</span>
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
                                    {/*  refresh token balance, refresh token price и approve  */}
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.refreshTokenBalance(token)}
                                            variant="contained">
                                        Refresh token balance
                                    </Button>
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.refreshTokenPrice(token)}
                                            variant="contained">
                                        Refresh token price
                                    </Button>
                                    <Button style={{marginRight: 10}}
                                            onClick={() => this.props.handleApprove(token)}
                                            variant="contained">
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
