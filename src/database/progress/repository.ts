// src/database/progress/repository.ts

import { IRepository } from "../../repositories/interfaces/IRepository";
import { Progress } from "./model";

/** Repository interface for Progress domain */
export interface IProgressRepository extends IRepository<Progress> {}
