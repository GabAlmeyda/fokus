export interface RefreshTokenCreateDTO {
  userId: string;
  familyId: string;
}

export interface RefreshTokenResponseDTO {
  id: string;
  userId: string;
  token: string;
  familyId: string;
  isRevoked: boolean;
  replacedAt: Date | undefined;
  expiresAt: Date;
}
