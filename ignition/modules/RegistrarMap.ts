import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const RegistrarMapModule = buildModule("RegistrarMapModule", (m) => {
  const multicallerWithSigner = m.getParameter('multicallerWithSigner')

  const registrarMap = m.contract("RegistrarMap", [multicallerWithSigner], {
  })

  return { registrarMap }
})

export default RegistrarMapModule
