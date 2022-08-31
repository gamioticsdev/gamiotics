import {
    validate,
    validateOrReject,
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    Min,
    Max,
  } from 'class-validator';
export class Skill {
    @Length(5, 30)
    skillName: string;

    category: number;
}