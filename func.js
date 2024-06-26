const db = require("./firebase/firebase.js");
const util = require("./util.js");
const { substanceType } = require("./const.js");

// addRawData
exports.addRawData = async function addRawData(options) {
  const { nodeAddress, nodeSubstancesArray, loraData } = options;
  const { yyyyMM, dayDD, hhmmss } = util.getDate();

  const rawDataRef = db.collection(`raw-data/${yyyyMM}/day${dayDD}`);
  const nodeInfo = await exports.getNodeInfoByNodeAddress(nodeAddress);
  const dataObject = {
    nodeAddress: nodeAddress,
    date: `${yyyyMM}-${dayDD}`,
    timestamp: hhmmss,
    loraData: loraData,
    nodeInfo: nodeInfo,
    [substanceType[0]]: nodeSubstancesArray[0],
    [substanceType[1]]: nodeSubstancesArray[1],
    [substanceType[2]]: nodeSubstancesArray[2],
    [substanceType[3]]: nodeSubstancesArray[3],
    [substanceType[4]]: nodeSubstancesArray[4],
    [substanceType[5]]: nodeSubstancesArray[5],
    [substanceType[6]]: nodeSubstancesArray[6],
    [substanceType[7]]: nodeSubstancesArray[7],
  };

  try {
    console.log("[addRawData] dataObject : ", dataObject);
    rawDataRef.add(dataObject);
  } catch (error) {
    console.log("🚀 ~ addRawData ~ error:", error);
  }

  return;
};

exports.addErrData = function addErrData(options) {
  const { loraContent, nodeInfo, errMsg } = options;
  const { yyyyMM, dayDD, hhmmss } = util.getDate();
  const errDataRef = db.collection(`err-data/${yyyyMM}/day${dayDD}`);

  const dataObject = {
    date: `${yyyyMM}-${dayDD}`,
    timestamp: hhmmss,
    done: false,
    errCause: "",
    solution: "",
  };

  if (loraContent) dataObject["loraContent"] = loraContent;
  if (errMsg) dataObject["errMsg"] = errMsg;
  if (nodeInfo) dataObject["nodeInfo"] = nodeInfo;

  try {
    console.log("[addErrData] dataObject : ", dataObject);
    errDataRef.add(dataObject);
  } catch (error) {
    console.log("🚀 ~ addErrData ~ error:", error);
  }
  return;
};

exports.getNodeInfoByNodeAddress = async (nodeAddress) => {
  console.log("[getNodeInfoByNodeAddress] :", nodeAddress);
  const nodeInfoRef = db.collection("node-info").where("nodeAddress", "==", String(nodeAddress));

  const nodeInfoSnapshot = await nodeInfoRef.get();
  if (nodeInfoSnapshot.empty) {
    console.log("nodeInfoSnapshot is empty");
    return undefined;
  }

  let nodeInfo = nodeInfoSnapshot.docs[0].data();
  nodeInfo["docId"] = nodeInfoSnapshot.docs[0].id;
  console.log(nodeInfo);
  return nodeInfo;
};

// exports.getNodeInfoArr = async () => {
//   let nodeInfoArr = [];
//   const nodeInfoArrRef = db.collection("node-info");
//   const snapshot = await nodeInfoArrRef.get();

//   snapshot.forEach((doc) => {
//     let docData = doc.data();
//     docData["id"] = doc.id;
//     nodeInfoArr.push(docData);
//   });
//   return nodeInfoArr;
// };

// exports.updateNodeBattery = async (options) => {
//   const { nodeAddress, battery } = options;

//   const querySnapshot = await db
//     .collection("node-info")
//     .where("nodeAddress", "==", String(nodeAddress))
//     .get();

//   if (!querySnapshot.empty) {
//     const doc = querySnapshot.docs[0];
//     await db.collection("node-info").doc(doc.id).update({ battery: battery });
//   }

//   console.log("[updateNodeBattery] done", loraContent);
//   return;
// };

/*
  {
    data: "2024-01-01",
    timestamp: "15:30:12",
    node: "1",
    temperature: "12",
    humidity: "27",
    pm25: "8",
    pm10: "8",
    ch2o: "0.001",
    wind_direction: "SW",
    wind_speed: "5.00",
  }
*/
