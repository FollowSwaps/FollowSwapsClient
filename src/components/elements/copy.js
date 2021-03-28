import React from 'react';
import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from "@material-ui/core/Button";
class Copy extends React.Component {
  state = {
    value: '0x7E5d0E84175dd07898aDa673fA7F5004f5E38Ef3',
    copied: false,
      variant:'outlined',
      txt:'Copy contract address'
  };

  render() {
    return (
      <Button variant={this.state.variant} style={{backgroundColor:'rgb(153,89,51)',marginBottom:'0px'}}>
<CopyToClipboard text={this.state.value}
          onCopy={() => this.setState({copied: true,variant:'contained',txt:'Contract address copied'})}>
    <span>{this.state.txt} </span>
        </CopyToClipboard>


      </Button>
    );
  }
}

export default Copy;