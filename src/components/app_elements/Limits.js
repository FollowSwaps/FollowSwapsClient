import React from "react";
import {Accordion, Form, Segment} from "semantic-ui-react";
import {MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import {ReactComponent as MoreVertIcon} from "../../icons/more_vert.svg";
import {ReactComponent as InfoIcon} from "../../icons/info.svg";

export class Limits extends React.Component {


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
                                        <div style={{display: "flex", flexDirection: "row"}}>
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
                                        </div>
                                        <div style={{display: "flex",}}>
                                            <button className="outlined-button" style={{marginRight: 10}} type='button'
                                                    onClick={() => this.props.update(token)}
                                            >
                                                Save
                                            </button>
                                            <button className="outlined-button" type='button'
                                                    onClick={() => this.props.delete(token.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                    </Form.Group>


                                    <Table style={{backgroundColor: "transparent", tableLayout: 'auto'}}
                                           fixedHeader={false}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontSize: '14px'}}>Type</TableCell>
                                                <TableCell style={{fontSize: '14px'}}>Price</TableCell>
                                                <TableCell style={{fontSize: '14px'}}>
                                                    Slippage

                                                </TableCell>
                                                <TableCell style={{fontSize: '14px'}}>Current price</TableCell>
                                                <TableCell style={{fontSize: '14px'}}>Quantity</TableCell>
                                                <TableCell style={{fontSize: '14px'}}><div style={{display: "flex", alignItems: "center"}}>Gas <Tooltip title={<>
                                                    bot will use high gas + amount below
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5, fontSize:10}} />
                                                </Tooltip></div></TableCell>
                                                <TableCell style={{fontSize: '14px'}}><div style={{display: "flex", alignItems: "center"}}>Retry <Tooltip title={<>
                                                    retry count on failed tx with same slippage
                                                </>
                                                }
                                                         placement="top">
                                                    <InfoIcon style={{marginRight: 20, marginLeft: 5, fontSize:10}} />
                                                </Tooltip></div></TableCell>
                                                <TableCell style={{fontSize: '14px'}}>Status</TableCell>
                                                {/*            <TableCell style={{ fontSize: '14px' }}>Active<Tooltip title={<>*/}
                                                {/*   Tick to activate/disactivate swap*/}
                                                {/*</>*/}
                                                {/*}*/}
                                                {/*         placement="top">*/}
                                                {/*    <span style={{fontSize: '12px', marginLeft: '5px'}}>*/}
                                                {/*        🛈*/}
                                                {/*    </span>*/}
                                                {/*</Tooltip></TableCell>*/}
                                                <TableCell style={{fontSize: '14px'}}>Save</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {token.limit_assets.map(limit_token => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>

                                                            <Select

                                                                style={{fontSize: '14px'}}
                                                                name={"type"}

                                                                id={limit_token.id}
                                                                error={limit_token.errs.type}
                                                                onChange={this.props.input_skip_token}
                                                                value={limit_token.type}
                                                            >
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black", fontSize: '14px'}}
                                                                          name={'type'}
                                                                          value={'take profit'} id={'take profit'}
                                                                          key={'take profit'}>take profit
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black", fontSize: '14px'}}
                                                                          name={'type'}
                                                                          value={'buy'} id={'buy'}
                                                                          key={'buy'}>buy
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black", fontSize: '14px'}}
                                                                          name={'type'}
                                                                          value={'sell'} id={'sell'}
                                                                          key={'sell'}>sell
                                                                </MenuItem>
                                                                <MenuItem parentId={limit_token.id}
                                                                          style={{color: "black", fontSize: '14px'}}
                                                                          name={'type'}
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
                                                                style={{width: "70px",}}
                                                                inputProps={{style: {fontSize: '14px'}}}
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
                                                                variant="standard"
                                                                style={{width: "30px",}}
                                                                inputProps={{style: {fontSize: '14px'}}}

                                                                id={limit_token.id}
                                                                value={limit_token.slippage}
                                                                onChange={this.props.input_skip_token}
                                                                name={'slippage'}
                                                                error={limit_token.errs.slippage}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                style={{fontSize: 14}}>{limit_token.curr_price ? limit_token.curr_price.toFixed(6) : limit_token.curr_price}</span>
                                                        </TableCell>


                                                        <TableCell>
                                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                                <TextField
                                                                    size="small"
                                                                    color="default"
                                                                    variant="standard"
                                                                    style={{width: "90px",}}
                                                                    inputProps={{style: {fontSize: '14px'}}}

                                                                    id={limit_token.id}
                                                                    value={limit_token.qnty}
                                                                    label={<span
                                                                        style={{fontSize: '12px'}}>{limit_token.type === 'buy' ? 'wbnb amount' : token.name.substr(0, 5) + ' amount'}</span>}
                                                                    onChange={this.props.input_skip_token}
                                                                    name={'qnty'}
                                                                    error={limit_token.errs.qnty}
                                                                />
                                                                <IconButton size={'small'} color="secondary"
                                                                            aria-label="delete"
                                                                            onClick={() => this.props.handleSetMax(token.id, limit_token.id, "limit_assets")}>
                                                                    <CallMissedOutgoingIcon fontSize="small"/>
                                                                </IconButton>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="standard"
                                                                style={{width: "30px",}}
                                                                inputProps={{style: {fontSize: '14px'}}}

                                                                id={limit_token.id}
                                                                value={limit_token.gas_plus}
                                                                onChange={this.props.input_skip_token}
                                                                name={'gas_plus'}
                                                                error={limit_token.errs.gas_plus}
                                                            />
                                                        </TableCell><TableCell>
                                                            <TextField
                                                                size="small"
                                                                color="default"
                                                                variant="standard"
                                                                style={{width: "30px",}}
                                                                inputProps={{style: {fontSize: '14px'}}}

                                                                id={limit_token.id}
                                                                value={limit_token.retry_count}
                                                                onChange={this.props.input_skip_token}
                                                                name={'retry_count'}
                                                                error={limit_token.errs.retry_count}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {limit_token.status}
                                                        </TableCell>

                                                        {/*<TableCell>*/}
                                                        {/*    <Checkbox name={'active'}*/}
                                                        {/*              slider*/}
                                                        {/*              id={limit_token.id}*/}
                                                        {/*              checked={limit_token.active}*/}
                                                        {/*              onChange={this.props.input_skip_token}*/}

                                                        {/*    />*/}
                                                        {/*</TableCell>*/}
                                                        <TableCell>
                                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                                <Button style={{color: limit_token.type === "buy" ? "#23a575" :'#b23434' }} size="small"
                                                                        aria-label="delete"
                                                                        onClick={() => this.props.updateAsset(limit_token)}>
                                                                    save
                                                                </Button>

                                                                <IconButton style={{color: '#b23434'}}
                                                                            variant="contained" size="small"
                                                                            aria-label="delete"
                                                                            onClick={() => this.props.deleteAsset(limit_token.id)}>
                                                                    <DeleteIcon fontSize="small"/>
                                                                </IconButton>

                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow>
                                                <TableCell>
                                                    <Select


                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.type}
                                                        name={'type'}

                                                        style={{fontSize: '14px'}}


                                                        onChange={this.props.input_skip_token}
                                                        error={this.props.new_limit.errs.type}
                                                    >
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black", fontSize: '14px'}}
                                                                  name={'type'}
                                                                  value={'take profit'} id={'take profit'}
                                                                  key={'take profit'}>take profit
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black", fontSize: '14px'}}
                                                                  name={'type'}
                                                                  value={'buy'} id={'buy'}
                                                                  key={'buy'}>buy
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black", fontSize: '14px'}}
                                                                  name={'type'}
                                                                  value={'sell'} id={'sell'}
                                                                  key={'sell'}>sell
                                                        </MenuItem>
                                                        <MenuItem parentId={this.props.new_limit.id}
                                                                  style={{color: "black", fontSize: '14px'}}
                                                                  name={'type'}
                                                                  value={'stop loss'} id={'stop loss'}
                                                                  key={'stop loss'}>stop loss
                                                        </MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="standard"
                                                        style={{width: "70px",}}
                                                        inputProps={{style: {fontSize: '14px'}}}
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
                                                        variant="standard"
                                                        style={{width: "30px",}}
                                                        inputProps={{style: {fontSize: '14px'}}}
                                                        fullWidth
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.slippage}
                                                        onChange={this.props.input_skip_token}
                                                        name={'slippage'}
                                                        error={this.props.new_limit.errs.slippage}
                                                    />

                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        style={{fontSize: 14}}>{this.props.new_limit.curr_price}</span>
                                                </TableCell>


                                                <TableCell>
                                                    <div style={{display: "flex", flexDirection: "row", margin: 0}}>
                                                        <TextField
                                                            size="small"
                                                            color="default"
                                                            variant="standard"
                                                            style={{width: "90px",}}
                                                            inputProps={{style: {fontSize: '14px'}}}
                                                            fullWidth
                                                            label={<span
                                                                style={{fontSize: '12px'}}>{this.props.new_limit.type === 'buy' ? 'wbnb amount' : token.name.substr(0, 5) + ' amount'}</span>}
                                                            type={'number'}
                                                            id={this.props.new_limit.id}
                                                            value={this.props.new_limit.qnty}
                                                            onChange={this.props.input_skip_token}
                                                            name={'qnty'}
                                                            error={this.props.new_limit.errs.qnty}
                                                        />
                                                        <IconButton size={'small'} color="secondary" aria-label="delete"
                                                                    onClick={() => this.props.handleSetMax(token.id, this.props.new_limit.id, "limit_assets")}>
                                                            <CallMissedOutgoingIcon fontSize="small"/>
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="standard"
                                                        style={{width: "30px",}}
                                                        inputProps={{style: {fontSize: '14px'}}}
                                                        fullWidth
                                                        type={'number'}
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.gas_plus}
                                                        onChange={this.props.input_skip_token}
                                                        name={'gas_plus'}
                                                        error={this.props.new_limit.errs.gas_plus}
                                                    />
                                                </TableCell><TableCell>
                                                    <TextField
                                                        size="small"
                                                        color="default"
                                                        variant="standard"
                                                        style={{width: "30px",}}
                                                        inputProps={{style: {fontSize: '14px'}}}
                                                        fullWidth
                                                        type={'number'}
                                                        id={this.props.new_limit.id}
                                                        value={this.props.new_limit.retry_count}
                                                        onChange={this.props.input_skip_token}
                                                        name={'retry_count'}
                                                        error={this.props.new_limit.errs.retry_count}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                            {this.props.new_limit.status}
                                                        </TableCell>

                                                {/*<TableCell>*/}
                                                {/*    <Checkbox name={'active'}*/}
                                                {/*              slider*/}
                                                {/*              id={this.props.new_limit.id}*/}
                                                {/*              checked={this.props.new_limit.active}*/}
                                                {/*              onChange={this.props.input_skip_token}*/}

                                                {/*    />*/}
                                                {/*</TableCell>*/}
                                                <TableCell>
                                                    <Button aria-label="delete"
                                                            onClick={() => this.props.updateAsset(this.props.new_limit)}
                                                            style={{color: this.props.new_limit.type === "buy" ? "#23a575" :'#b23434' }} size="small">
                                                        {this.props.new_limit.type === 'buy' ? 'buy' : 'sell'}
                                                    </Button>


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
                                        <button style={{marginRight: 10,borderColor: this.props.new_limit.errs.approve ? '#b23434' :""}}
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
