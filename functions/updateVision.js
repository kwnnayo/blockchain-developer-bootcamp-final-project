export const updateVision = (vision, setVision, visionContract) => {

  visionContract.methods.getVision().call().then((visionData) => {
    visionData.visionAddress = vision.visionAddress;
    setVision(visionData);
  });
};