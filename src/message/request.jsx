const LOGIN = 0;
const LOGOUT = 1;
const CHAT = 2;

/**
 * 
 * @param {String} s
 * @returns {Uint8Array}
 */
function encodeString(s) {
    let encoder = new TextEncoder();
    let encodedString = encoder.encode(s);
    const buffer = new Uint8Array(8+encodedString.byteLength);
    let view = new DataView(buffer.buffer);
    view.setUint32(0, encodedString.byteLength, true);
    view.setUint32(4, 0, true);
    encodedString.forEach((byte, idx) => {
        view.setUint8(8+idx, byte);
    });
    return buffer;
}

/**
 * 
 * @param {Uint8Array} key
 * @param {ArrayBuffer} buffer
 */
function writeKey(key, buffer) {
    const keyView = new DataView(buffer, 0, 8);
    for(let idx = 0; idx<key.length; idx+=1) {
        keyView.setUint8(idx, key[idx]);
    }
}

/**
 * 
 * @param {number} tag
 * @param {ArrayBuffer} buffer
 */
function writeTag(tag, buffer) {
    const tagView = new DataView(buffer, 8, 12);
    tagView.setUint32(0, tag, true);
}
/**
 * 
 * @param {Uint8Array} key
 * @param {String} name
 */
function login(key, name) {
    const nameEncoded = encodeString(name);
    const buffer = new ArrayBuffer(12+nameEncoded.byteLength);
    writeKey(key, buffer);
    writeTag(LOGIN, buffer);
    const nameView = new DataView(buffer, 12);
    nameEncoded.forEach((byte, idx) => {
        nameView.setUint8(idx, byte);
    })
    return buffer;
}

/**
 * 
 * @param {Uint8Array} key
 * @param {number} idx
 */
function logout(key, idx) {
    const buffer = new ArrayBuffer(12+1);
    writeKey(key, buffer);
    writeTag(LOGOUT, buffer);
    new DataView(buffer, 12).setUint8(idx);
    return buffer;
}

/**
 * 
 * @param {Uint8Array} key
 * @param {string} msg
 */
function chat(key, msg) {
    const msgEncoded = encodeString(msg);
    const buffer = new ArrayBuffer(12+msgEncoded.byteLength);
    writeKey(key, buffer);
    writeTag(CHAT, buffer);
    const msgView = new DataView(buffer, 12);
    msgEncoded.forEach((byte, idx) => {
        msgView.setUint8(idx, byte);
    })
    return buffer;
}

export default function serde(request) {
    switch(request.tag) {
        case 'login' : {
            return login(request.key, request.body.name);
        }
        case 'logout' : {
            return logout(request.key, request.body.idx);
        }
        case 'chat' : {
            return chat(request.key, request.body.msg);
        }
        default: {
            console.error(request.tag + " is an unknown tag");
        }
    }
}