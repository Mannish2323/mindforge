// src/database/identity/repository.ts

import { Identity } from "./model";
import { IRepository } from "../../repositories/interfaces/IRepository";

/** Repository interface for Identity domain */
export interface IIdentityRepository extends IRepository<Identity> {}
