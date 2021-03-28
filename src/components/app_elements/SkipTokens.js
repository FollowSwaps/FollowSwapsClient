import React from "react";
import {Accordion, Icon, Segment} from "semantic-ui-react";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {ReactComponent as MoreVertIcon} from "../../icons/more_vert.svg";

export class SkipTokens extends React.Component {


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
                                        <span className="accordion-header">{token.name}</span>
                                        <MoreVertIcon className="accordion-icon"/>
                                    </div>
                                </Accordion.Title>
                                <Accordion.Content active={this.props.activeIndexAccordion === token.id}>
                                    <span className="accordion-header-text">
                                            Skip token
                                        </span>
                                    <div className="space-after-header"></div>
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <TextField
                                            label="Token name"
                                            size="small"
                                            color="default"
                                            value={token.name} onChange={this.props.input_skip_token} name={'name'}
                                            error={token.errs.name}
                                            variant="outlined"
                                            fullWidth
                                            style={{marginBottom: 10}}
                                        />
                                        <TextField
                                            label="Token address"
                                            size="small"
                                            color="default"
                                            value={token.addr} onChange={this.props.input_skip_token} name={'addr'}
                                            error={token.errs.addr}
                                            variant="outlined"
                                            fullWidth
                                            style={{marginBottom: 10}}
                                        />
                                        <div style={{display: "flex", marginTop: 30}}>
                                            <button className="outlined-button" onClick={() => this.props.updateSkip(token)}
                                                    >
                                                Update
                                            </button>
                                            <button style={{marginLeft: 20}} className="outlined-button"
                                                    onClick={() => this.props.deleteSkip(token.addr)}
                                            >
                                                Delete
                                            </button>
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
