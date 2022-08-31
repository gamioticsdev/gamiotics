import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { Users } from '@src/entity/Users';
import crypto from 'crypto';
import { hashSync } from 'bcrypt';
export class addNonceToExistingUsersPasswords1658255233773 implements MigrationInterface {

  public async up(_queryRunner: QueryRunner): Promise<void> {
    const userRepository = getRepository(Users);
    const users = await userRepository.find({});
    //for Each user generate Nonce, save the nonce, hash the passwords witih nonce save
    const promises = users.map((user) => {
      const nonce = crypto.randomBytes(16).toString('base64');
      user.nonce = nonce;
      console.log('nonce', nonce);
      user.password = hashSync('123456gamiotics' + nonce, 10);
      return userRepository.save(user);
    });
    await Promise.all(promises);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }
}
