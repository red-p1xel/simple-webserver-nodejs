import crypto from 'node:crypto';
import { createSign, createVerify } from 'crypto';

let publicKey: crypto.KeyObject;
let privateKey: crypto.KeyObject;

let signature: string;
let isVerified: boolean;

export function keyPairVerifier(data: object) {
  const keys = Object.values(data).splice(0, 1)[0];

  for (const key of keys) {
    if (key.data.startsWith('-----BEGIN PRIVATE KEY-----')) {
      privateKey = crypto.createPrivateKey(key.data);
      const sign = createSign('SHA256');
      sign.write('--`.++.`--');
      sign.end();
      signature = sign.sign(privateKey, 'hex');
    }

    if (key.data.startsWith('-----BEGIN CERTIFICATE-----')) {
      publicKey = crypto.createPublicKey(key.data);
      const verify = createVerify('SHA256');
      verify.write('--`.++.`--');
      verify.end();
      isVerified = verify.verify(publicKey, signature, 'hex');

      console.info(
        `--::::--[ SSL CERTIFICATES VERIFICATION STATUS ::-> ${isVerified}`
      );
    }

    // Break when first founded keypair is completely verified
    if (isVerified) break;
  }

  return isVerified;
}

// TODO: Implement feature generate keypair
