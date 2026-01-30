import { DatabaseError } from '../helpers/errors/database.errors.js';
import type { IRefreshTokenRepository } from '../interfaces/refresh-token.interfaces.js';
import {
  RefreshTokenModel,
  type RefreshTokenDocument,
} from '../models/refresh-token.model.js';
import type { RefreshTokenCreateDTO } from '../types/refresh-token.types.js';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenDocument> {
    try {
      const tokenDoc = await RefreshTokenModel.create(newData);

      return tokenDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneByToken(token: string): Promise<RefreshTokenDocument | null> {
    try {
      const tokenDoc = await RefreshTokenModel.findOne({ token });

      return tokenDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async revoke(refreshTokenId: string): Promise<RefreshTokenDocument | null> {
    try {
      const tokenDoc = await RefreshTokenModel.findOneAndUpdate(
        { _id: refreshTokenId },
        { $set: { replacedAt: new Date(), isRevoked: true } },
        { new: true },
      );

      return tokenDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async invalidFamilyById(familyId: string): Promise<void> {
    try {
      await RefreshTokenModel.updateMany(
        { familyId },
        { $set: { isRevoked: true } },
      );
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
