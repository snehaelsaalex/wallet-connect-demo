import React from 'react'
// import * as PropTypes from "prop-types";

const ASAIcon = (props: { assetID: number }) => {
  const src: string = `https://algoexplorer.io/images/assets/big/light/${props.assetID}.png`;
  return (
    <img src={src} width={"30px"} height={"30px"} />
  )
};

// ASAIcon.propTypes = {
//   assetID: PropTypes.number,
//   size: PropTypes.number,
// };

// ASAIcon.defaultProps = {
//   assetID: 0,
//   size: 20,
// };

export default ASAIcon;
