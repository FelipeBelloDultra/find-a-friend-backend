import { Either } from "~/core/either";

type UseCaseOutput = Promise<Either<void, void>>;

export interface UseCase<Input = unknown, Output = UseCaseOutput> {
  execute: (input: Input) => Output;
}
