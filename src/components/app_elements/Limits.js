import React from "react";
import {Accordion, Icon, Segment} from "semantic-ui-react";
import {MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

export class Limits extends React.Component {


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

                                    <Icon name='dropdown' style={{color: '#995933'}}/>
                                    {token.addr} | {token.name} | {token.balance}


                                    {/*{this.props.donors.find(x => x.id === token.donor)['name']}*/}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <div style={{display: "flex", marginBottom: 15}}>
                                        <TextField
                                            size="small"
                                            color="default"
                                            variant="standard"
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
                                    <span style={{fontSize: 14}}>eth per 1 token price: {token.price_for_token.toFixed(6)}</span>

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
                                                    <TableRow >
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
                                                                variant="standard"
                                                                fullWidth
style={{width: "130px",}}
                                                                inputProps={{style: {fontSize: '10px'}}}
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
                                                            <span style={{fontSize: 14}}>{limit_token.curr_price.toFixed(6)}</span>
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
                                                        style={{width: "130px",}}
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
                                                    <span style={{fontSize: 14}}>{this.props.new_limit.curr_price}</span>
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
                                    </span>                                </Accordion.Content>
                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}
