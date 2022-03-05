const LOGIN_SUCCESS = 0;
const CHAT          = 1;
const NOTICE        = 2;

/**
 * @param {DataView} view
 * @return {Uint8Array}
 */
function getString(offset, view) {
    const size = view.getUint32(offset, true);
    const bytes = [];
    for (let idx = 0; idx < size; idx += 1) {
        const byte = view.getUint8(offset+8+idx);
        bytes.push(byte);
    }
    return new Uint8Array(bytes);
}

/**
 * @param {ArrayBuffer} bin
 * @returns {any}
 */
export default function deserde(bin) {
    const tag = new Uint8Array(bin)[0];
    const view = new DataView(bin, 4);
    const decoder = new TextDecoder();
    switch (tag) {
        case LOGIN_SUCCESS:
            const idx = view.getUint8(0);
            return {
                tag: 'loginSuccess',
                body: {
                    idx: idx
                }
            }
        case CHAT:
            console.log(new Uint8Array(view.buffer));
            let sender = getString(0, view);
            let msg = getString(8+sender.byteLength, view);
            sender = decoder.decode(sender, {stream:true});
            msg = decoder.decode(msg);
            return {
                tag: 'chat',
                body: {
                    sender: sender,
                    msg: msg
                }
            }
        case NOTICE: {
            let msg = getString(0, view);
            msg = decoder.decode(msg);
            return {
                tag: 'notice',
                body: {
                    msg: msg
                }
            }
        }
        default:
            break;
    }
}