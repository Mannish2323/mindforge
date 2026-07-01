// src/database/analytics/repository.ts

import { IRepository } from "../../repositories/interfaces/IRepository";
import { AnalyticsRecord } from "./model";

/** Repository interface for Analytics domain */
export interface IAnalyticsRepository extends IRepository<AnalyticsRecord> {}
