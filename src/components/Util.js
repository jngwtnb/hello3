import React from 'react';
import jsSHA from 'jssha';

export default {
  generateDeviceId() {
    let addr;

    if (window.cordova && window.device) {
      var shaObj = new jsSHA("SHA-256", "TEXT");
      shaObj.update(window.device.uuid + "a.r.c.t.u.r.u.s");
      var sha256digest = shaObj.getHash("HEX");
      addr = sha256digest.substring(0, 20);
    } else {
      addr = '13CZLXCy6MD2L4iwEeeyXTB8pDAmdQyhD5';
    }

    return addr;
  },

  generateRandomDeviceId() {
    let len = Math.floor(Math.random()*10) + 26;
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    let charsLen = chars.length;
    let addr = "";
    for (let i=0; i<len; i++) {
      addr += chars[Math.floor(Math.random()*charsLen)];
    }
    return addr;
  }
}