const base64Table = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./";
const BASE64_ENCODING = "BASE64";
const BASE16_ENCODING = "HEX";
const PAD = '_';
const REGEX = "^" + PAD + "{0,2}[" + base64Table + "]*$";

module.exports = {
    toB64: function (buffer, usePadding = false) {
        var len = buffer.length, pos = len % 3, c;
        var b0 = 0, b1 = 0, b2 = 0;

        var result = [];

        var i = 0;
        if (usePadding) {
            for (i = pos; i != 0; i = (i + 1) % 3) {
                result.push(PAD);
            }
            i = 0;
        }
        switch (pos) {
            case 2:
                b1 = buffer[i++];
                c = ((b0 & 3) << 4) | ((b1 & 0xf0) >>> 4);
                result.push(base64Table[c]);
            case 1:
                b2 = buffer[i++];
                c = ((b1 & 0xf) << 2) | ((b2 & 0xc0) >>> 6);
                result.push(base64Table[c]);
                c = b2 & 0x3f;
                result.push(base64Table[c]);
                break;
        }

        while (pos < len) {
            b0 = buffer[pos++];
            b1 = buffer[pos++];
            b2 = buffer[pos++];
            c = (b0 & 0xfc) >>> 2;
            result.push(base64Table[c]);
            c = ((b0 & 3) << 4) | ((b1 & 0xf0) >>> 4);
            result.push(base64Table[c]);
            c = ((b1 & 0xf) << 2) | ((b2 & 0xc0) >>> 6);
            result.push(base64Table[c]);
            c = b2 & 0x3f;
            result.push(base64Table[c]);
        }

        return result.join('');
    },

    fromB64: function (str) {
        if (str.length == 0) {
            return [];
        }

        while (str.length % 4 != 0) {
            str = PAD + str;
        }
        if (!str.match(REGEX)) {
            throw { message: "not valid base64 string" };
        }
        var bos = [];

        var y = 0;
        for (var i = 0, n = str.length; i < n;) {
            let pos0 = base64Table.indexOf(str.charAt(i++));
            let pos1 = base64Table.indexOf(str.charAt(i++));
            let pos2 = base64Table.indexOf(str.charAt(i++));
            let pos3 = base64Table.indexOf(str.charAt(i++));
            if (pos0 > -1) {
                bos.push(((pos1 & 0x30) >>> 4) | (pos0 << 2));
            }
            if (pos1 > -1) {
                bos.push(((pos2 & 0x3c) >>> 2) | ((pos1 & 0xf) << 4));
            }
            bos.push(((pos2 & 3) << 6) | pos3);
        }
        return new Uint8Array(bos);
    }
}
