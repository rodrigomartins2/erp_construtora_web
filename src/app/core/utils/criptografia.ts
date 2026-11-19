export class Criptografia {

    static toBinary(value: string) {
         const codeUnits = new Uint16Array(value.length);
         for (let i = 0; i < codeUnits.length; i++) {
             codeUnits[i] = value.charCodeAt(i);
         }
         const charCodes = new Uint8Array(codeUnits.buffer);
         let result = '';
         for (let i = 0; i < charCodes.byteLength; i++) {
             result += String.fromCharCode(charCodes[i]);
         }
         const encoded = btoa(result);
         return encoded;
     };
 
     static fromBinary(value: string) {
      if (!value || typeof value !== 'string') {
        return '';
      }

      try {
         const decoded = atob(value);
 
         const bytes = new Uint8Array(decoded.length);
         for (let i = 0; i < bytes.length; i++) {
           bytes[i] = decoded.charCodeAt(i);
         }
         const charCodes = new Uint16Array(bytes.buffer);
         let result = '';
         for (let i = 0; i < charCodes.length; i++) {
           result += String.fromCharCode(charCodes[i]);
         }
         return result;
      } catch {
        return '';
      }
       }
 }