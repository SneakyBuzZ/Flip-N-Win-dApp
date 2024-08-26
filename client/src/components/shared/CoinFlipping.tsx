import { delay } from "@/lib/utils";
import { useState, useEffect } from "react";

const headCoinSvg = "/assets/images/head-coin.svg";
const tailCoinSvg = "/assets/images/tails-coin.svg";

const CoinFlipping = ({
  isLoading,
  tossedSide,
}: {
  isLoading: boolean;
  tossedSide: number;
}) => {
  const [coinSide, setCoinSide] = useState(headCoinSvg);

  useEffect(() => {
    if (isLoading) {
      delay(1000).then(() => {
        setInterval(() => {
          setCoinSide(coinSide === headCoinSvg ? tailCoinSvg : headCoinSvg);
        }, 600);
      });
    }
  }, [coinSide]);

  return (
    <>
      {isLoading ? (
        <>
          <img src={coinSide} alt="Coin" className="coin-flip mx-auto" />
        </>
      ) : (
        <img
          src={tossedSide === 1 ? headCoinSvg : tailCoinSvg}
          alt="Coin"
          className="mx-auto h-24 w-24"
        />
      )}
    </>
  );
};

export default CoinFlipping;
