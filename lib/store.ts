import type { EstimateResult } from '@/lib/api';

class GlobalStore {
  private _estimateResult: EstimateResult | null = null;

  get estimateResult() {
    return this._estimateResult;
  }

  setEstimateResult(result: EstimateResult | null) {
    this._estimateResult = result;
  }
}

export const store = new GlobalStore();
