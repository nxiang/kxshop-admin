
import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
import Css from './ColorItem.module.scss';
import { Button } from 'antd';

class ColorItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false
    };
  }  
  
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.props.alterChange(color.rgb)
  };

  handleReset = () => {
    let resetValue = this.props.reset || {r: 0, g: 0, b: 0, a: 1}
    this.props.alterChange(resetValue)
  }

  render() {
    const { text, color } = this.props
    const { displayColorPicker } = this.state
    const styles = reactCSS({
      'default': {
        color: {
          background: `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`,
        }
      },
    });
    return (
      <div className={Css['color-item']}>
        <p>{text}</p>
        <div>
          <div className={Css['color-block']} >
            <div className={Css['color-swatch']} onClick={ this.handleClick }>
              <div className={Css['color-color']} style={styles.color} />
            </div>
            { displayColorPicker 
              ? <div className={Css['color-popover']}>
                  <div className={Css['color-cover']} onClick={ this.handleClose }/>
                  <div className={Css['color-picker']} >
                    <SketchPicker color={ color } onChange={ this.handleChange } />
                  </div>
                </div> 
              : null }
          </div>
          <Button className={Css['color-reset']} type="link" onClick={ this.handleReset }>重置</Button>
        </div>
      </div>
    );
  }
}

export default ColorItem;