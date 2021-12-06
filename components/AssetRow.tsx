import * as React from "react";
import ASAIcon from "./ASAIcon";
import algo from "../public/assets/algo.png";
import { IAssetData } from "../helpers/types";
import { formatBigNumWithDecimals } from "../helpers/utilities";



const AssetRow = (props: { asset: IAssetData }) => {
  const { asset } = props;
  const nativeCurrencyIcon = asset.id === 0 ? algo.src : null;
  return (
    // <div {...props}>
    //   <div>
    //     {nativeCurrencyIcon ? <img src={nativeCurrencyIcon} width={"30px"} height={"30px"} /> : <ASAIcon assetID={asset.id} />}
    //     <div>{asset.name}</div>
    //   </div>
    //   <div>
    //     <div>
    //       {`${formatBigNumWithDecimals(asset.amount, asset.decimals)} ${asset.unitName || "units"}`}
    //     </div>
    //   </div>
    // </div>

    <div className="card" {...props}>
      {nativeCurrencyIcon ? <img src={nativeCurrencyIcon} style={{ width: '100%' }} /> : <ASAIcon assetID={asset.id} />}
      <div className="container">

        <div style={{ padding: '20px' }}> Balance : {`${formatBigNumWithDecimals(asset.amount, asset.decimals)} ${asset.unitName || "units"}`} </div>
      </div>
    </div>
  );
};

export default AssetRow;
