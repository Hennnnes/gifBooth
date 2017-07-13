import React from 'react';

import './Preview.css';
import Loader from '../Loader/Loader.js';

// let blob;

class Preview extends React.Component {
    // componentDidUpdate(){
    //   let contentType = contentType || '';
    //   var byteCharacters = atob(this.props.url);
    //   var byteNumbers = new Array(byteCharacters.length);
    //   for (var i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    //   }
    //   var byteArray = new Uint8Array(byteNumbers);
    //   blob = new Blob([byteArray], {type: contentType});
    // }


    render(){
      let downloadClassName = (this.props.customImage) ? 'download_button active' : 'download_button';
      let test;
      if(this.props.visible){
        test = <Loader />
      } else if(this.props.counter <= '3'){
        test = <div className="counter">{this.props.counter}</div>;
      } else {
        test = <img src={this.props.url} alt="some waiting gif" className="preview_image"/>
      }
      return(
        <div className="preview_wrapper">

          {/* {this.props.visible ? <Loader /> :  <img src={this.props.url} alt="some waiting gif" className="preview_image"/>} */}
          {/* <img src={props.url} alt="some waiting gif" className="preview_image"/> */}
          {/* {this.props.counter <= '3' && this.props.counter} */}
          {test}
          <a href={this.props.url} download="awesome.gif" className={downloadClassName}>download</a>
        </div>
    )
  }
}

export default Preview;
