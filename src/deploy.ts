import { DeployOptions, DeployResult } from "hardhat-deploy/dist/types";
import { WrappedPolyjuiceProvider } from "./provider";

export const patchDeploy = (
  hre: any,
  wrappedPolyjuiceProvider: WrappedPolyjuiceProvider
) => {
  if (!hre.deployments) {
    console.warn(
      "Make sure you this plugin after hardhat-deploy in your hardhat.config.ts."
    );
    return;
  }
  const oldDeploy = hre.deployments.deploy;
  const newDeploy = async (
    name: string,
    options: DeployOptions
  ): Promise<DeployResult> => {
    if (options.args) {
      const contractArtifact = await hre.deployments.getExtendedArtifact(name);
      options.args = await wrappedPolyjuiceProvider.polyjuiceWallet.convertDeployArgs(
        options.args,
        contractArtifact.abi,
        contractArtifact.bytecode
      );
    }
    const result = await oldDeploy(name, options);
    const delayAfterDeploy = hre.network.config.godwokenConfig.delayAfterDeploy;

    if (delayAfterDeploy) {
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          delayAfterDeploy === true ? 10000 : delayAfterDeploy
        )
      );
    }

    return result;
  };
  hre.deployments.deploy = newDeploy;
};
