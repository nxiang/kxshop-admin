import React, { useState, useEffect } from 'react';
import Css from './PhotoVideo.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils'

export default function PhotoVideo(props) {
  const { itemData, propertiesArr } = props;
  let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr)
  return (
    <div className={`
      ${Css['photo-video-box']}
      ${hasPdTb && Css['propPaddingTB']} 
      ${hasPdLR && Css['propPaddingLR']}
    `}>
      <video
        className={`
          ${Css['photo-video']} 
          ${hasRadius && Css['propRadius']}
        `}
        src={itemData.videoUrl}
        poster={itemData.videoCover}
      />
    </div>
  );
}
