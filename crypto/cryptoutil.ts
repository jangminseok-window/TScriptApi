import bcrypt from 'bcryptjs';

const saltRounds = 10;

interface CryptoUtil {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

const cryptoUtil: CryptoUtil = {
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }
};

export default cryptoUtil;