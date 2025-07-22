import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigsService {
  async getConfigs() {
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const publicKey = process.env.STRIPE_PUBLIC_KEY || '';
    const version = process.env.version || '';

    // Base64 encode the values
    const encodedSecretKey = Buffer.from(secretKey).toString('base64');
    const encodedPublicKey = Buffer.from(publicKey).toString('base64');
    const encodedVersion = Buffer.from(version).toString('base64');

    return {
      secretKey: encodedSecretKey,
      publicKey: encodedPublicKey,
      version: encodedVersion,
    };
  }
}
