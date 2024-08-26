import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BiasedFlipModule = buildModule("BiasedFlipModule", (m) => {
  const ownerAddress = m.getParameter(
    "ownerAddress",
    process.env.OWNER_ADDRESS
  );

  const biasedFlipContract = m.contract("BiasedFlip", [ownerAddress]);

  return { biasedFlipContract };
});

export default BiasedFlipModule;
