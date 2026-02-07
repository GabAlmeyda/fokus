export type RefreshTokenCreateDTO = {
  userId: string;
  familyId: string;
};

export type RefreshTokenResponseDTO = {
  id: string;
  userId: string;
  token: string;
  familyId: string;
  isRevoked: boolean;
  replacedAt: Date | undefined;
  expiresAt: Date;
};
