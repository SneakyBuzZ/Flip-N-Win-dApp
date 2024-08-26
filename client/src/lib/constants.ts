export const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "ownerAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CoinFlip__GameIsOpen",
    type: "error",
  },
  {
    inputs: [],
    name: "CoinFlip__InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "getOwnerAddres",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_choice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_coinSide",
        type: "uint256",
      },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const NAV_ELEMENTS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kaushik-katikala/",
  },
  {
    name: "Github",
    href: "https://github.com/SneakyBuzZ/Flip-N-Win-dApp",
  },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/1mX67d6fpYiyrNqEb1qTTj16E_UlNm-2d/view?usp=sharing",
  },
];
