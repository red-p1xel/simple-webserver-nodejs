import crypto from 'node:crypto';
import { createSign, createVerify } from 'crypto';
import { FileData } from './fileLoad';

let signature: string;
let isVerified: boolean;

export interface ServerKeys {
  key?: Buffer;
  cert?: Buffer;
}

export function keyPairVerifier(
  data: Array<FileData<string, Buffer>>
): ServerKeys {
  const options: ServerKeys = {};
  let publicKey: crypto.KeyObject;
  let privateKey: crypto.KeyObject;

  for (const key of data) {
    if (key.content.toString().startsWith('-----BEGIN PRIVATE KEY-----')) {
      privateKey = crypto.createPrivateKey(key.content);
      const sign = createSign('SHA256');
      sign.write('--`.++.`--');
      sign.end();
      signature = sign.sign(privateKey, 'hex');
      options.key = key.content;
    }

    if (key.content.toString().startsWith('-----BEGIN CERTIFICATE-----')) {
      publicKey = crypto.createPublicKey(key.content);
      const verify = createVerify('SHA256');
      verify.write('--`.++.`--');
      verify.end();
      isVerified = verify.verify(publicKey, signature, 'hex');
      options.cert = key.content;

      console.info(
        `--::::--[ SSL CERTIFICATES VERIFICATION STATUS ::-> ${isVerified}`
      );
    }

    if (isVerified) break;
  }

  return options;
}
