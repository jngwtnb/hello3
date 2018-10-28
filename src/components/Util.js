import jsSHA from 'jssha';

export default {
  generateDeviceId() {
    let id;

    if (window.cordova && window.device) {
      var shaObj = new jsSHA("SHA-256", "TEXT");
      shaObj.update(window.device.uuid + "a.r.c.t.u.r.u.s");
      var sha256digest = shaObj.getHash("HEX");
      id = sha256digest.substring(0, 20);
    } else {
      id = '13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5';
    }

    return id;
  },

  generateRandomDeviceId() {
    let len = Math.floor(Math.random()*10) + 26;
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    let charsLen = chars.length;
    let id = "";
    for (let i=0; i<len; i++) {
      id += chars[Math.floor(Math.random()*charsLen)];
    }
    return id;
  }
}