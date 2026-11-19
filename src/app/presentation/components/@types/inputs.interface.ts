export default interface ValidatableInput {
  error: boolean;
  errorMessage: string;
  refreshValidationState?: () => void;
}
