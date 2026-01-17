import type { RouterOutputs } from ".";

export type ListSummaryType = RouterOutputs["list"]["readAll"][number];
export type ListDetailType = NonNullable<RouterOutputs["list"]["readById"]>;

// export type MeasurableType = RouterOutputs["measurable"]["findAll"][number];
// export type ResultType = RouterOutputs["result"]["findAll"][number];
// export type BloodPressureReadingType = NonNullable<
//   ResultType["bloodPressureReading"]
// >;
// export type WeighInType = NonNullable<ResultType["weighIn"]>;
