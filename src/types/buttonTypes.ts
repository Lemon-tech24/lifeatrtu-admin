export interface Button {
  style?: string;
  content: string;
  type: "submit" | "button";
  onClick?: () => void;
  onSubmit?: () => void;
}
