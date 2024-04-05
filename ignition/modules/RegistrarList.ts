import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const RegistrarListModule = buildModule("RegistrarListModule", (m) => {
  const multicallerWithSigner = m.getParameter('multicallerWithSigner')

  const registrarList = m.contract("RegistrarList", [multicallerWithSigner], {
  })

  return { registrarList }
})

export default RegistrarListModule
