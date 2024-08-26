import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CoinFlipModule = buildModule("CoinFlipModule", (m) => {
  const vrfCoordinatorV2 = m.getParameter(
    "vrfCoordinatorV2",
    "0x9ddfaca8183c41ad55329bdeed9f6a8d53168b1b"
  ); // Replace with your VRF Coordinator address
  const gasLane = m.getParameter(
    "gasLane",
    "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae"
  ); // Replace with your gas lane
  const subscriptionId = m.getParameter(
    "subscriptionId",
    process.env.SUBSCRIPTION_ID
  ); // Replace with your subscription ID
  const callbackGasLimit = m.getParameter("callbackGasLimit", "100000");
  const ownerAddress = m.getParameter(
    "ownerAddress",
    process.env.OWNER_ADDRESS
  ); // Replace with your callback gas limit

  const coinFlipContract = m.contract("CoinFlip", [
    vrfCoordinatorV2,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    ownerAddress,
  ]);

  return { coinFlipContract };
});

export default CoinFlipModule;
