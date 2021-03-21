import React from "react";
import {Accordion, Icon, Segment} from "semantic-ui-react";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

export class SkipTokens extends React.Component {


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
                                    {token.name}
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <TextField
                                            size="small"
                                            color="default"
                                            label={'token name'}
                                            value={token.name} onChange={this.props.input_skip_token} name={'name'}
                                            error={token.errs.name}
                                            variant="outlined"
                                            fullWidth
                                            style={{marginBottom: 10}}
                                        />
                                        <TextField
                                            size="small"
                                            color="default"
                                            label={'token address'}
                                            value={token.addr} onChange={this.props.input_skip_token} name={'addr'}
                                            error={token.errs.addr}
                                            variant="outlined"
                                            fullWidth
                                            style={{marginBottom: 10}}
                                        />
                                        <div style={{display: "flex"}}>
                                            <Button color="secondary" variant="outlined" size="small" onClick={() => this.props.updateSkip(token)}
                                                    >
                                                Update
                                            </Button>
                                            <Button style={{marginLeft: 20}} color="secondary"  size="small"
                                                    onClick={() => this.props.deleteSkip(token.addr)}
                                                    variant="contained">
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Accordion.Content>

                            </div>
                        ))}
                </Accordion>
            </Segment>
        )
    }
}
