export interface EventHandler {
  setupSubscriptions(): void;
  listen: () => void;
}
