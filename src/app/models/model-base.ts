export interface ModelBase {
  id?: string; // Optional ID for the model, used for identification in the database
  createdAt?: number; // Optional creation date, useful for tracking when the model was created
  active?: boolean; // Optional flag to indicate if the model is active or notname
}
