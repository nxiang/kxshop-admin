import React, { useState, useEffect } from 'react';
import Css from './PhotoRichText.module.scss';
let editor = null;
function PhotoRichText(props) {
  return (
    <div>
      <div
        className={Css['rich_text_box']}
        dangerouslySetInnerHTML={{
          __html: props.itemData && props.itemData.length && props.itemData[0].data,
        }}
      />
    </div>
  );
}

export default PhotoRichText;
