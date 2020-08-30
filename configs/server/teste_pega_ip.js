const os = require('os');

function getListenIps() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
 
  Object.keys(interfaces).forEach((netInterface) => {
   interfaces[netInterface].forEach((interfaceObject) => {
    if (interfaceObject.family === 'IPv4' && !interfaceObject.internal) {
     addresses.push({ ip: interfaceObject.address, announcedIp: null });
    }
   });
  });
  console.log(addresses);
 }
getListenIps()
